import React, { useState, useEffect } from 'react';
import CalculatorForm from './components/CalculatorForm';
import ResultsCards from './components/ResultsCards';
import ScheduleTable from './components/ScheduleTable';
import ChatBox from './components/ChatBox';


const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5005';

// Custom line-art SVG icons matching Digital Heroes's branding
const MumbaiIcon = () => (
  <svg className="city-svg-icon" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#1c3f94" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 20h20" />
    <path d="M5 20V10c0-1 1-2 2-2h10c1 0 2 1 2 2v10" />
    <path d="M9 20v-7c0-1.5 3-1.5 3 0v7" />
    <path d="M4 10h16" />
    <path d="M12 4v4M10 5.5h4" />
  </svg>
);

const JaipurIcon = () => (
  <svg className="city-svg-icon" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#1c3f94" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 21h20" />
    <path d="M4 21v-4h16v4" />
    <path d="M5 17l1-5h12l1 5" />
    <path d="M7 12l1-4h8l1 4" />
    <path d="M9 8V5c0-1 1-2 2-2h2c1 0 2 1 2 2v3" />
    <path d="M12 3v2" />
  </svg>
);

const BangaloreIcon = () => (
  <svg className="city-svg-icon" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#1c3f94" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 21h20" />
    <path d="M3 21v-3h18v3" />
    <path d="M6 18V9h12v9" />
    <path d="M8 9V6h8v3" />
    <circle cx="12" cy="13" r="2.5" />
    <path d="M12 6V3" />
  </svg>
);

const ChennaiIcon = () => (
  <svg className="city-svg-icon" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#1c3f94" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 22h20" />
    <path d="M4 22l2-12h12l2 12" />
    <path d="M6 16h12M8 12h8" />
    <path d="M10 22v-4h4v4" />
    <path d="M11 6h2M12 4v4" />
  </svg>
);

const HyderabadIcon = () => (
  <svg className="city-svg-icon" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#1c3f94" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 21h20" />
    <path d="M5 21V10h14v11" />
    <path d="M4 10V6h2v4M18 10V6h2v4" />
    <path d="M8 21c0-3.5 8-3.5 8 0" />
    <circle cx="12" cy="14" r="1.5" />
  </svg>
);

const BudgetIcon = () => (
  <svg className="budget-svg-icon" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#1c3f94" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 17h5c.8 0 1.5-.5 1.8-1.2l1-2.6c.3-.8 1-1.2 1.8-1.2H19c1.1 0 2 .9 2 2v1c0 1.1-.9 2-2 2h-6.5L10 21H2" />
    <circle cx="14" cy="7" r="4.5" />
    <path d="M12.5 6.5h3M12.5 8h3M14 5.5v3" />
  </svg>
);

