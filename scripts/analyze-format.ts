import fs from 'fs/promises';
import mammoth from 'mammoth';

async function analyze() {
  const buffer = await fs.readFile('attached_assets/GRUPO 1 – ESS (Questões 001 a 400)_1763336978723.docx');
  const result = await mammoth.extractRawText({ buffer });
  const text = result.value;
  
  // Mostrar primeiros 3000 caracteres
  console.log('===== PRIMEIROS 3000 CARACTERES =====\n');
  console.log(text.substring(0, 3000));
  console.log('\n\n===== ANÁLISE =====');
  console.log(`Total de caracteres: ${text.length}`);
  console.log(`Total de linhas: ${text.split('\n').length}`);
  
  // Buscar padrões de questões
  const questao001Match = text.match(/001-.*?(?=002-|$)/s);
  if (questao001Match) {
    console.log('\n===== QUESTÃO 001 COMPLETA =====\n');
    console.log(questao001Match[0].substring(0, 500));
  }
  
  const questao002Match = text.match(/002-.*?(?=003-|$)/s);
  if (questao002Match) {
    console.log('\n===== QUESTÃO 002 COMPLETA =====\n');
    console.log(questao002Match[0].substring(0, 500));
  }
}

analyze();
