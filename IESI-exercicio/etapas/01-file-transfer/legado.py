"""Sistema produtor em Python. Execute a partir da raiz do projeto."""
import csv
from pathlib import Path

BASE = Path(__file__).resolve().parent
ORIGEM = BASE.parent.parent / 'dados' / 'produtos.csv'
SAIDA = BASE / 'runtime' / 'saida' / 'produtos.csv'

def exportar():
    with ORIGEM.open(encoding='utf-8', newline='') as arquivo:
        produtos = list(csv.DictReader(arquivo))
    SAIDA.parent.mkdir(parents=True, exist_ok=True)

    # 1. Arquivo temporário na MESMA pasta do destino
    temporario = SAIDA.with_name(SAIDA.name + '.tmp')

    try:
        # 2. Escreve todo o snapshot no temporário
        with temporario.open('w', encoding='utf-8', newline='') as arquivo:
            escritor = csv.DictWriter(
                arquivo, fieldnames=['sku', 'nome', 'quantidade']
            )
            escritor.writeheader()
            for produto in produtos:
                escritor.writerow({
                    'sku': produto['sku'],
                    'nome': produto['nome'],
                    'quantidade': produto['quantidade'],
                })

        # 3. Publica: troca o nome de uma vez só
        temporario.replace(SAIDA)
    except Exception:
        # Se algo falhar, não deixa lixo e não toca no snapshot anterior
        temporario.unlink(missing_ok=True)
        raise

if __name__ == '__main__':
    exportar()
    print(f'Snapshot publicado: {SAIDA}')
