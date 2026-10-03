// Infraestrutura fornecida: interpretação de CSV, incluindo campos entre aspas.
export function lerCsv(texto) {
  const linhas = [];
  let linha = [], campo = '', aspas = false;
  for (let i = 0; i < texto.length; i++) {
    const c = texto[i];
    if (c === '"') {
      if (aspas && texto[i + 1] === '"') { campo += '"'; i++; }
      else aspas = !aspas;
    } else if (c === ',' && !aspas) { linha.push(campo); campo = ''; }
    else if ((c === '\n' || c === '\r') && !aspas) {
      if (c === '\r' && texto[i + 1] === '\n') i++;
      linha.push(campo); linhas.push(linha); linha = []; campo = '';
    } else campo += c;
  }
  if (aspas) throw new Error('CSV com aspas não fechadas.');
  if (campo || linha.length) { linha.push(campo); linhas.push(linha); }
  const cabecalho = linhas.shift();
  if (cabecalho?.join(',') !== 'sku,nome,quantidade') throw new Error('Cabeçalho CSV inválido.');
  return linhas.filter(l => l.some(Boolean)).map(l => {
    if (l.length !== 3) throw new Error('Linha CSV deve ter três campos.');
    return { sku: l[0], nome: l[1], quantidade: l[2] };
  });
}
export function escreverCsv(produtos) {
  const campo = v => `"${String(v).replaceAll('"', '""')}"`;
  return 'sku,nome,quantidade\n' + produtos.map(p =>
    [p.sku, p.nome, p.quantidade].map(campo).join(',')).join('\n') + '\n';
}
