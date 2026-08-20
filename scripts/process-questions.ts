/**
 * Script para processar questões do CMS ANAC
 * Extrai questões dos DOCX e mapeia com gabaritos oficiais
 */

import fs from 'fs/promises';
import path from 'path';

// Gabaritos oficiais transcritos das imagens PNG
const GABARITOS = {
  'ESS': {
    '001': 'C', '002': 'B', '003': 'D', '004': 'A', '005': 'D', '006': 'A', '007': 'A', '008': 'B', '009': 'B', '010': 'A',
    '011': 'A', '012': 'A', '013': 'C', '014': 'C', '015': 'C', '016': 'B', '017': 'C', '018': 'B', '019': 'B', '020': 'A',
    '021': 'D', '022': 'D', '023': 'A', '024': 'B', '025': 'C', '026': 'D', '027': 'D', '028': 'A', '029': 'B', '030': 'D',
    '031': 'C', '032': 'B', '033': 'B', '034': 'A', '035': 'A', '036': 'D', '037': 'B', '038': 'D', '039': 'A', '040': 'D',
    '041': 'A', '042': 'C', '043': 'C', '044': 'C', '045': 'C', '046': 'D', '047': 'B', '048': 'D', '049': 'D', '050': 'A',
    '051': 'C', '052': 'A', '053': 'A', '054': 'B', '055': 'A', '056': 'C', '057': 'D', '058': 'A', '059': 'A', '060': 'D',
    // ... continua para todas as 399 questões
  },
  'RPA': {
    // Gabaritos do Grupo 2
  },
  'PSS': {
    // Gabaritos do Grupo 3
  },
  'CGA': {
    // Gabaritos do Grupo 4
  }
};

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  category: string;
  difficulty: string;
  module: string;
}

function parseQuestion(text: string, module: string): Question | null {
  // Regex para capturar: 001- [texto]:a) opcaoAb) opcaoBc) opcaoCd) opcaoD
  const regex = /(\d{3})-\s*(.+?)(?:a\))\s*(.+?)(?:b\))\s*(.+?)(?:c\))\s*(.+?)(?:d\))\s*(.+?)(?=\d{3}-|$)/gs;
  
  const match = regex.exec(text);
  if (!match) return null;

  const [, num, question, optA, optB, optC, optD] = match;
  const questionNum = num.padStart(3, '0');
  const correctLetter = GABARITOS[module as keyof typeof GABARITOS][questionNum];
  
  if (!correctLetter) {
    console.warn(`Gabarito não encontrado para questão ${questionNum} do módulo ${module}`);
    return null;
  }

  const correctIndex = ['A', 'B', 'C', 'D'].indexOf(correctLetter);

  return {
    id: parseInt(num),
    question: question.trim(),
    options: [
      optA.trim(),
      optB.trim(),
      optC.trim(),
      optD.trim()
    ],
    correctAnswer: correctIndex,
    category: module,
    difficulty: 'medium',
    module
  };
}

async function processModule(filePath: string, module: string, expectedCount: number): Promise<Question[]> {
  console.log(`\nProcessando módulo ${module}...`);
  
  const content = await fs.readFile(filePath, 'utf-8');
  const questions: Question[] = [];
  
  // Parse do texto usando regex
  const lines = content.split('\n');
  let currentQuestion = '';
  
  for (const line of lines) {
    if (/^\d{3}-/.test(line)) {
      if (currentQuestion) {
        const parsed = parseQuestion(currentQuestion, module);
        if (parsed) questions.push(parsed);
      }
      currentQuestion = line;
    } else {
      currentQuestion += ' ' + line;
    }
  }
  
  // Última questão
  if (currentQuestion) {
    const parsed = parseQuestion(currentQuestion, module);
    if (parsed) questions.push(parsed);
  }

  console.log(`✓ ${questions.length}/${expectedCount} questões extraídas`);
  
  if (questions.length !== expectedCount) {
    console.warn(`⚠ Esperado ${expectedCount}, obtido ${questions.length}`);
  }

  return questions;
}

async function main() {
  console.log('🚀 Iniciando processamento das questões CMS ANAC\n');

  const modules = [
    { file: 'attached_assets/fonte-grupo-1-ess.docx', name: 'ESS', count: 399 },
    { file: 'attached_assets/fonte-grupo-2-rpa.docx', name: 'RPA', count: 332 },
    { file: 'attached_assets/fonte-grupo-3-pss.docx', name: 'PSS', count: 300 },
    { file: 'attached_assets/fonte-grupo-4-cga.docx', name: 'CGA', count: 250 }
  ];

  const allQuestions: Question[] = [];

  for (const mod of modules) {
    const questions = await processModule(mod.file, mod.name, mod.count);
    allQuestions.push(...questions);
  }

  console.log(`\n✅ Total processado: ${allQuestions.length}/1281 questões\n`);

  // Gerar arquivo TypeScript
  const output = `// Questões oficiais CMS ANAC
// Gerado automaticamente - NÃO EDITAR MANUALMENTE

export const questionsByModule = {
  ESS: ${JSON.stringify(allQuestions.filter(q => q.module === 'ESS'), null, 2)},
  RPA: ${JSON.stringify(allQuestions.filter(q => q.module === 'RPA'), null, 2)},
  PSS: ${JSON.stringify(allQuestions.filter(q => q.module === 'PSS'), null, 2)},
  CGA: ${JSON.stringify(allQuestions.filter(q => q.module === 'CGA'), null, 2)}
} as const;

export const allQuestions = [
  ...questionsByModule.ESS,
  ...questionsByModule.RPA,
  ...questionsByModule.PSS,
  ...questionsByModule.CGA
];
`;

  await fs.writeFile('shared/data/questions.ts', output, 'utf-8');
  console.log('📝 Arquivo gerado: shared/data/questions.ts');
}

main().catch(console.error);
