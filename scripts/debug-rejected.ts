import fs from 'fs/promises';
import mammoth from 'mammoth';

async function debug() {
  const buffer = await fs.readFile('attached_assets/GRUPO 1 – ESS (Questões 001 a 400)_1763336978723.docx');
  const result = await mammoth.extractRawText({ buffer });
  let text = result.value;
  
  // Normalizar
  text = text.replace(/\s+/g, ' ');
  text = text.replace(/(\d{3})-/g, '\n$1-');
  
  // Buscar questões específicas rejeitadas
  const rejectedIds = [16, 76, 189, 197];
  
  for (const id of rejectedIds) {
    const idStr = String(id).padStart(3, '0');
    const pattern = new RegExp(`\n${idStr}-(.*?)(?=\n\\d{3}-|$)`, 's');
    const match = text.match(pattern);
    
    if (match) {
      console.log(`\n========== QUESTÃO ${idStr} ==========`);
      console.log(match[1].substring(0, 1000));
      console.log('\n');
    }
  }
}

debug();
