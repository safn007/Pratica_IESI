# Laboratório IESI — evolução da integração de estoque

Material para alunos: código de apoio fornecido e pontos de implementação marcados com `TODO [ID]`. Os métodos incompletos emitem um erro explícito, e isso é esperado até completar o exercício.

## Ambiente

- Python 3 (somente biblioteca padrão).
- Node.js 24 ou superior, com o módulo `node:sqlite` disponível. Confirme com `node -e "require('node:sqlite')"`.
- npm apenas na etapa opcional de React. Etapas 01–05 não precisam instalar pacotes.

Execute os comandos abaixo **a partir da raiz deste projeto**. As aplicações resolvem seus dados a partir do próprio arquivo, independentemente do diretório do terminal. Os diretórios `runtime/` guardam dados gerados e não devem ser versionados.

## Sequência e responsabilidades

| Etapa | Aplicações e mecanismo                                          | Exercícios novos            |
| ----- | --------------------------------------------------------------- | --------------------------- |
| 01    | Python publica CSV; Node recebe, importa e consulta cópia local | FT-1, FT-2, FT-3            |
| 02    | Console -> serviço -> Repository CSV                            | REP-1, REP-2, REP-3, SRV-1  |
| 03    | Simple Factory escolhe CSV ou SQLite                            | FAC-1, SQL-1, SQL-2, SQL-3  |
| 04    | Python e Node acessam diretamente o mesmo SQLite local          | SDB-1                       |
| 05    | API Node centraliza a baixa; clientes Python e Node usam HTTP   | API-1, API-2, CLI-1, HTTP-1 |
| 06    | React solicita a mesma função pela API                          | UI-1, UI-2                  |

Cada etapa tem seus próprios arquivos e dados para preservar a comparação. Ao avançar, **transporte suas implementações dos arquivos correspondentes da etapa anterior**. Os TODOs repetidos são continuidade, não exercícios novos. Preserve os arquivos novos da etapa seguinte.

`apoio/` contém infraestrutura pronta (CSV, console e criação do esquema); não é necessário alterá-la. O console não importa banco/arquivo diretamente a partir da etapa 02. O serviço não escolhe a persistência. Os clientes da etapa 05 não abrem o banco.

## Contratos

Produto: `{ sku: string, nome: string, quantidade: number }`. Quantidade é um inteiro não negativo. SKU é identificador único, sensível a maiúsculas/minúsculas. CSV usa UTF-8, cabeçalho `sku,nome,quantidade` e snapshot completo; não é um arquivo de movimentações.

Repository (métodos assíncronos):

- `listar()` → array de produtos, preferencialmente ordenado por SKU.
- `buscarPorSku(sku)` → produto ou `null`.
- `baixarEstoque(sku, quantidade)` → produto atualizado; erro se SKU ausente ou saldo insuficiente. SQLite deve proteger a baixa concorrente.
- `close()` → encerra recursos; CSV não precisa fazer nada.

Serviço valida SKU e quantidade inteira positiva e delega a baixa. Defina códigos estáveis nos erros, por exemplo `ENTRADA_INVALIDA`, `PRODUTO_INEXISTENTE` e `SALDO_INSUFICIENTE`, para que a API consiga escolher o status HTTP sem comparar textos de mensagens. Erros internos e exercícios pendentes não devem ser classificados como entrada inválida.

Factory: `criarProdutoRepository({ tipo, caminho })` aceita `csv` e `sqlite` e rejeita qualquer outro tipo. Esta é uma **Simple Factory**, não uma implementação do Factory Method GoF por subclasses.

## 01 — File Transfer

1. Complete `FT-1` em `legado.py` e execute:

```sh
python3 etapas/01-file-transfer/legado.py
```

2. Simule a entrega do arquivo do produtor ao consumidor:

```sh
mkdir -p etapas/01-file-transfer/runtime/entrada
cp etapas/01-file-transfer/runtime/saida/produtos.csv etapas/01-file-transfer/runtime/entrada/produtos.csv
```

3. Complete `FT-2` e `FT-3`:

```sh
node etapas/01-file-transfer/importar.js
node etapas/01-file-transfer/console.js
```

O consumidor usa `runtime/local/produtos.csv`, nunca o arquivo do produtor diretamente. A importação substitui o snapshot; importar novamente não soma quantidades. Valide todas as linhas antes de publicar a cópia local.

Experimente: altere `dados/produtos.csv`, exporte novamente e consulte o console antes de entregar/importar. O consumidor ainda tem o saldo antigo. Depois entregue e importe para observar a atualização. Rejeite também um CSV com quantidade negativa ou SKU duplicado e confirme que a cópia local anterior continua intacta.

## 02 — Repository e serviço

Prepare uma cópia para esta etapa:

```sh
mkdir -p etapas/02-repository/runtime
cp dados/produtos.csv etapas/02-repository/runtime/produtos.csv
node etapas/02-repository/console.js
```

Complete `REP-1`, `REP-2`, `REP-3` e `SRV-1`. A opção de baixa é introduzida aqui como operação local. Uma baixa não é sincronizada de volta para o legado nesta etapa: um novo snapshot pode sobrescrever alterações locais, tema para discutir antes de adotar esse fluxo em uma integração real.

Verifique listar, consultar SKU inexistente, baixar uma unidade e reabrir o console. Tente quantidade zero, negativa, fracionária e superior ao saldo. O saldo deve permanecer inalterado nos erros.

A implementação CSV é limitada a um único escritor. Publicar com arquivo temporário e rename evita leitura parcial, mas não torna a sequência ler–alterar–gravar segura entre processos concorrentes.

