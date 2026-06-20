const mongoose = require('mongoose');

const LoanSchema = new mongoose.Schema({
  loanAmount: {
    type: Number,
    required: [true, 'Loan amount is required.'],
    min: [1, 'Amount must be greater than zero.']
  },
  interestRate: {
    type: Number,
    required: [true, 'Interest rate is required.'],
    min: [0.1, 'Rate must be at least 0.1%.'],
    max: [49.99, 'Rate must be less than 50%.']
  },
  tenure: {
    type: Number,
    required: [true, 'Tenure is required.'],
    min: [1, 'Tenure must be at least 1 year.'],
    max: [30, 'Tenure must be at most 30 years.']
  },
  prepayment: {
    type: Number,
    default: 0
  },
  emi: {
    type: Number,
    required: true
  },
  totalInterest: {
    type: Number,
    required: true
  },
  totalPayment: {
    type: Number,
    required: true
  },
  monthsSaved: {
    type: Number,
    default: 0
  },
  interestSaved: {
    type: Number,
    default: 0
  },
  crossoverMonth: {
    type: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Loan', LoanSchema);
