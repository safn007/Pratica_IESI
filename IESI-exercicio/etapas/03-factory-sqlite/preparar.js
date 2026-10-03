import { readFile, mkdir, copyFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { abrirBanco } from '../../apoio/sqlite.js';
import { lerCsv } from '../../apoio/csv.js';
// Carga fornecida: executada somente para preparar o laboratório.
const origem = new URL('../../dados/produtos.csv', import.meta.url);
await mkdir(new URL('./runtime/', import.meta.url), { recursive: true });
await copyFile(origem, new URL('./runtime/produtos.csv', import.meta.url));
const db = abrirBanco(fileURLToPath(new URL('./runtime/estoque.db', import.meta.url)));
try {
  const inserir = db.prepare('INSERT OR IGNORE INTO produtos (sku,nome,quantidade) VALUES (?,?,?)');
  db.exec('BEGIN');
  try {
    for (const p of lerCsv(await readFile(origem, 'utf8'))) inserir.run(p.sku,p.nome,Number(p.quantidade));
    db.exec('COMMIT');
  } catch (erro) { db.exec('ROLLBACK'); throw erro; }
} finally { db.close(); }
console.log('CSV preparado; produtos ausentes inseridos no SQLite (saldos existentes preservados).');
