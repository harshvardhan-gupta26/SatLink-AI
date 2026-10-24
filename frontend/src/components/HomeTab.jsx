import React, { useState } from 'react';

export default function HomeTab({ onLoadPreset, isLoading, result }) {
  const [selectedScenario, setSelectedScenario] = useState('good');

  const handleSelectScenario = (type) => {
    setSelectedScenario(type);
    if (onLoadPreset) {
      onLoadPreset(type);
    }
  };

  const currentPrediction = result?.prediction || 'Good';
  const displayClass = (currentPrediction === 'High Risk of Disconnection' || currentPrediction === 'Degraded')
    ? 'Degraded'
    : (currentPrediction === 'Weak' ? 'Weak' : 'Good');

  const confidence = result?.probabilities
    ? (result.probabilities[currentPrediction] ?? result.probabilities[displayClass] ?? null)
    : null;

  return (
    <div className="tab-page home-page-clean">
      {/* 1. Title + one-line subtitle */}
      <header className="home-header">
        <h1 className="home-title">SatLink AI</h1>
        <p className="home-subtitle">
          Predicts satellite link quality from weather and interference, and suggests an action.
        </p>
      </header>

      {/* 2. Three demo scenarios */}
      <section className="scenarios-section">
        <div className="scenarios-grid">
          {/* Clear Sky Pass */}
          <div
            className={`scenario-card ${selectedScenario === 'good' ? 'selected' : ''}`}
            onClick={() => handleSelectScenario('good')}
          >
            <div className="scenario-card-header">
              <h3 className="scenario-title">Clear Sky Pass</h3>
              <span className="badge badge-good">Good</span>
            </div>
            <p className="scenario-desc">Clear weather, no interference.</p>
          </div>

          {/* Monsoon Storm */}
          <div
            className={`scenario-card ${selectedScenario === 'rain' ? 'selected' : ''}`}
            onClick={() => handleSelectScenario('rain')}
          >
            <div className="scenario-card-header">
              <h3 className="scenario-title">Monsoon Storm</h3>
              <span className="badge badge-degraded">Degraded</span>
            </div>
            <p className="scenario-desc">Heavy rain weakens the signal.</p>
          </div>

          {/* Co-Channel Interference */}
          <div
            className={`scenario-card ${selectedScenario === 'interference' ? 'selected' : ''}`}
            onClick={() => handleSelectScenario('interference')}
          >
            <div className="scenario-card-header">
              <h3 className="scenario-title">Co-Channel Interference</h3>
              <span className="badge badge-weak">Weak</span>
            </div>
            <p className="scenario-desc">Nearby signals disturb the link.</p>
          </div>
        </div>

        <div className="predict-action-row">
          <button
            type="button"
            className="btn-run-prediction"
            disabled={isLoading}
            onClick={() => onLoadPreset(selectedScenario)}
          >
            {isLoading ? 'Running Prediction...' : 'Run Prediction'}
          </button>
        </div>
      </section>

      {/* 3. Prediction Result Area */}
      {result && (
        <section className="result-section">
          <div className="result-card">
            <div className="result-main-row">
              <span className={`result-badge badge-${displayClass.toLowerCase()}`}>
                {displayClass}
              </span>
              {confidence !== null && (
                <span className="result-confidence">{confidence}% confidence</span>
              )}
            </div>

            <p className="result-recommendation">
              {result.recommendation || 'Communication conditions are currently stable. Continue normal monitoring.'}
            </p>

            <details className="result-details">
              <summary className="result-details-summary">Show details</summary>
              <div className="result-details-body">
                <div className="details-col">
                  <span className="details-col-title">Class Probabilities</span>
                  <div className="details-item">
                    <span>Good:</span>
                    <span>{result.probabilities?.['Good'] ?? 0}%</span>
                  </div>
                  <div className="details-item">
                    <span>Weak:</span>
                    <span>{result.probabilities?.['Weak'] ?? 0}%</span>
                  </div>
                  <div className="details-item">
                    <span>Degraded:</span>
                    <span>
                      {result.probabilities?.['Degraded'] ??
                        result.probabilities?.['High Risk of Disconnection'] ??
                        0}%
                    </span>
                  </div>
                </div>

                {result.inputs && (
                  <div className="details-col">
                    <span className="details-col-title">Input Conditions</span>
                    <div className="details-item">
                      <span>Frequency:</span>
                      <span>{(result.inputs.frequency / 1e6).toFixed(0)} MHz</span>
                    </div>
                    <div className="details-item">
                      <span>Signal Strength:</span>
                      <span>{result.inputs.signal_strength} dBm</span>
                    </div>
                    <div className="details-item">
                      <span>Weather:</span>
                      <span>{result.inputs.weather_condition}</span>
                    </div>
                    <div className="details-item">
                      <span>Precipitation:</span>
                      <span>{result.inputs.precipitation} mm/h</span>
                    </div>
                    <div className="details-item">
                      <span>Interference:</span>
                      <span>{result.inputs.interference_type}</span>
                    </div>
                  </div>
                )}
              </div>
            </details>
          </div>
        </section>
      )}

      {/* 4. Compact Pipeline Row */}
      <section className="pipeline-section">
        <div className="pipeline-row">
          <span className="pipeline-step">Input Conditions</span>
          <span className="pipeline-arrow">&rarr;</span>
          <span className="pipeline-step">Random Forest</span>
          <span className="pipeline-arrow">&rarr;</span>
          <span className="pipeline-step">Link Quality</span>
          <span className="pipeline-arrow">&rarr;</span>
          <span className="pipeline-step">Recommendation</span>
        </div>
      </section>
    </div>
  );
}
