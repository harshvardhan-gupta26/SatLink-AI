import React from 'react';

export default function HistoryTab({ history, onRestore, onClear, onExport }) {
  const total = history.length;
  const goodCount = history.filter(h => h.prediction === 'Good').length;
  const weakCount = history.filter(h => h.prediction === 'Weak').length;
  const dangerCount = history.filter(h => h.prediction !== 'Good' && h.prediction !== 'Weak').length;

  return (
    <div className="tab-page">
      <div className="tab-header-box">
        <div className="header-flex">
          <div>
            <h2 className="box-title">Session Test History</h2>
            <p className="box-subtitle">
              Log of all predictions executed during this session.
            </p>
          </div>
          <div className="header-btn-group">
            {total > 0 && (
              <>
                <button
                  type="button"
                  onClick={onExport}
                  className="btn-action"
                >
                  Export to JSON
                </button>
                <button
                  type="button"
                  onClick={onClear}
                  className="btn-action btn-danger-text"
                >
                  Clear History
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Summary Counters */}
      <div className="summary-boxes">
        <div className="summary-box">
          <span className="summary-label">Total Tests Run</span>
          <span className="summary-number">{total}</span>
        </div>
        <div className="summary-box">
          <span className="summary-label">Good Links</span>
          <span className="summary-number text-green">{goodCount}</span>
        </div>
        <div className="summary-box">
          <span className="summary-label">Weak Links</span>
          <span className="summary-number text-amber">{weakCount}</span>
        </div>
        <div className="summary-box">
          <span className="summary-label">Degraded Links</span>
          <span className="summary-number text-red">{dangerCount}</span>
        </div>
      </div>

      {total === 0 ? (
        <div className="empty-box">
          <p>No tests recorded in this session yet.</p>
          <small>Go to &quot;Predict Link&quot; and run a prediction to see it logged here.</small>
        </div>
      ) : (
        <div className="table-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Time</th>
                <th>Frequency</th>
                <th>Signal (dBm)</th>
                <th>Precipitation</th>
                <th>Weather</th>
                <th>Interference</th>
                <th>Predicted Result</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item, idx) => {
                const isGood = item.prediction === 'Good';
                const isWeak = item.prediction === 'Weak';
                const badge = isGood ? 'badge-good' : isWeak ? 'badge-weak' : 'badge-danger';

                return (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td className="font-mono">{item.timestamp}</td>
                    <td className="font-mono">{(item.inputs.frequency / 1e6).toFixed(1)} MHz</td>
                    <td className="font-mono">{item.inputs.signal_strength} dBm</td>
                    <td>{item.inputs.precipitation} mm/h</td>
                    <td>{item.inputs.weather_condition}</td>
                    <td>{item.inputs.interference_type}</td>
                    <td>
                      <span className={`table-badge ${badge}`}>
                        {item.prediction}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => onRestore(item)}
                        className="btn-table-load"
                      >
                        Reload Inputs
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
