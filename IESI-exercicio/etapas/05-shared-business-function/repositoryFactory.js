import { CsvProdutoRepository } from './CsvProdutoRepository.js';
import { SqliteProdutoRepository } from './SqliteProdutoRepository.js';
import { pendente } from '../../apoio/exercicio.js';
// Simple Factory: seleção por configuração, não o Factory Method GoF.
export function criarProdutoRepository({ tipo, caminho }) {
  // TODO [FAC-1] O que seria necessário inserir aqui?
  // Selecione csv/sqlite, instancie o Repository e rejeite tipo desconhecido.
  // Não coloque a escolha dentro de EstoqueService.
  pendente('FAC-1');
}
