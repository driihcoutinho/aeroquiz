/**
 * Script para extrair questões dos arquivos DOCX do CMS ANAC
 * Parser com regex otimizado para formato real dos documentos
 */

import fs from 'fs/promises';
import mammoth from 'mammoth';
import { GABARITOS_COMPLETOS } from '../shared/data/gabaritos';

interface Question {
  id: number;
  question: string;
  options: [string, string, string, string];
  correctAnswer: number;
  category: string;
  module: string;
}

async function extractTextFromDOCX(filePath: string): Promise<string> {
  const buffer = await fs.readFile(filePath);
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
}

function cleanText(text: string): string {
  return text
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/\u00A0/g, ' ')
    .replace(/[""]/g, '"')
    .replace(/['']/g, "'")
    .replace(/\*\*/g, '')  // Remover **
    .replace(/\s+From page \d+/gi, '')  // Remover "From page X" em qualquer posição
    .replace(/\s+Now, from page \d+/gi, '')  // Remover "Now, from page X" em qualquer posição
    .replace(/:\s*$/, '')  // Remover dois-pontos no final
    .trim();  // Trim final após limpezas
}

function parseQuestionsFromText(
  text: string,
  module: keyof typeof GABARITOS_COMPLETOS
): Question[] {
  const questions: Question[] = [];
  
  // Pré-normalizar o texto conforme recomendação do architect:
  // 1. Colapsar whitespace
  let normalized = text.replace(/\s+/g, ' ');
  // 2. Injetar \n antes de cada questão numerada
  normalized = normalized.replace(/(\d{3})-/g, '\n$1-');
  
  // Regex determinístico que usa marcadores explícitos a) b) c) d)
  const questionPattern = /(\n|^)(\d{3})-\s*(.*?)\s*a\)\s*(.*?)\s*b\)\s*(.*?)\s*c\)\s*(.*?)\s*d\)\s*(.*?)(?=(\n\d{3}-|$))/gs;
  
  let match;
  let matchCount = 0;
  
  while ((match = questionPattern.exec(normalized)) !== null) {
    matchCount++;
    const [, , numStr, questionText, optA, optB, optC, optD] = match;
    const questionNum = parseInt(numStr);
    const questionId = String(questionNum).padStart(3, '0');
    
    // Pular questão 395 do módulo ESS
    if (module === 'ESS' && questionNum === 395) {
      console.log(`⏭️  Pulando questão ${questionId} (ESS) conforme solicitação`);
      continue;
    }
    
    // Validar contra gabarito
    const gabarito = GABARITOS_COMPLETOS[module][questionId];
    
    if (!gabarito) {
      console.warn(`⚠️  Gabarito não encontrado: ${module} ${questionId}`);
      continue;
    }
    
    const correctIndex = ['A', 'B', 'C', 'D'].indexOf(gabarito);
    
    if (correctIndex === -1) {
      console.error(`❌ Resposta inválida no gabarito: ${module} ${questionId} = ${gabarito}`);
      continue;
    }
    
    // Limpar texto da questão e opções
    const cleanedQuestion = cleanText(questionText);
    const cleanedOptions = [
      cleanText(optA),
      cleanText(optB),
      cleanText(optC),
      cleanText(optD)
    ];
    
    // Validar texto da QUESTÃO contra meta-texto e corrupção GRAVE
    // (Nota: "From page X" já é removido pelo cleanText, não precisa validar)
    const questionCorruptionPatterns = [
      'page \\d+ with',
      'should transcribe',
      'continue até',
      'continuam as questões',
      'primeiro modulo',
      'first module',
      'i need to',
      'looking at the file',
      'caso deseje que eu'
    ];
    
    const hasCorruptedQuestion = questionCorruptionPatterns.some(pattern => 
      new RegExp(pattern, 'i').test(cleanedQuestion)
    );
    
    if (hasCorruptedQuestion) {
      console.warn(`⚠️  Questão ${questionId} tem texto corrompido, pulando`);
      continue;
    }
    
    // Validar que todas as opções existem (podem ser curtas, ex: "sim", "não")
    const emptyOptions = cleanedOptions.filter(opt => !opt || opt.length === 0);
    if (emptyOptions.length > 0) {
      console.error(`❌ Questão ${questionId} tem ${emptyOptions.length} opção(ões) vazia(s)`);
      continue;
    }
    
    // Validar que nenhuma opção contém texto claramente corrompido
    const hasClearlyCorruptedOption = cleanedOptions.some(opt => 
      opt.length > 500 || // Opção extremamente longa
      opt.toLowerCase().includes('primeiro modulo') ||
      opt.toLowerCase().includes('first module') ||
      opt.toLowerCase().includes('transcreva') ||
      (opt.match(/\d{3}-/g) || []).length > 0 // Contém números de questão
    );
    
    if (hasClearlyCorruptedOption) {
      console.warn(`⚠️  Questão ${questionId} tem opção corrompida, pulando`);
      continue;
    }
    
    questions.push({
      id: questionNum,
      question: cleanedQuestion,
      options: cleanedOptions as [string, string, string, string],
      correctAnswer: correctIndex,
      category: module,
      module: module.toLowerCase()  // Garantir lowercase para consistência com schema
    });
  }
  
  console.log(`   Matches encontrados: ${matchCount}`);
  
  return questions;
}

