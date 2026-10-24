import React, { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import Navbar from './components/Navbar';
import HomeTab from './components/HomeTab';
import PredictTab from './components/PredictTab';
import GraphsTab from './components/GraphsTab';
import HistoryTab from './components/HistoryTab';
import AboutTab from './components/AboutTab';

const DEFAULT_INPUTS = {
  frequency: 120000000,
  signal_strength: -45,
  bandwidth: 500000,
  temperature: 28,
  humidity: 55,
  wind_speed: 8,
  precipitation: 0,
  wifi_strength: -35,
  altitude: 400,
  air_pressure: 1013,
  weather_condition: 'Sunny',
  interference_type: 'None/Unknown'
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser]             = useState('');
  const [activeTab, setActiveTab] = useState('home');
  const [formData, setFormData] = useState(DEFAULT_INPUTS);
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);

  const handleLogin = (username) => {
    setUser(username);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser('');
  };

  // Auto-run initial prediction once so the dashboard has sample data on first load
  useEffect(() => {
    executePrediction(DEFAULT_INPUTS);
  }, []);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    setFormData(DEFAULT_INPUTS);
  };

  const handleLoadPreset = (type) => {
    let preset = { ...DEFAULT_INPUTS };
    if (type === 'good') {
      preset = {
        ...DEFAULT_INPUTS,
        signal_strength: -38,
        precipitation: 0,
        weather_condition: 'Sunny',
        interference_type: 'None/Unknown',
        wifi_strength: -65
      };
    } else if (type === 'rain') {
      preset = {
        ...DEFAULT_INPUTS,
        signal_strength: -89,
        precipitation: 42,
        weather_condition: 'Rainy',
        humidity: 95,
        wind_speed: 18,
        interference_type: 'None/Unknown'
      };
    } else if (type === 'interference') {
      preset = {
        ...DEFAULT_INPUTS,
        signal_strength: -65,
        weather_condition: 'Cloudy',
        precipitation: 0,
        interference_type: 'Co-channel',
        wifi_strength: -45
      };
    }
    setFormData(preset);
    executePrediction(preset);
  };

  async function executePrediction(payloadData = formData) {
    setIsLoading(true);
    setError('');

    const payload = { ...payloadData };
    Object.keys(payload).forEach(k => {
      if (!['weather_condition', 'interference_type'].includes(k)) {
        payload[k] = Number(payload[k]);
      }
    });

    try {
      const res = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      const data = await res.json();
      
      const rawPrediction = data.prediction;
      const normalizedPrediction = (rawPrediction === 'High Risk of Disconnection' || rawPrediction === 'Degraded')
        ? 'Degraded'
        : (rawPrediction === 'Weak' ? 'Weak' : 'Good');

      const normalizedProbabilities = {};
      Object.entries(data.probabilities || {}).forEach(([k, v]) => {
        const normKey = (k === 'High Risk of Disconnection' || k === 'Degraded') ? 'Degraded' : k;
        normalizedProbabilities[normKey] = v;
      });

      const normalizedData = {
        ...data,
        prediction: normalizedPrediction,
        probabilities: normalizedProbabilities
      };

      setResult(normalizedData);

      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setHistory(prev => [
        {
          timestamp: timeStr,
          prediction: normalizedPrediction,
          probabilities: normalizedProbabilities,
          inputs: payload
        },
        ...prev.slice(0, 19)
      ]);
    } catch (err) {
      console.error(err);
      setError('Cannot connect to backend server at http://localhost:8000. Please make sure FastAPI is running.');
    } finally {
      setIsLoading(false);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    executePrediction(formData);
  };

  const handleRestore = (item) => {
    setFormData(item.inputs);
    executePrediction(item.inputs);
    setActiveTab('predict');
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  const handleExport = () => {
    const blob = new Blob([
      JSON.stringify({
        project: 'SatLink AI',
        exportedAt: new Date().toISOString(),
        history
      }, null, 2)
    ], { type: 'application/json' });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `satlink-test-history-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="site-wrapper">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onLogout={handleLogout}
      />

      <main className="content-container">
        {error && (
          <div className="error-banner">
            <strong>Connection Error:</strong> {error}
          </div>
        )}

        {activeTab === 'home' && (
          <HomeTab
            onNavigate={setActiveTab}
            onLoadPreset={handleLoadPreset}
            isLoading={isLoading}
            result={result}
          />
        )}

        {activeTab === 'predict' && (
          <PredictTab
            formData={formData}
            onChange={handleChange}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            result={result}
            onReset={handleReset}
            onLoadPreset={handleLoadPreset}
            onGoToGraphs={() => setActiveTab('graphs')}
          />
        )}

        {activeTab === 'graphs' && (
          <GraphsTab
            formData={formData}
            result={result}
          />
        )}

        {activeTab === 'history' && (
          <HistoryTab
            history={history}
            onRestore={handleRestore}
            onClear={handleClearHistory}
            onExport={handleExport}
          />
        )}

        {activeTab === 'about' && (
          <AboutTab />
        )}
      </main>

      <footer className="site-footer-simple">
        <div className="footer-inner">
          <span>SatLink AI &middot; Satellite Link Quality Prediction System</span>
        </div>
      </footer>
    </div>
  );
}
