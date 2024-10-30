import React, { useState, useEffect } from 'react';

function Chamados({ chamados }) {
  const [filtro, setFiltro] = useState(() => localStorage.getItem('filtro') || '');
  const [chamadosFiltrados, setChamadosFiltrados] = useState([]);

  useEffect(() => {
    const todosChamados = Object.values(chamados).flat();  // Combine todos os chamados
    console.log('Todos os chamados:', todosChamados);  // Adicione um log para verificar todos os chamados
    setChamadosFiltrados(todosChamados.filter((chamado) =>
      chamado.nome.toLowerCase().includes(filtro.toLowerCase())
    ));
  }, [filtro, chamados]);

  const handleFilterChange = (e) => {
    setFiltro(e.target.value);
    localStorage.setItem('filtro', e.target.value);
  };

  const totalAtendimentos = Object.values(chamados).flat().length;
  const quantidadeAtendimentos = chamadosFiltrados.length;

  return (
    <div>
      <h1>Chamados Realizados</h1>
      <input
        type="text"
        value={filtro}
        onChange={handleFilterChange}
        placeholder="Filtrar por nome"
      />
      <p>Total de Atendimentos Realizados: {totalAtendimentos}</p>
      <p>Total de Atendimentos Filtrados: {quantidadeAtendimentos}</p>
      <table>
        <thead>
          <tr>
            <th>Data Inicial</th>
            <th>Nome</th>
            <th>Canal</th>
            <th>Problema</th>
            <th>Número do Ticket</th>
            <th>Data Final</th>
            <th>Criado Por</th>
          </tr>
        </thead>
        <tbody>
          {chamadosFiltrados.map((chamado) => (
            <tr key={chamado.id}>
              <td>{chamado.dataInicial}</td>
              <td>{chamado.nome}</td>
              <td>{chamado.canal}</td>
              <td>{chamado.problema}</td>
              <td>{chamado.numeroTicket}</td>
              <td>{chamado.dataFinal}</td>
              <td>{chamado.criadoPor}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Chamados;
