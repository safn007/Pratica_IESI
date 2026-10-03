import { readFile, mkdir, writeFile, rename } from 'node:fs/promises';
import { lerCsv } from '../../apoio/csv.js';
import { pendente } from '../../apoio/exercicio.js';
const recebido = new URL('./runtime/entrada/produtos.csv', import.meta.url);
const destino = new URL('./runtime/local/produtos.csv', import.meta.url);
try {
  const texto = await readFile(recebido, 'utf8');
  const produtos = lerCsv(texto);
  // TODO [FT-2] O que seria necessário inserir aqui?
  // Valide SKU único e não vazio, nome não vazio e quantidade inteira >= 0.
  // Rejeite o arquivo inteiro se uma linha for inválida; preserve o snapshot anterior.
  
  const erros = [];
  const skusVistos = new Set();

  produtos.forEach((produto, indice) => {
    const linha = indice + 2; // +1 do cabeçalho, +1 porque a contagem humana começa em 1
    const sku = String(produto.sku ?? '');
    const nome = String(produto.nome ?? '');
    const quantidade = String(produto.quantidade ?? '');

    if (sku.trim() === '') {
      erros.push(`linha ${linha}: SKU vazio`);
    } else if (skusVistos.has(sku)) {
      erros.push(`linha ${linha}: SKU duplicado (${sku})`);
    } else {
      skusVistos.add(sku);
    }

    if (nome.trim() === '') {
      erros.push(`linha ${linha}: nome vazio`);
    }

    if (!/^\d+$/.test(quantidade)) {
      erros.push(`linha ${linha}: quantidade inválida ("${quantidade}")`);
    }
  });

  if (erros.length > 0) {
    throw new Error(
      `Arquivo rejeitado, snapshot anterior preservado:\n- ${erros.join('\n- ')}`
    );
  }
  await mkdir(new URL('./runtime/local/', import.meta.url), { recursive: true });
  const temporario = new URL('./runtime/local/produtos.tmp', import.meta.url);
  await writeFile(temporario, texto, 'utf8');
  await rename(temporario, destino);
  console.log(`Importados ${produtos.length} produtos. Snapshot substituído.`);
} catch (erro) { console.error(erro.message); process.exitCode = 1; }
