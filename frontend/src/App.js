// frontend/src/App.js
import React from 'react';
import QuantumDashboard from './components/QuantumDashboard';

function App() {
  return (
    <div className="App" style={{ backgroundColor: '#f0f2f5', minHeight: '100vh', padding: '20px' }}>
      <QuantumDashboard />
    </div>
  );
}

export default App;