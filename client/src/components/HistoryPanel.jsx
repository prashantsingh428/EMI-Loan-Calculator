import React from 'react';

const HistoryPanel = ({ history, onLoadRecord, onDeleteRecord }) => {
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <>
      <h2 className="section-title">CALCULATION HISTORY LOGS</h2>
      
      <div className="history-grid-list">
        {history && history.length > 0 ? (
          history.map((record) => (
            <div 
              key={record._id} 
              className="history-item"
              onClick={() => onLoadRecord(record)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onLoadRecord(record);
                }
              }}
              aria-label={`Load loan history of ${formatCurrency(record.loanAmount)}`}
            >
              <div className="history-header">
                <span className="history-amount">{formatCurrency(record.loanAmount)}</span>
                <button 
                  type="button" 
                  className="btn-delete-history"
                  title="Delete record"
                  onClick={(e) => {
                    e.stopPropagation(); // Avoid loading card
                    onDeleteRecord(record._id);
                  }}
                  aria-label="Delete calculation from history"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                  </svg>
                </button>
              </div>

              <div className="history-details">
                <span>Rate: <strong>{record.interestRate}%</strong></span>
                <span>Tenure: <strong>{record.tenure} Yrs</strong></span>
              </div>
              
              <div className="history-details">
                <span>EMI: <strong>{formatCurrency(record.emi)}</strong></span>
                {record.prepayment > 0 && (
                  <span style={{ color: '#059669', fontWeight: '700' }}>
                    Saved: <strong>{record.monthsSaved}M</strong>
                  </span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="history-empty">
            No previous calculations found. Calculations will be logged here and synced to the database.
          </div>
        )}
      </div>
    </>
  );
};

export default HistoryPanel;
