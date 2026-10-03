"""Acesso direto ao MESMO banco usado pelo console Node, em outra conexão."""
import sqlite3
from pathlib import Path
BANCO = Path(__file__).resolve().parent / 'runtime' / 'estoque.db'

def baixar(conexao, sku, quantidade):
    # TODO [SDB-1] O que seria necessário inserir aqui?
    # Valide a entrada e faça baixa condicional parametrizada em transação.
    # Confira rowcount e diferencie produto inexistente de saldo insuficiente.
    # Compare esta regra com a do Node: quem mantém ambas consistentes?
    raise NotImplementedError('SDB-1: implementar baixa no legado')

if __name__ == '__main__':
    if not BANCO.exists():
        raise SystemExit('Execute preparar.js desta etapa antes de abrir o legado.')
    with sqlite3.connect(BANCO, timeout=3) as conexao:
        print(conexao.execute('SELECT sku,nome,quantidade FROM produtos ORDER BY sku').fetchall())
        sku = input('SKU para baixa: ')
        quantidade = int(input('Quantidade: '))
        baixar(conexao, sku, quantidade)
