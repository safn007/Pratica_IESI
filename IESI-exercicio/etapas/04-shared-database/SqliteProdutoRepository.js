import { abrirBanco } from '../../apoio/sqlite.js';
import { pendente } from '../../apoio/exercicio.js';
export class SqliteProdutoRepository {
  constructor(caminho) { this.db = abrirBanco(caminho); }
  async listar() {
    // TODO [SQL-1] O que seria necessário inserir aqui?
    // SELECT dos produtos ordenados por SKU. Use prepare(...).all().
    pendente('SQL-1');
  }
  async buscarPorSku(sku) {
    // TODO [SQL-2] O que seria necessário inserir aqui?
    // Consulta parametrizada por SKU; normalize produto ausente para null.
    pendente('SQL-2');
  }
  async baixarEstoque(sku, quantidade) {
    // TODO [SQL-3] O que seria necessário inserir aqui?
    // Em transação, faça UPDATE condicional (saldo >= quantidade).
    // Use parâmetros, confira changes, consulte o produto atualizado e COMMIT.
    // Diferencie SKU inexistente de saldo insuficiente; faça ROLLBACK no erro.
    // A consulta inicial seguida de UPDATE incondicional não protege contra concorrência.
    pendente('SQL-3');
  }
  close() { this.db.close(); }
}
