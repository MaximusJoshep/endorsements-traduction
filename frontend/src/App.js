import React, { useState } from 'react';
import './App.css';
import EndorseForm from './components/EndorseForm';
import EndorseResult from './components/EndorseResult';
import { translateEndorse, login } from './services/api';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showLogin, setShowLogin] = useState(!token);

  const handleLogin = async (username, password) => {
    try {
      const response = await login(username, password);
      const newToken = response.token;
      setToken(newToken);
      localStorage.setItem('token', newToken);
      setShowLogin(false);
      setError(null);
    } catch (err) {
      setError('Error al iniciar sesión. Usa cualquier usuario y contraseña en desarrollo.');
    }
  };

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('token');
    setShowLogin(true);
    setResult(null);
  };

  const handleTranslate = async (formData) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await translateEndorse(formData, token);
      setResult(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        'Error al traducir el endoso. Verifica que el API esté corriendo.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (showLogin) {
    return (
      <div className="app">
        <div className="container">
          <div className="login-card">
            <h1>🔐 Iniciar Sesión</h1>
            <p>Ingresa tus credenciales para acceder al sistema</p>
            <LoginForm onLogin={handleLogin} error={error} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="container">
        <header className="app-header">
          <h1>🔄 Traductor de Endosos</h1>
          <button className="logout-btn" onClick={handleLogout}>
            Cerrar Sesión
          </button>
        </header>

        <div className="content-grid">
          <div className="form-section">
            <h2>Datos de Entrada (JSON Plano)</h2>
            <EndorseForm onSubmit={handleTranslate} loading={loading} />
          </div>

          <div className="result-section">
            <h2>Resultado (JSON Estructurado)</h2>
            {error && (
              <div className="error-message">
                <strong>Error:</strong> {error}
              </div>
            )}
            {loading && <div className="loading">Procesando...</div>}
            {result && <EndorseResult data={result} />}
          </div>
        </div>
      </div>
    </div>
  );
}

function LoginForm({ onLogin, error }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      {error && <div className="error-message">{error}</div>}
      <div className="form-group">
        <label>Usuario:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          placeholder="Ingresa tu usuario"
        />
      </div>
      <div className="form-group">
        <label>Contraseña:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Ingresa tu contraseña"
        />
      </div>
      <button type="submit" className="submit-btn">
        Iniciar Sesión
      </button>
      <p className="login-hint">
        💡 En desarrollo, puedes usar cualquier usuario y contraseña
      </p>
    </form>
  );
}

export default App;

