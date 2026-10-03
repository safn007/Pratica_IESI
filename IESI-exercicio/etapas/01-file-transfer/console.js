import { readFile } from 'node:fs/promises';
import { lerCsv } from '../../apoio/csv.js';
import { executarConsole } from '../../apoio/console.js';
import { pendente } from '../../apoio/exercicio.js';
// Versão inicial propositalmente acoplada ao CSV: refatorada na etapa 02.
async function carregar() {
  return lerCsv(await readFile(new URL('./runtime/local/produtos.csv', import.meta.url), 'utf8'))
    .map(p => ({ ...p, quantidade: Number(p.quantidade) }));
}
await executarConsole({
  listar: carregar,
  async buscarPorSku(sku) {
    // TODO [FT-3] O que seria necessário inserir aqui?
    // Consulte o snapshot local e devolva o produto ou null.
    const produtos = await carregar();
    return produtos.find((produto) => produto.sku === sku) ?? null;
  }
});