async function processModule(
  filePath: string,
  moduleName: keyof typeof GABARITOS_COMPLETOS,
  expectedCount: number
): Promise<Question[]> {
  console.log(`\n📖 Processando ${moduleName}...`);
  
  const text = await extractTextFromDOCX(filePath);
  const questions = parseQuestionsFromText(text, moduleName);
  
  // Validar questões extraídas
  const questionIds = new Set<number>();
  const duplicates: number[] = [];
  
  for (const q of questions) {
    if (questionIds.has(q.id)) {
      duplicates.push(q.id);
    }
    questionIds.add(q.id);
  }
  
  if (duplicates.length > 0) {
    console.error(`❌ IDs duplicados encontrados: ${duplicates.join(', ')}`);
  }
  
  // Verificar intervalo esperado
  const expectedRange = Array.from({ length: expectedCount }, (_, i) => i + 1);
  const missing = expectedRange.filter(id => 
    !questionIds.has(id) && !(moduleName === 'ESS' && id === 395)
  );
  
  if (missing.length > 0 && missing.length <= 10) {
    console.warn(`⚠️  Questões ausentes: ${missing.join(', ')}`);
  } else if (missing.length > 10) {
    console.warn(`⚠️  ${missing.length} questões ausentes`);
  }
  
  console.log(`✅ ${questions.length}/${expectedCount} questões extraídas`);
  
  if (Math.abs(questions.length - expectedCount) > 5) {
    console.warn(`⚠️  Diferença significativa: esperado ${expectedCount}, obtido ${questions.length}`);
  }
  
  return questions;
}

async function main() {
  console.log('🚀 CMS ANAC - Processamento de Questões Oficiais\n');
  console.log('=' .repeat(60));

  const modules = [
    {
      file: 'attached_assets/GRUPO 1 – ESS (Questões 001 a 400)_1763336978723.docx',
      name: 'ESS' as const,
      expected: 399  // 400 - 1 (questão 395 excluída)
    },
    {
      file: 'attached_assets/GRUPO 2 – RPA (Questões 001 a 332)_1763338237383.docx',
      name: 'RPA' as const,
      expected: 332
    },
    {
      file: 'attached_assets/GRUPO 3 – PSS (Questões 001 a 300)_1763338964299.docx',
      name: 'PSS' as const,
      expected: 300
    },
    {
      file: 'attached_assets/GRUPO 4 – CGA (Questões 001 a 250)_1763339586877.docx',
      name: 'CGA' as const,
      expected: 250
    }
  ];

  const questionsByModule: Record<string, Question[]> = {};
  let totalQuestions = 0;

  for (const mod of modules) {
    try {
      const questions = await processModule(mod.file, mod.name, mod.expected);
      questionsByModule[mod.name] = questions;
      totalQuestions += questions.length;
    } catch (error) {
      console.error(`❌ Erro ao processar ${mod.name}:`, error);
      process.exit(1);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`\n✅ TOTAL PROCESSADO: ${totalQuestions}/1281 questões\n`);

  // Gerar arquivo TypeScript
  const output = `// Questões Oficiais CMS ANAC
// Fonte: Documentos oficiais ANAC 2024
// Gerado automaticamente - NÃO EDITAR MANUALMENTE
// Total: ${totalQuestions} questões

import type { InsertQuestion } from '../schema';

export const questionsByModule = {
  ESS: ${JSON.stringify(questionsByModule.ESS, null, 2)},
  RPA: ${JSON.stringify(questionsByModule.RPA, null, 2)},
  PSS: ${JSON.stringify(questionsByModule.PSS, null, 2)},
  CGA: ${JSON.stringify(questionsByModule.CGA, null, 2)}
} as const;

export const allQuestions: InsertQuestion[] = [
  ...questionsByModule.ESS,
  ...questionsByModule.RPA,
  ...questionsByModule.PSS,
  ...questionsByModule.CGA
];

export const QUIZ_MODULES = ['ESS', 'RPA', 'PSS', 'CGA'] as const;
export type QuizModule = typeof QUIZ_MODULES[number];
`;

  await fs.writeFile('shared/data/questions.ts', output, 'utf-8');
  
  console.log('📝 Arquivo gerado: shared/data/questions.ts');
  console.log('\n✨ Processamento concluído com sucesso!\n');
}

main().catch((error) => {
  console.error('\n❌ Erro fatal:', error);
  process.exit(1);
});
