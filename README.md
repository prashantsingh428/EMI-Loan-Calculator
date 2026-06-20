# EMI-Loan-Calculator 💰📈

A feature-rich, high-performance MERN Stack Home Loan EMI Calculator and Prepayment Planning Tool. Inspired by top-tier banking interfaces, it helps home buyers calculate monthly installments, model prepayments to calculate savings, view paginated amortization tables, and interact with an automated chat assistant.

---

## 🚀 Key Features

*   **Interactive Input Sliders**: Seamlessly adjust Loan Amount (up to ₹10 Cr), Tenure (up to 30 Years), Interest Rate, and Optional Monthly Prepayments.
*   **Dynamic Canvas Pie Chart**: High-performance, pixel-perfect HTML5 Canvas-based pie chart showing the exact breakdown between Principal and Interest components.
*   **Prepayment Savings Visualizer**: Auto-calculates the amount of interest saved and the number of months shaved off the loan tenure due to prepayments.
*   **Paginated Amortization Schedule**: Displays month-by-month payment schedules divided into Year-by-Year pages (12 months at a time), featuring quick dropdown navigation to jump directly to any year.
*   **Automated Help Desk Chatbox**: A smart support assistant that automatically opens after a 4-second delay, complete with interactive suggestion chips and automated FAQ responses.
*   **Detailed Informational / SEO Panels**: Complete guides explaining loan calculations, mathematical formulas,SURF (Step Up Repayment), FLIP, and other specialized home loan structures.

---

## 🛠️ Technology Stack

*   **Frontend**: React (Vite), Vanilla CSS (glassmorphic cues, responsive grids, custom scroll indicators).
*   **Backend**: Node.js, Express.js.
*   **Database**: MongoDB (stores calculation records/logs).
*   **Concurrency**: Orchestrated using `concurrently` to run frontend and backend developers' servers simultaneously.

---

## 📦 Installation & Setup

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/prashantsingh428/EMI-Loan-Calculator.git
    cd EMI-Loan-Calculator
    ```

2.  **Install All Dependencies** (Installs root, server, and client dependencies simultaneously):
    ```bash
    npm run install-all
    ```

3.  **Configure Environment Variables**:
    *   Create a `.env` file in the `server` folder with your `MONGODB_URI` and `PORT`.

4.  **Run Locally (Development mode)**:
    Runs both the Node/Express backend and Vite frontend concurrently:
    ```bash
    npm run dev
    ```
    *   **Frontend URL**: `http://localhost:5174`
    *   **Backend URL**: `http://localhost:5005`