function App() {
  const [history, setHistory] = useState([]);
  const [activeCalculation, setActiveCalculation] = useState(null);
  const [selectedHistoryRecord, setSelectedHistoryRecord] = useState(null);
  const [serverActive, setServerActive] = useState(true);

  // Promo bar visibility state
  const [showPromo, setShowPromo] = useState(true);

  // Chatbox visibility state
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Accordion state for FAQs
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  // Refs and state for horizontal scroll indicators
  const citiesRef = React.useRef(null);
  const budgetsRef = React.useRef(null);
  const [citiesScrollPct, setCitiesScrollPct] = useState(0);
  const [budgetsScrollPct, setBudgetsScrollPct] = useState(0);

  const handleCitiesScroll = () => {
    if (citiesRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = citiesRef.current;
      const maxScroll = scrollWidth - clientWidth;
      if (maxScroll > 0) {
        setCitiesScrollPct((scrollLeft / maxScroll) * 100);
      }
    }
  };

  const handleBudgetsScroll = () => {
    if (budgetsRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = budgetsRef.current;
      const maxScroll = scrollWidth - clientWidth;
      if (maxScroll > 0) {
        setBudgetsScrollPct((scrollLeft / maxScroll) * 100);
      }
    }
  };

  // Format currency
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Fetch past calculation logs
  const fetchHistory = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/loans`);
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
        setServerActive(true);
      }
    } catch (err) {
      console.warn("Express backend connection offline. Operating in client-only mode.");
      setServerActive(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // Automatically open the chat box after 4 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsChatOpen(true);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  // Post new calculation
  const handleCalculate = async (formData) => {
    try {
      const res = await fetch(`${API_BASE}/api/loans`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        const data = await res.json();
        setActiveCalculation(data);
        fetchHistory(); // Sync logs list
      } else {
        runClientSideCalculation(formData);
      }
    } catch (err) {
      runClientSideCalculation(formData);
    }
  };

  // Delete history record
  const handleDeleteRecord = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/api/loans/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchHistory();
      }
    } catch (err) {
      console.error("Failed to delete record:", err);
    }
  };

  // Load history item into inputs
  const handleLoadHistoryRecord = (record) => {
    setSelectedHistoryRecord(record);
  };

  // Click a budget template to set the form values programmatically
  const handleBudgetClick = (amount) => {
    setSelectedHistoryRecord({
      loanAmount: amount,
      interestRate: activeCalculation ? activeCalculation.record.interestRate : 7.75,
      tenure: activeCalculation ? activeCalculation.record.tenure : 20,
      prepayment: activeCalculation ? activeCalculation.record.prepayment : 0
    });
  };

  // Client-side math fallback in case backend server is offline
  const runClientSideCalculation = (formData) => {
    const { loanAmount, interestRate, tenure, prepayment } = formData;
    const p = parseFloat(loanAmount);
    const rate = parseFloat(interestRate);
    const yrs = parseInt(tenure);
    const prep = prepayment ? parseFloat(prepayment) : 0;

    const monthlyRate = rate / 12 / 100;
    const totalMonths = yrs * 12;

    const emi = (p * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1);

    const generateSchedule = (principal, r, n, monthlyEmi) => {
      let balance = principal;
      const arr = [];
      for (let month = 1; month <= n; month++) {
        const interest = balance * r;
        let principalPaid = monthlyEmi - interest;
        if (principalPaid >= balance) {
          principalPaid = balance;
          balance = 0;
          arr.push({ month, principal: principalPaid, interest, balance });
          break;
        } else {
          balance -= principalPaid;
          arr.push({ month, principal: principalPaid, interest, balance });
        }
      }
      return arr;
    };

    const generatePrepaymentSchedule = (principal, r, n, monthlyEmi, prepVal) => {
      let balance = principal;
      const arr = [];
      for (let month = 1; month <= n; month++) {
        const interest = balance * r;
        const basePrincipal = monthlyEmi - interest;
        if (basePrincipal >= balance) {
          arr.push({ month, principal: balance, interest, balance: 0, prepayment: 0 });
          break;
        }
        let totalPrincipal = basePrincipal + prepVal;
        let actualPrepayment = prepVal;
        if (totalPrincipal >= balance) {
          totalPrincipal = balance;
          actualPrepayment = balance - basePrincipal;
          arr.push({ month, principal: totalPrincipal, interest, balance: 0, prepayment: actualPrepayment });
          break;
        } else {
          balance -= totalPrincipal;
          arr.push({ month, principal: totalPrincipal, interest, balance, prepayment: actualPrepayment });
        }
      }
      return arr;
    };

    const findCrossoverMonth = (arr) => {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].principal > arr[i].interest) {
          return arr[i].month;
        }
      }
      return null;
    };

    const baseSchedule = generateSchedule(p, monthlyRate, totalMonths, emi);
    const baseTotalInterest = baseSchedule.reduce((sum, item) => sum + item.interest, 0);

    let finalSchedule = baseSchedule;
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
      finalSchedule = prepSchedule;
      crossoverMonth = findCrossoverMonth(prepSchedule);
    }

    setActiveCalculation({
      record: {
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
      },
      schedule: finalSchedule
    });
  };

  // Toggle FAQ items
  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  // Digital Heroes FAQs Data Array
  const faqs = [
    {
      q: "What does an EMI mean?",
      a: "EMI refers to the 'Equated Monthly Installment' which is the amount you will pay to Digital Heroes on a specific date each month till the loan is repaid in full. The EMI comprises of the principal and interest components which are structured in a way that in the initial years of your loan, the interest component is much larger than the principal component, while towards the latter half of the loan, the principal component is much larger."
    },
    {
      q: "When does my home loan EMIs start?",
      a: "EMI begins from the month subsequent to the month in which disbursement of the loan is done. For loans for under-construction properties, EMI usually begins after the complete home loan is disbursed, but customers can choose to begin their EMIs as soon as they avail their first disbursement and their EMIs will increase proportionately with every subsequent disbursement."
    },
    {
      q: "What are the benefits of using an EMI Calculator for a home loan?",
      a: "An EMI calculator is useful in planning your cash flows much in advance, so that you make your home loan payments with ease. In other words, it is a highly useful tool for your financial planning and loan servicing needs."
    },
    {
      q: "What is a pre-EMI interest on a home loan?",
      a: "Pre-EMI is the monthly payment of interest on your home loan. This amount is paid during the period till the full disbursement of the loan. Your actual loan tenure — and standard EMI (comprising both principal and interest) payments — begins once the Pre-EMI phase is over, i.e., post the loan has been fully disbursed."
    },
    {
      q: "Can I change my home loan EMI date? If yes, how can I do that?",
      a: "Yes. You can change your home loan EMI payment date by visiting your nearest Digital Heroes branch and submitting a physical request form."
    },
    {
      q: "How does your home loan repayment work?",
      a: "A home loan is usually repaid through Equated Monthly Instalments (EMI). The EMI comprises of both the principal and interest components which are structured so that in the initial years, interest is higher, while in later years principal paid is higher."
    },
    {
      q: "How do I repay a home loan?",
      a: "Digital Heroes offers various modes for repayment of the home loan. You may either issue standing instructions to your banker to pay the installments through ECS (Electronic Clearing System) or set up NACH debits. Cash payments are not accepted."
    }
  ];

  return (
    <>
      {/* 1. Digital Heroes Top Thin Contact Line */}
      <div className="dh-top-bar" aria-label="Support contacts">
        <div className="top-bar-left">
          <span>📞 +91 9289200017 - For New Home Loans</span>
          <span>💬 Get an instant call back</span>
        </div>
        <div className="top-bar-right">
          <a href="#pre-verified">Pre-verified Properties</a>
          <span style={{ color: 'rgba(255,255,255,0.3)' }}>|</span>
          <a href="#blogs">Blogs</a>
        </div>
      </div>

      {/* 2. Digital Heroes Primary Royal Blue Navbar */}
      <nav className="dh-navbar" aria-label="Main menu">
        <div className="nav-wrap">
          <div className="logo-container">
            <span className="logo-icon-red"></span>
            <span className="logo-text-blue">Digital Heroes</span>
          </div>

          <div className="primary-links">
            <a href="#loans" className="primary-link">Home Loan Products</a>
            <a href="#checklists" className="primary-link">Checklist & Calculators</a>
            <a href="#banking" className="primary-link">Banking Products</a>
            <a href="#deposits" className="primary-link no-arrow">Deposits</a>
          </div>

          <button type="button" className="btn-login">
            Login
          </button>
        </div>
      </nav>

      {/* 3. Digital Heroes Secondary Sub-Tab Menu */}
      <div className="dh-tab-bar">
        <div className="tab-container">
          <div className="tab-items">
            <a href="#calculator" className="tab-item active">Home Loan EMI Calculator</a>
            <a href="#eligibility" className="tab-item">Home Loan Eligibility Calculator</a>
            <a href="#affordability" className="tab-item">Home Loan Affordability Calculator</a>
            <a href="#refinance" className="tab-item">Home Loan Refinance Calculator</a>
          </div>
          <a href="#apply" className="btn-apply-online">Apply Online</a>
        </div>
      </div>

      {/* 4. Main Calculator Workspace */}
      <div className="app-container" id="calculator">
        {/* Breadcrumb navigation */}
        <div className="breadcrumb-nav">
          <a href="#home">Digital Heroes</a>
          <span className="breadcrumb-separator">&gt;</span>
          <span style={{ color: '#000000', fontWeight: '600' }}>Home Loan EMI Calculator</span>
        </div>

        {/* Home Loan EMI Calculator Title */}
        <h1 className="main-title">Home Loan EMI Calculator</h1>

        {/* The Calculator Card (Sliders Form on Left, Results + Pie Chart on Right) */}
        <section className="calculator-grid">

          {/* Sliders Input Form */}
          <CalculatorForm
            initialValues={selectedHistoryRecord}
            onCalculate={handleCalculate}
          />

          {/* Results Widget */}
          {activeCalculation ? (
            <ResultsCards
              emi={activeCalculation.record.emi}
              totalInterest={activeCalculation.record.totalInterest}
              totalPayment={activeCalculation.record.totalPayment}
              principal={activeCalculation.record.loanAmount}
              hasPrepayment={activeCalculation.record.prepayment > 0}
            />
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
              Specify loan inputs on the left to see calculated results.
            </div>
          )}

        </section>

        {/* Prepayment Savings Alert flat box */}
        {activeCalculation && activeCalculation.record.prepayment > 0 && activeCalculation.record.monthsSaved > 0 && (
          <div className="savings-notice" role="status" aria-live="polite">
            <span>⚡</span>
            <div>
              Without prepayment vs with prepayment: <strong>{activeCalculation.record.monthsSaved} months</strong> and <strong>{formatCurrency(activeCalculation.record.interestSaved)}</strong> interest saved.
            </div>
          </div>
        )}

        {/* Crossover point status indicator banner */}
        {activeCalculation && activeCalculation.record.crossoverMonth && (
          <div className="crossover-banner" role="status">
            <span>📌</span>
            <span>Crossover Month: <strong>{activeCalculation.record.crossoverMonth}</strong> — this is when monthly principal portion overtakes interest.</span>
          </div>
        )}

        {/* Informational Knowledge Section */}
        <section className="calculator-info-section">
          <div className="info-disclaimer">
            <strong>Disclaimer:</strong> These calculators are provided only as general self-help Planning Tools. Results depend on many factors, including the assumptions you provide. We do not guarantee their accuracy, or applicability to your circumstances. NRIs should input net income.
          </div>

          <div className="info-grid">
            {/* Intro block */}
            <div className="info-card intro-card">
              <h2>Home Loan EMI Calculator</h2>
              <p>
                Digital Heroes's home loan calculator helps you calculate your Home Loan EMI with ease. 
                Our EMI calculator for a home loan can help you make an informed decision about buying a new house. 
                The EMI calculator is useful in planning your cashflows for servicing your home loan. 
                Digital Heroes offers home loans with EMIs starting from <strong>₹716 per lac</strong> and interest rates 
                starting from <strong>7.75%* p.a.</strong> with additional features such as flexible repayment options and 
                top-up loans. With a low-interest rate and long repayment tenure, Digital Heroes ensures a comfortable 
                home loan EMI for you. With our reasonable EMIs, Digital Heroes Home Loan is lighter on your pocket. 
                Calculate the EMI that you will be required to pay for your home loan with our easy-to-understand 
                home loan EMI calculator.
              </p>
            </div>

            {/* Q&A Row */}
            <div className="qa-grid">
              <div className="info-card">
                <h3>What is a Home Loan EMI Calculator?</h3>
                <p>
                  Home Loan EMI Calculator assists in calculation of the loan installment i.e. EMI towards your home loan. 
                  It is an easy-to-use calculator and acts as a financial planning tool for a home buyer.
                </p>
              </div>

              <div className="info-card">
                <h3>What is Home Loan EMI?</h3>
                <p>
                  EMI stands for Equated Monthly Installment. It includes repayment of the principal amount and payment of 
                  the interest on the outstanding amount of your home loan. A longer loan tenure (for a maximum period of 30 years) 
                  helps in reducing the EMI.
                </p>
              </div>
            </div>

            {/* Math Formula Illustration */}
            <div className="info-card math-card">
              <h3>Illustration: How is EMI on Loan Calculated?</h3>
              <p>Formula for EMI Calculation is:</p>
              <div className="formula-box">
                <code>EMI = [P x R x (1+R)^N] / [(1+R)^N - 1]</code>
              </div>
              <div className="formula-legend">
                <div><strong>P</strong> = Principal loan amount</div>
                <div><strong>N</strong> = Loan tenure in months</div>
                <div><strong>R</strong> = Monthly interest rate (Annual Rate / 12 / 100)</div>
              </div>
              <div className="formula-example">
                <strong>For example:</strong> If a person avails a loan of <strong>₹10,00,000</strong> at an annual interest 
                rate of <strong>7.2%</strong> for a tenure of <strong>120 months (10 years)</strong>, then their EMI will be calculated as:
                <div style={{ marginTop: '0.4rem', fontFamily: 'monospace', fontWeight: 'bold' }}>
                  r = 7.2 / 12 / 100 = 0.006
                </div>
                <div style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                  EMI = ₹10,00,000 * 0.006 * (1 + 0.006)^120 / ((1 + 0.006)^120 - 1) = ₹11,714
                </div>
                <div style={{ marginTop: '0.4rem' }}>
                  The total amount payable will be <strong>₹11,714 * 120 = ₹14,05,703</strong>. The principal loan amount is 
                  <strong>₹10,00,000</strong> and the interest amount will be <strong>₹4,05,703</strong>.
                </div>
              </div>
              <p style={{ marginTop: '1rem', fontStyle: 'italic', fontSize: '0.85rem' }}>
                Calculating the EMI manually using the formula can be tedious. Digital Heroes’s EMI Calculator can help you calculate your loan EMI with ease.
              </p>
            </div>

            {/* How does EMI calculation help */}
            <div className="info-card">
              <h3>How does EMI calculation help in planning the home purchase?</h3>
              <p>
                Digital Heroes’s Home Loan EMI calculator gives a clear understanding of the amount that needs to be paid 
                towards the EMIs and helps make an informed decision about the outflow towards the housing loan every month. 
                This helps estimate the loan amount that can be availed and helps in assessing own contribution requirements 
                and the cost of the property. Therefore, knowing the EMI is crucial for calculation of home loan eligibility 
                and planning your home buying journey better.
              </p>
            </div>

            {/* Key Features List */}
            <div className="info-card features-card">
              <h3>What are Digital Heroes Home Loans Key Features and Benefits?</h3>
              <ul className="info-list">
                <li>Home Loans for purchase of a flat, row house, bungalow from private developers in approved projects.</li>
                <li>Home Loans for purchase of properties from Development Authorities such as DDA, MHADA etc.</li>
                <li>Loans for purchase of properties in an existing Co-operative Housing Society or Apartment Owners' Association or Development Authorities settlements or privately built-up homes.</li>
                <li>Loans for construction on a freehold / lease hold plot or on a plot allotted by a Development Authority.</li>
                <li>Expert legal and technical counselling to help you make the right home buying decision.</li>
                <li>Integrated branch network for availing and servicing the Home Loans anywhere in India.</li>
                <li>Special arrangement with AGIF for Home Loans for those employed in the Indian Army.</li>
              </ul>
              <p style={{ marginTop: '1rem', fontStyle: 'italic', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Our tailor-made home loans cater to customers of all age groups and employment categories. We provide longer 
                tenure loans of up to 30 years, telescopic repayment options, under adjustable rate options that specifically 
                caters to younger customers to become home owners at an early stage of their life. With our experience of 
                providing home finance for over 4 decades, we are able to understand the diverse needs of our customers 
                and fulfill their dream of owning a home.
              </p>
            </div>

            {/* How to use */}
            <div className="info-card">
              <h3>How to use Digital Heroes's Home Loan EMI Calculator?</h3>
              <p style={{ marginBottom: '0.8rem' }}>All you need to do is input the following to arrive at your EMI:</p>
              <ul className="info-list" style={{ gap: '0.4rem' }}>
                <li><strong>Loan Amount:</strong> Input the desired loan amount that you wish to avail.</li>
                <li><strong>Loan Tenure (In Years):</strong> Input the desired loan term for which you wish to avail the housing loan. A longer tenure helps in enhancing eligibility.</li>
                <li><strong>Interest Rate (% P.A.):</strong> Input interest rate.</li>
              </ul>
              <div style={{ marginTop: '1.2rem', textAlign: 'center' }}>
                <a href="#calculator" className="result-link" style={{ fontSize: '0.85rem', fontWeight: '700' }}>
                  'Click Here to Know the Prevailing Home Loan Interest Rates'
                </a>
              </div>
            </div>

            {/* Amortization schedule explain */}
            <div className="info-card">
              <h3>What is Home Loan Amortization Schedule?</h3>
              <p>
                Loan amortization is the process of reducing the debt with regular payments over the loan period. 
                A home loan amortization schedule is a table giving the details of the repayment amount, principal, and interest component.
                Digital Heroes’s EMI calculators give a fair understanding about the ratio of the principal amount to the interest due, 
                based on the loan tenure and interest rates. The calculator also provides an amortization table elucidating the 
                repayment schedule. Digital Heroes’s home loan calculator provides a complete break-up of the interest and principal amount.
              </p>
            </div>

            {/* Repayment Plan styles */}
            <div className="info-card schemes-card">
              <h3>Digital Heroes offers various Repayment Plans enhancing Home Loan Eligibility</h3>
              <p style={{ marginBottom: '1.2rem', fontSize: '0.9rem' }}>
                We offer various repayment plans for maximizing home loan eligibility to suit diverse needs:
              </p>
              <div className="schemes-grid">
                <div className="scheme-item">
                  <h4>Step Up Repayment Facility (SURF)</h4>
                  <p>
                    SURF offers an option where the repayment schedule is linked to the expected growth in your income. 
                    You can avail a higher amount of loan and pay lower EMIs in the initial years. Subsequently, the repayment 
                    is accelerated proportionately with the assumed increase in your income.
                  </p>
                </div>

                <div className="scheme-item">
                  <h4>Flexible Loan Installments Plan (FLIP)</h4>
                  <p>
                    FLIP offers a customized solution to suit your repayment capacity which is likely to alter during the 
                    term of the loan. The loan is structured in such a way that the EMI is higher during the initial years and 
                    subsequently decreases in proportion to the income.
                  </p>
                </div>

                <div className="scheme-item">
                  <h4>Tranche Based EMI</h4>
                  <p>
                    If you purchase an under-construction property, you are generally required to service only the interest on the 
                    loan amount drawn till final disbursement. In case you wish to start principal repayment immediately, 
                    you may opt to tranche the loan and start paying EMIs on the cumulative amounts disbursed.
                  </p>
                </div>

                <div className="scheme-item">
                  <h4>Accelerated Repayment Scheme</h4>
                  <p>
                    This option provides you the flexibility to increase the EMIs every year in proportion to the increase in your 
                    income, which will result in you repaying the loan much faster.
                  </p>
                </div>

                <div className="scheme-item">
                  <h4>Telescopic Repayment Option</h4>
                  <p>
                    With this option you get a longer repayment tenure of up to 30 years. This means an enhanced loan amount 
                    eligibility and smaller EMIs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Amortization Schedule Table */}
        {activeCalculation && (
          <div id="schedule-table">
            <ScheduleTable
              schedule={activeCalculation.schedule}
              hasPrepayment={activeCalculation.record.prepayment > 0}
            />
          </div>
        )}

        {/* ==========================================================================
           Digital Heroes Cities Row with Scroll Tracker
           ========================================================================== */}
        <section className="budgets-cities-section">
          <h2 className="section-header-centered">Home Loan in Different Cities</h2>
          <div className="cards-carousel-wrapper">
            <div className="cards-row" ref={citiesRef} onScroll={handleCitiesScroll}>
              <div className="city-card">
                <div className="card-icon-circle">
                  <MumbaiIcon />
                </div>
                <div className="card-title-text">Home Loans in<br />Mumbai</div>
              </div>
              <div className="city-card">
                <div className="card-icon-circle">
                  <JaipurIcon />
                </div>
                <div className="card-title-text">Home Loans in<br />Jaipur</div>
              </div>
              <div className="city-card">
                <div className="card-icon-circle">
                  <BangaloreIcon />
                </div>
                <div className="card-title-text">Home Loans in<br />Bangalore</div>
              </div>
              <div className="city-card">
                <div className="card-icon-circle">
                  <ChennaiIcon />
                </div>
                <div className="card-title-text">Home Loans in<br />Chennai</div>
              </div>
              <div className="city-card">
                <div className="card-icon-circle">
                  <HyderabadIcon />
                </div>
                <div className="card-title-text">Home Loans in<br />Hyderabad</div>
              </div>
            </div>
            <div className="scroll-indicator-bar" aria-hidden="true">
              <span className="scroll-indicator-fill" style={{ left: `${(citiesScrollPct * 0.6).toFixed(1)}%` }}></span>
            </div>
          </div>
        </section>

        {/* ==========================================================================
           Digital Heroes Budgets Row with Scroll Tracker
           ========================================================================== */}
        <section className="budgets-cities-section">
          <h2 className="section-header-centered">Get Home Loan for Different Budgets</h2>
          <div className="cards-carousel-wrapper">
            <div className="cards-row" ref={budgetsRef} onScroll={handleBudgetsScroll}>
              <div className="budget-card" onClick={() => handleBudgetClick(10000000)}>
                <div className="card-icon-circle">
                  <BudgetIcon />
                </div>
                <div className="card-title-text">₹1 Crore<br />Home Loan</div>
              </div>
              <div className="budget-card" onClick={() => handleBudgetClick(9000000)}>
                <div className="card-icon-circle">
                  <BudgetIcon />
                </div>
                <div className="card-title-text">₹90 Lakhs<br />Home Loan</div>
              </div>
              <div className="budget-card" onClick={() => handleBudgetClick(8000000)}>
                <div className="card-icon-circle">
                  <BudgetIcon />
                </div>
                <div className="card-title-text">₹80 Lakhs<br />Home Loan</div>
              </div>
              <div className="budget-card" onClick={() => handleBudgetClick(7500000)}>
                <div className="card-icon-circle">
                  <BudgetIcon />
                </div>
                <div className="card-title-text">₹75 Lakhs<br />Home Loan</div>
              </div>
              <div className="budget-card" onClick={() => handleBudgetClick(7000000)}>
                <div className="card-icon-circle">
                  <BudgetIcon />
                </div>
                <div className="card-title-text">₹70 Lakhs<br />Home Loan</div>
              </div>
            </div>
            <div className="scroll-indicator-bar" aria-hidden="true">
              <span className="scroll-indicator-fill" style={{ left: `${(budgetsScrollPct * 0.6).toFixed(1)}%` }}></span>
            </div>
          </div>
        </section>

        {/* ==========================================================================
           Digital Heroes Home Loan FAQs (Collapsible Accordion)
           ========================================================================== */}
        <section className="faq-section" id="faqs">
          <h2 className="faq-header">Home Loan FAQs</h2>
          <div className="faq-list">
            {faqs.map((faq, idx) => (
              <div key={idx} className={`faq-item ${openFaqIndex === idx ? 'open' : ''}`}>
                <div
                  className="faq-question-row"
                  onClick={() => toggleFaq(idx)}
                  role="button"
                  aria-expanded={openFaqIndex === idx}
                >
                  <span>{faq.q}</span>
                  <span className="faq-toggle-icon">{openFaqIndex === idx ? '−' : '+'}</span>
                </div>
                <div className="faq-answer-row">
                  <p>{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
          <button type="button" className="btn-view-all-faqs">
            View All Faqs
          </button>
        </section>


      </div>

      {/* ==========================================================================
         Digital Heroes Rich Multi-Column Footer
         ========================================================================== */}
      <footer className="rich-footer" aria-label="Main directory footer">
        <div className="footer-container">
          <div className="footer-cols">

            {/* Column 1: Loans & Calculators */}
            <div className="footer-col">
              <h3>Loans</h3>
              <ul style={{ marginBottom: '1.5rem' }}>
                <li><a href="#homeloans">Home Loans</a></li>
                <li><a href="#plotloans">Plot Loans</a></li>
                <li><a href="#renovation">House Renovation Loans</a></li>
                <li><a href="#nriloans">NRI Home Loans</a></li>
              </ul>

              <h3>Calculators</h3>
              <ul>
                <li><a href="#rates">Home Loan Interest Rates</a></li>
                <li><a href="#emicalc">Home Loan EMI Calculator</a></li>
                <li><a href="#eligibilitycalc">Home Loan Eligibility Calculator</a></li>
                <li><a href="#balancetransfer">Home Loan Balance Transfer Calculator</a></li>
              </ul>
            </div>

            {/* Column 2: Our Products */}
            <div className="footer-col">
              <h3>Our Products</h3>
              <ul>
                <li><a href="#savings">Savings Account</a></li>
                <li><a href="#salary">Salary Account</a></li>
                <li><a href="#current">Current Account</a></li>
                <li><a href="#deposits">Fixed Deposit</a></li>
                <li><a href="#recurring">Recurring Deposit</a></li>
                <li><a href="#credit">Credit Cards</a></li>
                <li><a href="#debit">Debit Cards</a></li>
                <li><a href="#demat">Demat Account</a></li>
                <li><a href="#personal">Personal Loan</a></li>
                <li><a href="#business">Business Loan</a></li>
                <li><a href="#car">Car Loan</a></li>
                <li><a href="#twowheeler">Two Wheeler Loan</a></li>
              </ul>
            </div>

            {/* Column 3: Quick Links */}
            <div className="footer-col">
              <h3>Quick Links</h3>
              <ul>
                <li><a href="#projects">Projects</a></li>
                <li><a href="#training">Training Centre</a></li>
                <li><a href="#buyersguide">Home Buyer's Guide</a></li>
                <li><a href="#sarfaesi">Sarfaesi Notice</a></li>
                <li><a href="#blogs">Blogs</a></li>
                <li><a href="#repayment">Customer Awareness On Loan Repayment</a></li>
                <li><a href="#forms">Forms</a></li>
                <li><a href="#faqs-link">FAQs</a></li>
                <li><a href="#sitemap">Sitemap</a></li>
                <li><a href="#unclaimed">Unclaimed Deposits</a></li>
                <li><a href="#archived">Archived Documents Of Digital Heroes Ltd</a></li>
              </ul>
            </div>

            {/* Column 4: Contact & Download */}
            <div className="footer-col">
              <h3>Contact Us</h3>
              <ul style={{ marginBottom: '1.5rem' }}>
                <li><a href="#requests">Service Request / Queries</a></li>
                <li><a href="#helpline">Helpline Number</a></li>
                <li><a href="#locate">Locate Us</a></li>
                <li><a href="#grievance">Grievance Redressal</a></li>
                <li><a href="#depositcenters">Digital Heroes Ltd Deposit Centers</a></li>
              </ul>

              <h3>Digital Heroes Ltd Home Loan App</h3>
              <div className="app-download-badges">
                <a href="#playstore" className="btn-app-store">
                  <span className="badge-icon">🤖</span>
                  <div>Get it on <span>Google Play</span></div>
                </a>
                <a href="#appstore" className="btn-app-store">
                  <span className="badge-icon">🍎</span>
                  <div>Download on the <span>App Store</span></div>
                </a>
              </div>
            </div>

            {/* Column 5: Support */}
            <div className="footer-col">
              <h3>Support</h3>
              <ul>
                <li style={{ fontSize: '0.8rem', color: '#a3b8cc', lineHeight: '1.5' }}>
                  Give A Missed Call
                  <a href="tel:+919289200017" style={{ display: 'block', fontSize: '1.05rem', color: '#ffffff', fontWeight: '700', marginTop: '0.4rem', textDecoration: 'none' }}>
                    📞 +91-9289200017
                  </a>
                </li>
              </ul>
            </div>

          </div>

          {/* Sub Footer with Copyright, Developer info & Digital Heroes CTA */}
          <div className="sub-footer-copyright">
            <div className="footer-left">
              <p style={{ fontWeight: '600', color: '#ffffff' }}>
                Developed by Prashant Singh (<a href="mailto:prashant895301@gmail.com" style={{ color: '#a3b8cc', textDecoration: 'none' }}>prashant895301@gmail.com</a>)
              </p>
              <p style={{ marginTop: '0.4rem', opacity: 0.6 }}>
                &copy; 2026 Digital Heroes Ltd. All rights reserved.
              </p>
            </div>

            <div className="footer-right">
              <a href="https://digitalheroesco.com" target="_blank" rel="noopener noreferrer" className="btn-heroes">
                Built for Digital Heroes
              </a>
              <button
                type="button"
                className="btn-back-to-top"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                BACK TO TOP
              </button>
            </div>
          </div>

        </div>
      </footer>

      {/* ==========================================================================
         Right Floating Quick Actions Sidebar
         ========================================================================== */}
      <div className="right-floating-sidebar" aria-label="Quick Actions">
        <div className="sidebar-item">
          <span className="sidebar-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ed1c24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          </span>
          <span className="sidebar-text red">Give A<br />Missed Call</span>
        </div>
        <div className="sidebar-item">
          <span className="sidebar-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ed1c24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 11V3a1.5 1.5 0 0 1 3 0v8a1.5 1.5 0 0 1 3 0v-1a1.5 1.5 0 0 1 3 0v4a7 7 0 0 1-14 0v-5a1.5 1.5 0 0 1 3 0v2" />
              <path d="M8.5 11.5v-3.5a1.5 1.5 0 0 1 3 0v3" />
              <path d="M12 21a9 9 0 0 0 9-9" />
            </svg>
          </span>
          <span className="sidebar-text red">Apply<br />Online</span>
        </div>
        <div className="sidebar-item">
          <span className="sidebar-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1c3f94" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
              <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
            </svg>
          </span>
          <span className="sidebar-text">Support</span>
        </div>
        <div className="sidebar-item">
          <span className="sidebar-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1c3f94" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </span>
          <span className="sidebar-text">Locate Us</span>
        </div>
      </div>

      {/* ==========================================================================
         Digital Heroes Sticky Bottom promo bar
         ========================================================================== */}
      {showPromo && (
        <div className="floating-promo-bar" aria-label="Quick apply promo bar">
          <div className="promo-text-group">
            <div className="promo-emi-tag">EMI starting from <strong>₹ 716/* - per lakh</strong></div>
            <div className="promo-phone-tag">
              <span className="promo-phone-num">+91 9289200017</span>
              <span className="promo-phone-lbl">For New Home Loan</span>
            </div>
          </div>
          <div className="promo-btn-group">
            <a href="#apply" className="btn-promo-apply">Apply Online</a>
            <button type="button" className="btn-promo-callback">Instant Call Back</button>
            <button 
              type="button" 
              className="btn-promo-close" 
              onClick={() => setShowPromo(false)} 
              aria-label="Close promo bar"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {/* Floating Chat Box Widget */}
      <ChatBox isChatOpen={isChatOpen} setIsChatOpen={setIsChatOpen} />
    </>
  );
}

export default App;
