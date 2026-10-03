import { criarProdutoRepository } from './repositoryFactory.js';
import { EstoqueService } from './EstoqueService.js';
import { executarConsole } from '../../apoio/console.js';
import { fileURLToPath } from 'node:url';
const tipo = process.env.PERSISTENCIA ?? 'sqlite';
const caminho = fileURLToPath(new URL(tipo === 'sqlite' ? './runtime/estoque.db' : './runtime/produtos.csv', import.meta.url));
const repository = criarProdutoRepository({ tipo, caminho });
try { await executarConsole(new EstoqueService(repository), { permitirBaixa: true }); }
finally { repository.close(); }
