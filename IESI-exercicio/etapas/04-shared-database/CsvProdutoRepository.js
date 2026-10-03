import { readFile, writeFile, rename } from 'node:fs/promises';
import { lerCsv, escreverCsv } from '../../apoio/csv.js';
import { pendente } from '../../apoio/exercicio.js';
export class CsvProdutoRepository {
  constructor(caminho) { this.caminho = caminho; }
  async listar() {
    // TODO [REP-1] O que seria necessário inserir aqui?
    // Leia o CSV com lerCsv e converta quantidade para Number.
    pendente('REP-1');
  }
  async buscarPorSku(sku) {
    // TODO [REP-2] O que seria necessário inserir aqui?
    // Reutilize listar; retorne um produto ou null.
    pendente('REP-2');
  }
  async baixarEstoque(sku, quantidade) {
    // TODO [REP-3] O que seria necessário inserir aqui?
    // Verifique produto e saldo; desconte e persista o snapshot com escreverCsv.
    // Use arquivo temporário + rename. Retorne o produto atualizado.
    // Esta versão CSV admite apenas UM processo escritor; rename não evita perda de atualização.
    pendente('REP-3');
  }
  close() {}
}
