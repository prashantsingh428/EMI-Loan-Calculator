const express = require('express');
const router = express.Router();
const Loan = require('../models/Loan');

// --- Helper Schedule Generators ---
const generateSchedule = (p, r, n, emi) => {
  let balance = p;
  const schedule = [];
  for (let month = 1; month <= n; month++) {
    const interest = balance * r;
    let principal = emi - interest;

    if (principal >= balance) {
      principal = balance;
      balance = 0;
      schedule.push({ month, principal, interest, balance });
      break;
    } else {
      balance -= principal;
      schedule.push({ month, principal, interest, balance });
    }
  }
  return schedule;
};

const generatePrepaymentSchedule = (p, r, n, emi, prepVal) => {
  let balance = p;
  const schedule = [];
  for (let month = 1; month <= n; month++) {
    const interest = balance * r;
    const basePrincipal = emi - interest;

    if (basePrincipal >= balance) {
      schedule.push({ month, principal: balance, interest, balance: 0, prepayment: 0 });
      break;
    }

    let totalPrincipal = basePrincipal + prepVal;
    let actualPrepayment = prepVal;

    if (totalPrincipal >= balance) {
      totalPrincipal = balance;
      actualPrepayment = balance - basePrincipal;
      schedule.push({ month, principal: totalPrincipal, interest, balance: 0, prepayment: actualPrepayment });
      break;
    } else {
      balance -= totalPrincipal;
      schedule.push({ month, principal: totalPrincipal, interest, balance, prepayment: actualPrepayment });
    }
  }
  return schedule;
};

const findCrossoverMonth = (schedule) => {
  for (let i = 0; i < schedule.length; i++) {
    if (schedule[i].principal > schedule[i].interest) {
      return schedule[i].month;
    }
  }
  return null;
};

// @route   POST /api/loans
// @desc    Calculate loan, save to MongoDB, and return computed metrics + active schedule
router.post('/', async (req, res) => {
  try {
    const { loanAmount, interestRate, tenure, prepayment } = req.body;

    // Validate inputs
    const p = parseFloat(loanAmount);
    const rate = parseFloat(interestRate);
    const yrs = parseInt(tenure);
    const prep = prepayment ? parseFloat(prepayment) : 0;

    if (!p || p <= 0) {
      return res.status(400).json({ error: 'Loan amount must be a positive number.' });
    }
    if (!rate || rate <= 0 || rate >= 50) {
      return res.status(400).json({ error: 'Interest rate must be between 0.1% and 49.99%.' });
    }
    if (!yrs || yrs < 1 || yrs > 30) {
      return res.status(400).json({ error: 'Tenure must be between 1 and 30 years.' });
    }
    if (prep < 0) {
      return res.status(400).json({ error: 'Prepayment cannot be negative.' });
    }

    // Calculations setup
    const monthlyRate = rate / 12 / 100;
    const totalMonths = yrs * 12;

    // Base EMI
    const emi = (p * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
                (Math.pow(1 + monthlyRate, totalMonths) - 1);

    const baseSchedule = generateSchedule(p, monthlyRate, totalMonths, emi);
    const baseTotalInterest = baseSchedule.reduce((sum, item) => sum + item.interest, 0);

    let activeSchedule = baseSchedule;
    let crossoverMonth = findCrossoverMonth(baseSchedule);
    let monthsSaved = 0;
    let interestSaved = 0;
    let totalInterest = baseTotalInterest;
    let totalPayment = p + baseTotalInterest;

    if (prep > 0) {
      const prepSchedule = generatePrepaymentSchedule(p, monthlyRate, totalMonths, emi, prep);
      const prepTotalInterest = prepSchedule.reduce((sum, item) => sum + item.interest, 0);

      monthsSaved = totalMonths - prepSchedule.length;
      interestSaved = baseTotalInterest - prepTotalInterest;
      totalInterest = prepTotalInterest;
      totalPayment = p + prepTotalInterest;
      activeSchedule = prepSchedule;
      crossoverMonth = findCrossoverMonth(prepSchedule);
    }

    // Save record to DB
    const newLoan = new Loan({
      loanAmount: p,
      interestRate: rate,
      tenure: yrs,
      prepayment: prep,
      emi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalPayment: Math.round(totalPayment),
      monthsSaved,
      interestSaved: Math.round(interestSaved),
      crossoverMonth
    });

    const savedLoan = await newLoan.save();

    // Send back both database record and generated schedule for client UI rendering
    res.json({
      record: savedLoan,
      schedule: activeSchedule
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

// @route   GET /api/loans
// @desc    Get calculation history logs
router.get('/', async (req, res) => {
  try {
    const history = await Loan.find().sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

// @route   DELETE /api/loans/:id
// @desc    Delete a log from history
router.delete('/:id', async (req, res) => {
  try {
    const record = await Loan.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ error: 'Record not found.' });
    }
    await Loan.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Record deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

module.exports = router;
