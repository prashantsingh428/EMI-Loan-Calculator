import React, { useState, useEffect } from 'react';

const CalculatorForm = ({ initialValues, onCalculate }) => {
  const [loanAmount, setLoanAmount] = useState('25,00,000');
  const [tenure, setTenure] = useState('30');
  const [interestRate, setInterestRate] = useState('7.75');
  const [prepayment, setPrepayment] = useState('');

  const [errors, setErrors] = useState({
    loanAmount: '',
    interestRate: '',
    tenure: '',
    prepayment: ''
  });

  // Keep track if values loaded from history
  useEffect(() => {
    if (initialValues) {
      setLoanAmount(parseFloat(initialValues.loanAmount).toLocaleString('en-IN'));
      setInterestRate(initialValues.interestRate.toString());
      setTenure(initialValues.tenure.toString());
      setPrepayment(initialValues.prepayment > 0 ? parseFloat(initialValues.prepayment).toLocaleString('en-IN') : '');
      
      // Clear errors on history reload
      setErrors({ loanAmount: '', interestRate: '', tenure: '', prepayment: '' });
    }
  }, [initialValues]);

  // Clean value parser helper
  const getCleanVal = (val) => val.toString().replace(/,/g, '').trim();

  // Validate individual field
  const validateField = (name, value) => {
    let errorMsg = '';
    const cleanVal = getCleanVal(value);
    const num = cleanVal === '' ? 0 : parseFloat(cleanVal);

    if (name === 'loanAmount') {
      if (cleanVal === '') {
        errorMsg = 'Loan amount is required.';
      } else if (isNaN(num) || num < 100000 || num > 100000000) {
        errorMsg = 'Amount must be between ₹1 Lakh and ₹10 Crores.';
      }
    } else if (name === 'interestRate') {
      if (cleanVal === '') {
        errorMsg = 'Interest rate is required.';
      } else if (isNaN(num) || num < 0.5 || num > 15) {
        errorMsg = 'Rate must be between 0.5% and 15%.';
      }
    } else if (name === 'tenure') {
      if (cleanVal === '') {
        errorMsg = 'Tenure is required.';
      } else if (isNaN(num) || num < 1 || num > 30 || !Number.isInteger(num)) {
        errorMsg = 'Tenure must be an integer between 1 and 30.';
      }
    } else if (name === 'prepayment') {
      if (cleanVal !== '' && (isNaN(num) || num < 0)) {
        errorMsg = 'Prepayment must be positive.';
      }
    }

    setErrors(prev => ({ ...prev, [name]: errorMsg }));
    return errorMsg === '';
  };

  // Blur triggers validation + formatting
  const handleBlur = (name, value, setter) => {
    const cleanVal = getCleanVal(value);
    const num = cleanVal === '' ? 0 : parseFloat(cleanVal);

    validateField(name, value);

    if ((name === 'loanAmount' || name === 'prepayment') && num > 0 && !isNaN(num)) {
      setter(num.toLocaleString('en-IN', { maximumFractionDigits: 0 }));
    }
  };

  // Focus strips commas
  const handleFocus = (value, setter) => {
    setter(getCleanVal(value));
  };

  // Check form completeness and trigger parent calc
  useEffect(() => {
    const isValid = 
      getCleanVal(loanAmount) !== '' &&
      getCleanVal(interestRate) !== '' &&
      getCleanVal(tenure) !== '' &&
      errors.loanAmount === '' &&
      errors.interestRate === '' &&
      errors.tenure === '' &&
      errors.prepayment === '';

    if (isValid) {
      const p = parseFloat(getCleanVal(loanAmount));
      const rate = parseFloat(getCleanVal(interestRate));
      const yrs = parseInt(getCleanVal(tenure));
      const prep = prepayment ? parseFloat(getCleanVal(prepayment)) : 0;
      
      onCalculate({ loanAmount: p, interestRate: rate, tenure: yrs, prepayment: prep });
    }
  }, [loanAmount, interestRate, tenure, prepayment, errors]);

  // Safe numerical fallback for range inputs
  const getNumericRangeVal = (val, def) => {
    const num = parseFloat(getCleanVal(val));
    return isNaN(num) ? def : num;
  };

  // Helper to calculate slider background percent
  const getPercent = (val, min, max) => {
    const numVal = getNumericRangeVal(val, min);
    const pct = ((numVal - min) / (max - min)) * 100;
    return Math.min(Math.max(pct, 0), 100);
  };

  return (
    <div className="sliders-column">
      
      {/* Slider: Loan Amount */}
      <div className={`form-group ${errors.loanAmount ? 'has-error' : ''}`}>
        <div className="label-row">
          <label htmlFor="loan-amount" className="form-label">Loan Amount</label>
          <div className="input-container">
            <span className="input-prefix">₹</span>
            <input
              type="text"
              id="loan-amount"
              value={loanAmount}
              onChange={(e) => {
                setLoanAmount(e.target.value);
                validateField('loanAmount', e.target.value);
              }}
              onFocus={() => handleFocus(loanAmount, setLoanAmount)}
              onBlur={(e) => handleBlur('loanAmount', e.target.value, setLoanAmount)}
              placeholder="25,00,000"
              autoComplete="off"
              aria-describedby="loan-amount-err"
            />
          </div>
        </div>
        <input
          type="range"
          className="slider"
          min="100000"
          max="100000000"
          step="50000"
          value={getNumericRangeVal(loanAmount, 100000)}
          onChange={(e) => {
            const val = parseFloat(e.target.value);
            setLoanAmount(val.toLocaleString('en-IN'));
            validateField('loanAmount', val.toString());
          }}
          style={{
            background: `linear-gradient(to right, #1c3f94 0%, #1c3f94 ${getPercent(loanAmount, 100000, 100000000)}%, #cbd5e1 ${getPercent(loanAmount, 100000, 100000000)}%, #cbd5e1 100%)`
          }}
          aria-label="Loan amount slider"
        />
        <div className="slider-limits">
          <span>₹ 1 Lac</span>
          <span>₹ 10 Cr</span>
        </div>
        <span className="form-error" id="loan-amount-err" aria-live="polite">
          {errors.loanAmount}
        </span>
      </div>

      {/* Slider: Tenure (Years) */}
      <div className={`form-group ${errors.tenure ? 'has-error' : ''}`}>
        <div className="label-row">
          <label htmlFor="loan-tenure" className="form-label">Tenure (Years)</label>
          <div className="input-container">
            <input
              type="number"
              id="loan-tenure"
              value={tenure}
              onChange={(e) => {
                setTenure(e.target.value);
                validateField('tenure', e.target.value);
              }}
              onBlur={(e) => validateField('tenure', e.target.value)}
              placeholder="30"
              autoComplete="off"
              aria-describedby="loan-tenure-err"
            />
          </div>
        </div>
        <input
          type="range"
          className="slider"
          min="1"
          max="30"
          step="1"
          value={getNumericRangeVal(tenure, 30)}
          onChange={(e) => {
            const val = parseInt(e.target.value);
            setTenure(val.toString());
            validateField('tenure', val.toString());
          }}
          style={{
            background: `linear-gradient(to right, #1c3f94 0%, #1c3f94 ${getPercent(tenure, 1, 30)}%, #cbd5e1 ${getPercent(tenure, 1, 30)}%, #cbd5e1 100%)`
          }}
          aria-label="Loan tenure slider"
        />
        <div className="slider-limits">
          <span>1</span>
          <span>30</span>
        </div>
        <span className="form-error" id="loan-tenure-err" aria-live="polite">
          {errors.tenure}
        </span>
      </div>

      {/* Slider: Interest Rate */}
      <div className={`form-group ${errors.interestRate ? 'has-error' : ''}`}>
        <div className="label-row">
          <label htmlFor="interest-rate" className="form-label">Interest Rate (% P.A.)</label>
          <div className="input-container">
            <input
              type="number"
              id="interest-rate"
              value={interestRate}
              onChange={(e) => {
                setInterestRate(e.target.value);
                validateField('interestRate', e.target.value);
              }}
              onBlur={(e) => validateField('interestRate', e.target.value)}
              step="0.05"
              placeholder="7.75"
              autoComplete="off"
              aria-describedby="interest-rate-err"
            />
            <span className="input-suffix">%</span>
          </div>
        </div>
        <input
          type="range"
          className="slider"
          min="0.5"
          max="15"
          step="0.05"
          value={getNumericRangeVal(interestRate, 7.75)}
          onChange={(e) => {
            const val = parseFloat(e.target.value);
            setInterestRate(val.toString());
            validateField('interestRate', val.toString());
          }}
          style={{
            background: `linear-gradient(to right, #1c3f94 0%, #1c3f94 ${getPercent(interestRate, 0.5, 15)}%, #cbd5e1 ${getPercent(interestRate, 0.5, 15)}%, #cbd5e1 100%)`
          }}
          aria-label="Interest rate slider"
        />
        <div className="slider-limits">
          <span>0.5</span>
          <span>15</span>
        </div>
        <span className="form-error" id="interest-rate-err" aria-live="polite">
          {errors.interestRate}
        </span>
      </div>

      {/* Slider: Prepayment Amount */}
      <div className={`form-group ${errors.prepayment ? 'has-error' : ''}`}>
        <div className="label-row">
          <label htmlFor="prepayment-amount" className="form-label">Monthly Prepayment (Optional)</label>
          <div className="input-container">
            <span className="input-prefix">₹</span>
            <input
              type="text"
              id="prepayment-amount"
              value={prepayment}
              onChange={(e) => {
                setPrepayment(e.target.value);
                validateField('prepayment', e.target.value);
              }}
              onFocus={() => handleFocus(prepayment, setPrepayment)}
              onBlur={(e) => handleBlur('prepayment', e.target.value, setPrepayment)}
              placeholder="5,000"
              autoComplete="off"
              aria-describedby="prepayment-err"
            />
          </div>
        </div>
        <input
          type="range"
          className="slider"
          min="0"
          max="200000"
          step="1000"
          value={getNumericRangeVal(prepayment, 0)}
          onChange={(e) => {
            const val = parseFloat(e.target.value);
            setPrepayment(val > 0 ? val.toLocaleString('en-IN') : '');
            validateField('prepayment', val.toString());
          }}
          style={{
            background: `linear-gradient(to right, #1c3f94 0%, #1c3f94 ${getPercent(prepayment, 0, 200000)}%, #cbd5e1 ${getPercent(prepayment, 0, 200000)}%, #cbd5e1 100%)`
          }}
          aria-label="Prepayment amount slider"
        />
        <div className="slider-limits">
          <span>₹ 0</span>
          <span>₹ 2 Lac</span>
        </div>
        <span className="form-error" id="prepayment-err" aria-live="polite">
          {errors.prepayment}
        </span>
      </div>

    </div>
  );
};

export default CalculatorForm;
