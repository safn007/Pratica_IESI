import { executarConsole } from '../../apoio/console.js';
import { pendente } from '../../apoio/exercicio.js';
const base = 'http://127.0.0.1:3000';
// Este cliente conhece HTTP; não importa Repository nem abre SQLite.
await executarConsole({
  async listar() {
    const res = await fetch(`${base}/produtos`);
    const dados = await res.json();
    if (!res.ok) throw new Error(dados.erro);
    return dados;
  },
  async buscarPorSku(sku) { return (await this.listar()).find(p => p.sku === sku) ?? null; },
  async baixarEstoque(sku, quantidade) {
    // TODO [CLI-1] O que seria necessário inserir aqui?
    // POST JSON para /estoque/baixas; confira res.ok e devolva produto ou erro.
    pendente('CLI-1');
  }
}, { permitirBaixa: true });
