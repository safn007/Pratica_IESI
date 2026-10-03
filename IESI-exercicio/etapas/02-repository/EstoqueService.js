import { pendente } from '../../apoio/exercicio.js';
export class EstoqueService {
  constructor(repository) { this.repository = repository; }
  listar() { return this.repository.listar(); }
  buscarPorSku(sku) { return this.repository.buscarPorSku(sku); }
  async baixarEstoque(sku, quantidade) {
    // TODO [SRV-1] O que seria necessário inserir aqui?
    // Valide SKU não vazio e quantidade inteira positiva antes de delegar.
    // O Repository garante a baixa condicional; não faça buscar + salvar no serviço.
    pendente('SRV-1');
  }
}
