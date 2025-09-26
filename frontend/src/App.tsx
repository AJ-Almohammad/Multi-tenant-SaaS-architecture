import React from 'react';
import { useMockAuth } from './utils/mockAuth';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import './App.css';

function App() {
  const { isAuthenticated, user, login, logout } = useMockAuth();

  return (
    <div className="App">
      {isAuthenticated && user ? (
        <Dashboard user={user} onLogout={logout} />
      ) : (
        <Login onLogin={login} />
      )}
    </div>
  );
}

export default App;