## 03 — Factory e SQLite

Transporte as soluções de Repository CSV e serviço da etapa 02. Complete `FAC-1` e `SQL-1` a `SQL-3`.

```sh
node etapas/03-factory-sqlite/preparar.js
PERSISTENCIA=csv node etapas/03-factory-sqlite/console.js
PERSISTENCIA=sqlite node etapas/03-factory-sqlite/console.js
```

Os dois backends desta etapa têm dados independentes: trocar a configuração não migra nem sincroniza saldos. `preparar.js` copia o CSV de exemplo e insere somente produtos ausentes no banco; não restaura saldos já existentes no SQLite. Execute a preparação antes de editar o CSV de runtime.

Na baixa SQLite, use `BEGIN IMMEDIATE`, UPDATE parametrizado condicionado ao saldo, confira `changes`, leia o saldo atualizado e faça COMMIT. Garanta ROLLBACK no erro. Evite uma consulta prévia seguida de UPDATE incondicional. Para distinguir ausência de saldo insuficiente, consulte o SKU dentro da mesma transação quando nenhuma linha for alterada.

Critério de conclusão: o mesmo serviço e o mesmo console funcionam com ambos os backends; tipo desconhecido falha claramente.

## 04 — Shared Database

Transporte os quatro arquivos implementados na etapa 03: Repository CSV, Repository SQLite, serviço e Factory. Complete `SDB-1` no Python.

```sh
node etapas/04-shared-database/preparar.js
node etapas/04-shared-database/console.js
```

Em outro terminal:

```sh
python3 etapas/04-shared-database/legado.py
```

Ambos acessam exatamente `etapas/04-shared-database/runtime/estoque.db`, em conexões independentes. No Python, escolha explicitamente a transação adequada, use parâmetros e confira `rowcount`. A validação de quantidade positiva continua necessária; um UPDATE condicionado apenas ao saldo não rejeita quantidade negativa.

Use `P003` (saldo inicial 1) e tente baixar uma unidade nos dois programas. Deve haver somente uma baixa bem-sucedida e saldo final zero. Para repetir, restaure explicitamente o saldo pelo SQLite, ou use um SKU novo no arquivo inicial e prepare novamente. Não há automação que apague o banco para reiniciar.

Discuta: desapareceu a necessidade de entrega de arquivos, mas os sistemas dependem do mesmo esquema e podem duplicar regras. SQLite é usado localmente, na mesma máquina; este exercício não propõe colocar o arquivo em uma pasta de rede.

## 05 — Shared Business Function por HTTP

Transporte as implementações da etapa 04. Complete os exercícios HTTP. Apenas a API abre o SQLite desta etapa.

```sh
node etapas/05-shared-business-function/preparar.js
node etapas/05-shared-business-function/server.js
```

Em outro terminal, escolha um cliente:

```sh
node etapas/05-shared-business-function/console.js
python3 etapas/05-shared-business-function/legado.py
```

Contrato HTTP:

| Requisição                                                        | Sucesso                 | Erros esperados                                                                           |
| ----------------------------------------------------------------- | ----------------------- | ----------------------------------------------------------------------------------------- |
| `GET /produtos`                                                   | 200, array de produtos  | 500, falha interna                                                                        |
| `POST /estoque/baixas`, JSON `{ "sku": "P003", "quantidade": 1 }` | 200, produto atualizado | 400 entrada/JSON inválido; 404 SKU inexistente; 409 saldo insuficiente; 500 falha interna |

Erros usam JSON `{ "erro": "mensagem" }`. Teste também sem o console:

```sh
curl http://127.0.0.1:3000/produtos
curl -i -X POST http://127.0.0.1:3000/estoque/baixas -H 'Content-Type: application/json' -d '{"sku":"P003","quantidade":1}'
```

A API centraliza a regra; Python e Node clientes não descontam saldo por conta própria. Indisponibilidade da API agora afeta a operação. Timeout não garante que a baixa deixou de acontecer; retentativa automática e chave de idempotência são extensões futuras, não implementadas neste laboratório.

## 06 — React (opcional)

Mantenha a API da etapa 05 em execução. Complete `UI-1` e `UI-2`.

```sh
cd etapas/06-react
npm install
npm run dev
```

Abra o endereço informado pelo Vite. O proxy encaminha `/produtos` e `/estoque` para a API local. O frontend não importa Repository nem acessa SQLite. Os botões ficam desabilitados enquanto a solicitação está em andamento; falhas devem aparecer na interface.

Depois de completar:

```sh
npm run build
```

## Verificação da estrutura

Na raiz:

```sh
npm run verificar
```

Verifica sintaxe dos arquivos `.js`/`.mjs` e a infraestrutura fornecida de CSV e SQLite. **Não atesta que os exercícios foram resolvidos**, não avalia JSX e não executa clientes interativos. Use os cenários de cada etapa para validar suas implementações. JSX é validado pelo build da etapa 06 após instalar suas dependências.

## Perguntas de fechamento

1. Qual é o contrato compartilhado em cada etapa: arquivo, esquema ou API?
2. Quando uma alteração de estoque se torna visível para o outro sistema?
3. Onde a regra que impede saldo negativo é executada e quem pode contorná-la?
4. O que ocorre se dois clientes tentarem comprar a última unidade?
5. Quais dependências mudam ao evoluir de dados compartilhados para uma função compartilhada?
6. Por que Repository e Factory ajudam a evolução do código, mas não resolvem sozinhos os problemas de integração?
