import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
function App() {
  const [produtos, setProdutos] = useState([]);
  const [sku, setSku] = useState('P003');
  const [quantidade, setQuantidade] = useState(1);
  const [mensagem, setMensagem] = useState('');
  const [ocupado, setOcupado] = useState(false);
  async function listar() {
    // TODO [UI-1] O que seria necessário inserir aqui?
    // Faça GET /produtos, confira response.ok e atualize produtos ou mensagem.
    // Use URLs relativas para aproveitar o proxy do Vite.
    throw new Error('UI-1 pendente');
  }
  async function baixar(evento) {
    evento.preventDefault();
    // TODO [UI-2] O que seria necessário inserir aqui?
    // Faça POST /estoque/baixas; apresente o resultado e recarregue a lista.
    // O frontend solicita a operação; a regra que impede saldo negativo fica na API.
    throw new Error('UI-2 pendente');
  }
  async function executar(acao) {
    setOcupado(true);
    try { await acao(); } catch (erro) { setMensagem(erro.message); }
    finally { setOcupado(false); }
  }
  return <main style={{ maxWidth: 640, margin: '40px auto', fontFamily: 'sans-serif' }}>
    <h1>Estoque de produtos</h1>
    <button disabled={ocupado} onClick={() => executar(listar)}>Atualizar estoque</button>
    <ul>{produtos.map(p => <li key={p.sku}>{p.sku} — {p.nome}: {p.quantidade}</li>)}</ul>
    <form onSubmit={e => { e.preventDefault(); executar(() => baixar(e)); }}>
      <label>SKU <input value={sku} onChange={e => setSku(e.target.value)} /></label>{' '}
      <label>Quantidade <input type="number" min="1" step="1" value={quantidade} onChange={e => setQuantidade(Number(e.target.value))} /></label>{' '}
      <button disabled={ocupado}>Baixar estoque</button>
    </form>
    <p role="status">{mensagem}</p>
  </main>;
}
createRoot(document.getElementById('root')).render(<App />);
