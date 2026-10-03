"""Cliente legado: agora solicita a função via HTTP, sem acesso ao banco."""
import json
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError

def baixar(sku, quantidade):
    # TODO [HTTP-1] O que seria necessário inserir aqui?
    # Monte Request com POST, JSON e Content-Type para /estoque/baixas.
    # Use urlopen com timeout, leia o JSON e trate HTTPError e URLError.
    # Falta de resposta não significa que a baixa não aconteceu: não repita cegamente.
    raise NotImplementedError('HTTP-1: implementar cliente HTTP')

if __name__ == '__main__':
    print(baixar(input('SKU: '), int(input('Quantidade: '))))
