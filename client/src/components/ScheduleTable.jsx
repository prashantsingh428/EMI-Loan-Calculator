import React, { useState, useEffect } from 'react';

const ScheduleTable = ({ schedule, hasPrepayment }) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to page 1 if schedule changes
  useEffect(() => {
    setCurrentPage(1);
  }, [schedule]);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const totalPages = Math.ceil(schedule.length / 12);
  const startIndex = (currentPage - 1) * 12;
  const visibleRows = schedule.slice(startIndex, startIndex + 12);

  return (
    <div className="dashboard-card table-card">
      <div className="table-header-flex">
        <h3 className="card-title" style={{ border: 'none', marginBottom: 0, paddingBottom: 0 }}>
          AMORTIZATION SCHEDULE
        </h3>
        <span className={`status-badge ${hasPrepayment ? 'active' : ''}`}>
          {hasPrepayment ? 'WITH PREPAYMENT' : 'STANDARD'}
        </span>
      </div>

      {schedule && schedule.length > 0 ? (
        <>
          <div className="schedule-table-wrapper">
            <table className="schedule-table">
              <thead>
                <tr>
                  <th scope="col">MONTH</th>
                  <th scope="col">PRINCIPAL PAID</th>
                  <th scope="col">INTEREST PAID</th>
                  <th scope="col">OUTSTANDING BALANCE</th>
                </tr>
              </thead>
              <tbody>
                {visibleRows.map((row) => (
                  <tr key={row.month}>
                    <td>Month {row.month}</td>
                    <td className="font-mono">{formatCurrency(row.principal)}</td>
                    <td className="font-mono">{formatCurrency(row.interest)}</td>
                    <td className="font-mono">{formatCurrency(row.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="pagination-controls">
              <button
                type="button"
                className="btn-pagination"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                &larr; Prev
              </button>

              <div className="pagination-select-wrapper">
                <select
                  value={currentPage}
                  onChange={(e) => setCurrentPage(Number(e.target.value))}
                  className="pagination-select"
                  aria-label="Select Year"
                >
                  {Array.from({ length: totalPages }, (_, i) => {
                    const year = i + 1;
                    const startMonth = i * 12 + 1;
                    const endMonth = Math.min((i + 1) * 12, schedule.length);
                    return (
                      <option key={year} value={year}>
                        Year {year} (Months {startMonth}–{endMonth})
                      </option>
                    );
                  })}
                </select>
              </div>

              <button
                type="button"
                className="btn-pagination"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next &rarr;
              </button>
            </div>
          )}
        </>
      ) : (
        <div style={{ textSelf: 'center', padding: '1rem', color: '#94a3b8', fontSize: '0.85rem' }}>
          No schedule entries to display.
        </div>
      )}
    </div>
  );
};

export default ScheduleTable;
