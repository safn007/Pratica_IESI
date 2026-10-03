import { CsvProdutoRepository } from './CsvProdutoRepository.js';
import { EstoqueService } from './EstoqueService.js';
import { executarConsole } from '../../apoio/console.js';
const repository = new CsvProdutoRepository(new URL('./runtime/produtos.csv', import.meta.url));
await executarConsole(new EstoqueService(repository), { permitirBaixa: true });
