import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
// Interface fornecida: não contém regras de negócio nem acesso a arquivo/banco.
export async function executarConsole(service, { permitirBaixa = false } = {}) {
  const rl = createInterface({ input: stdin, output: stdout });
  try {
    while (true) {
      console.log('\n1 Listar | 2 Buscar por SKU' + (permitirBaixa ? ' | 3 Baixar estoque' : '') + ' | 0 Sair');
      const opcao = await rl.question('Opção: ');
      try {
        if (opcao === '0') break;
        if (opcao === '1') console.table(await service.listar());
        else if (opcao === '2') console.log(await service.buscarPorSku(await rl.question('SKU: ')));
        else if (opcao === '3' && permitirBaixa) {
          const sku = await rl.question('SKU: ');
          const quantidade = Number(await rl.question('Quantidade: '));
          console.log(await service.baixarEstoque(sku, quantidade));
        } else console.log('Opção inválida.');
      } catch (erro) { console.error(erro.message); }
    }
  } finally { rl.close(); }
}
