import React from 'react';
import PieChart from './PieChart';

const ResultsCards = ({ emi, totalInterest, totalPayment, principal, hasPrepayment }) => {
  
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="results-column">
      <div className="results-flex">
        
        {/* Left Column: Metrics */}
        <div className="metrics-block">
          
          <div className="result-item">
            <span className="result-label">
              {hasPrepayment ? 'Monthly Home Loan EMI (With Prep)' : 'Monthly Home Loan EMI'}
            </span>
            <div className="result-value-large font-mono">
              {formatCurrency(emi)}
            </div>
            <a href="#schedule-table" className="result-link">View Details</a>
          </div>

          <div className="result-item">
            <span className="result-label">Principal Amount</span>
            <div className="result-value-normal font-mono">
              {formatCurrency(principal)}
            </div>
          </div>

          <div className="result-item">
            <span className="result-label">Interest Amount</span>
            <div className="result-value-normal font-mono" style={{ color: '#6ea3e5' }}>
              {formatCurrency(totalInterest)}
            </div>
          </div>

          <div className="result-item">
            <span className="result-label">Total Amount Payable</span>
            <div className="result-value-normal font-mono" style={{ color: '#000000' }}>
              {formatCurrency(totalPayment)}
            </div>
          </div>

        </div>

        {/* Right Column: Pie Chart */}
        <PieChart principal={principal} totalInterest={totalInterest} />

      </div>

      {/* Action Button at bottom */}
      <button type="button" className="btn-cta">
        Talk To Our Loan Expert
      </button>

    </div>
  );
};

export default ResultsCards;
