import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { criarProdutoRepository } from './repositoryFactory.js';
import { EstoqueService } from './EstoqueService.js';
import { pendente } from '../../apoio/exercicio.js';
const repository = criarProdutoRepository({ tipo: 'sqlite', caminho: fileURLToPath(new URL('./runtime/estoque.db', import.meta.url)) });
const service = new EstoqueService(repository);
function responder(res, status, dados) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(dados));
}
async function lerJson(req) {
  let texto = '';
  for await (const parte of req) {
    texto += parte;
    if (texto.length > 10000) throw new Error('Corpo muito grande.');
  }
  return JSON.parse(texto);
}
const server = createServer(async (req, res) => {
  try {
    if (req.method === 'GET' && req.url === '/produtos') {
      return responder(res, 200, await service.listar());
    }
    if (req.method === 'POST' && req.url === '/estoque/baixas') {
      const dados = await lerJson(req);
      // TODO [API-1] O que seria necessário inserir aqui?
      // Delegue sku/quantidade ao serviço e retorne o produto atualizado com HTTP 200.
      pendente('API-1');
    }
    responder(res, 404, { erro: 'Rota inexistente' });
  } catch (erro) {
    // TODO [API-2] O que seria necessário inserir aqui?
    // Distinga JSON/entrada inválida (400), SKU ausente (404), saldo insuficiente (409)
    // e falha interna (500). Combine códigos de erro estáveis com o serviço/Repository.
    // A resposta 500 abaixo é apenas um fallback até completar o exercício.
    responder(res, 500, { erro: erro.message });
  }
});
server.listen(3000, '127.0.0.1', () => console.log('API em http://127.0.0.1:3000'));
process.on('SIGINT', () => server.close(() => { repository.close(); process.exit(0); }));
