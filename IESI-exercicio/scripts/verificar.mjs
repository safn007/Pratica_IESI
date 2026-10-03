import { readdir, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import assert from 'node:assert/strict';
import { lerCsv, escreverCsv } from '../apoio/csv.js';
const raiz = fileURLToPath(new URL('../', import.meta.url));
async function arquivos(dir) {
  const resultado = [];
  for (const entrada of await readdir(dir, { withFileTypes: true })) {
    if (['node_modules', 'runtime', '.git'].includes(entrada.name)) continue;
    const caminho = join(dir, entrada.name);
    if (entrada.isDirectory()) resultado.push(...await arquivos(caminho));
    else if (/\.(js|mjs)$/.test(entrada.name)) resultado.push(caminho);
  }
  return resultado;
}
for (const arquivo of await arquivos(raiz)) {
  const resultado = spawnSync(process.execPath, ['--check', arquivo], { encoding: 'utf8' });
  if (resultado.status !== 0) throw new Error(resultado.stderr || resultado.error?.message);
}
const produtos = [{ sku: 'P1', nome: 'Mouse, "especial"\nUSB', quantidade: 2 }];
assert.deepEqual(lerCsv(escreverCsv(produtos)), produtos.map(p => ({ ...p, quantidade: String(p.quantidade) })));
assert.throws(() => lerCsv('sku,nome,saldo\nP1,Mouse,2\n'), /Cabeçalho/);
assert.throws(() => lerCsv('sku,nome,quantidade\nP1,"Mouse,2'), /aspas/);
// Importação dinâmica permite apresentar uma mensagem útil em runtimes sem SQLite.
let abrirBanco;
try { ({ abrirBanco } = await import('../apoio/sqlite.js')); }
catch (erro) { throw new Error('Use Node 24+ com node:sqlite disponível.', { cause: erro }); }
const temporario = await mkdtemp(join(tmpdir(), 'iesi-verificar-'));
let db;
try {
  db = abrirBanco(join(temporario, 'estoque.db'));
  db.prepare('INSERT INTO produtos VALUES (?, ?, ?)').run('P1', 'Mouse', 2);
  assert.equal(db.prepare('SELECT quantidade FROM produtos WHERE sku = ?').get('P1').quantidade, 2);
  assert.throws(() => db.prepare('INSERT INTO produtos VALUES (?, ?, ?)').run('P2', 'Mouse', -1));
  assert.throws(() => db.prepare('INSERT INTO produtos VALUES (?, ?, ?)').run('P1', 'Outro', 1));
} finally { db?.close(); await rm(temporario, { recursive: true, force: true }); }
console.log('Sintaxe JS e infraestrutura CSV/SQLite verificadas. Exercícios TODO e JSX não foram avaliados.');
