import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import Chamados from './Chamados';

function App() {
  const [formData, setFormData] = useState({
    dataInicial: '',
    nome: '',
    canal: '',
    problema: '',
    numeroTicket: '',
    dataFinal: '',
    criadoPor: ''
  });
  const [loginData, setLoginData] = useState({ usuario: '', senha: '' });
  const [registerData, setRegisterData] = useState({ nome: '', usuario: '', senha: '' });
  const [message, setMessage] = useState('');
  const [loginMessage, setLoginMessage] = useState('');
  const [registerMessage, setRegisterMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [chamados, setChamados] = useState(() => {
    const storedChamados = localStorage.getItem('chamados');
    return storedChamados ? JSON.parse(storedChamados) : { 'TBADV': [], 'Russomano': [], 'UNODC': [], 'AFH': [] };
  });

  useEffect(() => {
    const storedChamados = localStorage.getItem('chamados');
    if (storedChamados) {
      setChamados(JSON.parse(storedChamados));
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      axios.get('http://localhost:3000/chamados')
        .then(response => {
          setChamados(response.data);
          localStorage.setItem('chamados', JSON.stringify(response.data));
        })
        .catch(error => {
          console.error('Erro ao buscar chamados:', error);
        });
    }
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem('chamados', JSON.stringify(chamados));
  }, [chamados]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData({ ...registerData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const novoChamado = { ...formData, criadoPor: loginData.usuario };
  
    axios.post('http://localhost:3000/chamados', novoChamado, {
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => {
        console.log('Chamado criado:', response.data);
        setChamados((prevChamados) => {
          const currentChamados = prevChamados[formData.nome] || [];
          const updatedChamados = {
            ...prevChamados,
            [formData.nome]: [...currentChamados, response.data]
          };
          localStorage.setItem('chamados', JSON.stringify(updatedChamados));
          return updatedChamados;
        });
        setMessage('Chamado registrado com sucesso!');
      })
      .catch(error => {
        console.error('Erro ao criar chamado:', error);
        setMessage('Erro ao registrar chamado. Tente novamente.');
      });
  };
  
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:3000/login', loginData, {
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => {
        console.log('Login bem-sucedido:', response.data);
        setIsLoggedIn(true);
        setLoginMessage('Login bem-sucedido!');
      })
      .catch(error => {
        console.error('Erro ao fazer login:', error);
        setLoginMessage('Erro ao fazer login. Verifique suas credenciais.');
      });
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:3000/register', registerData, {
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => {
        console.log('Usuário registrado com sucesso:', response.data);
        setRegisterMessage('Usuário registrado com sucesso! Faça login.');
        setIsRegistering(false);
      })
      .catch(error => {
        console.error('Erro ao registrar usuário:', error);
        setRegisterMessage('Erro ao registrar usuário. Tente novamente.');
      });
  };

  const exportChamados = (tipo) => {
    axios.get(`http://localhost:3000/export-chamados?tipo=${tipo}`, {
      responseType: 'blob'
    })
      .then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `chamados_${tipo}.xlsx`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch(error => {
        console.error('Erro ao exportar chamados:', error);
      });
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={
            isLoggedIn ? (
              <div>
                <h1>Registrar Chamado</h1>
                <form onSubmit={handleSubmit}>
                  <select name="nome" value={formData.nome} onChange={handleChange}>
                    <option value="">Selecionar Escritório</option>
                    <option value="TBADV">TBADV</option>
                    <option value="Russomano">Russomano</option>
                    <option value="UNODC">UNODC</option>
                    <option value="AFH">AFH</option>
                  </select>
                  <input type="date" name="dataInicial" value={formData.dataInicial} onChange={handleChange} placeholder="Data Inicial" />
                  <input type="text" name="canal" value={formData.canal} onChange={handleChange} placeholder="Canal de Atendimento" />
                  <input type="text" name="problema" value={formData.problema} onChange={handleChange} placeholder="Problema Ocorrido" />
                  <input type="text" name="numeroTicket" value={formData.numeroTicket} onChange={handleChange} placeholder="Número do Ticket" />
                  <input type="date" name="dataFinal" value={formData.dataFinal} onChange={handleChange} placeholder="Data Final" />
                  <button type="submit">Registrar</button>
                </form>
                {message && <p>{message}</p>}
                <div className="button-container">
                  <select onChange={(e) => exportChamados(e.target.value)}>
                    <option value="">Selecionar Exportação</option>
                    <option value="TBADV">Exportar TBADV</option>
                    <option value="Russomano">Exportar Russomano</option>
                    <option value="UNODC">Exportar UNODC</option>
                    <option value="AFH">Exportar AFH</option>
                  </select>
                </div>
                <div className="right-aligned">
                  <Link to="/chamados">Ver Chamados</Link>
                </div>
              </div>
            ) : isRegistering ? (
              <div>
                <h1>Registrar</h1>
                <form onSubmit={handleRegisterSubmit}>
                  <input type="text" name="nome" value={registerData.nome} onChange={handleRegisterChange} placeholder="Nome" required />
                  <input type="text" name="usuario" value={registerData.usuario} onChange={handleRegisterChange} placeholder="Usuário" required />
                  <input type="password" name="senha" value={registerData.senha} onChange={handleRegisterChange} placeholder="Senha" required />
                  <button type="submit">Registrar</button>
                </form>
                {registerMessage && <p>{registerMessage}</p>}
                <button onClick={() => setIsRegistering(false)}>Já tem uma conta? Faça login</button>
              </div>
            ) : (
              <div>
                <h1>Login</h1>
                <form onSubmit={handleLoginSubmit}>
                  <input type="text" name="usuario" value={loginData.usuario} onChange={handleLoginChange} placeholder="Usuário" required />
                  <input type="password" name="senha" value={loginData.senha} onChange={handleLoginChange} placeholder="Senha" required />
                  <button type="submit">Entrar</button>
                </form>
                {loginMessage && <p>{loginMessage}</p>}
                <button onClick={() => setIsRegistering(true)}>Não tem uma conta? Registre-se</button>
              </div>
            )
          } />
          <Route path="/chamados" element={<Chamados chamados={chamados} usuarioLogado={loginData.usuario} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
