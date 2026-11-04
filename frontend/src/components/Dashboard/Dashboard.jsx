import { useState } from "react";

import TransactionList from "../Transactions/TransactionList";
import TransactionForm from "../Transactions/TransactionForm";
import ImportTransactions from "../Transactions/ImportTransactions";

import "./Dashboard.css";

function Dashboard() {
    const [transactions, setTransactions] = useState([
        {
            id: 1,
            description: "Grocery Shopping",
            category: "Food",
            type: "Expense",
            amount: 1500,
            date: "2026-11-01",
            status: "Success",
        },
        {
            id: 2,
            description: "Monthly Salary",
            category: "Salary",
            type: "Income",
            amount: 30000,
            date: "2026-11-02",
            status: "Success",
        },
        {
            id: 3,
            description: "Electricity Bill",
            category: "Bills",
            type: "Expense",
            amount: 1200,
            date: "2026-11-03",
            status: "Pending",
        },
    ]);

    const addTransaction = (newTransaction) => {
        setTransactions((prev) => [
            {
                ...newTransaction,
                id: Date.now(),
                amount: Number(newTransaction.amount),
            },
            ...prev,
        ]);
    };

    const deleteTransaction = (id) => {
        setTransactions((prev) =>
            prev.filter((transaction) => transaction.id !== id)
        );
    };

    const updateTransaction = (updatedTransaction) => {
        setTransactions((prev) =>
            prev.map((transaction) =>
                transaction.id === updatedTransaction.id
                    ? {
                        ...updatedTransaction,
                        amount: Number(updatedTransaction.amount),
                    }
                    : transaction
            )
        );
    };

    const totalIncome = transactions
        .filter((t) => t.type === "Income")
        .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalExpenses = transactions
        .filter((t) => t.type === "Expense")
        .reduce((sum, t) => sum + Number(t.amount), 0);

    const balance = totalIncome - totalExpenses;

    return (
        <div className="dashboard-layout">
            <aside className="dashboard-sidebar">
                <h2 className="brand">PayGuard AI</h2>

                <p className="sidebar-label">MAIN MENU</p>

                <a className="sidebar-link active" href="#overview">Overview</a>
                <a className="sidebar-link" href="#transactions">Transactions</a>
                <a className="sidebar-link" href="#analytics">Analytics</a>
                <a className="sidebar-link" href="#fraud">Fraud Detection</a>
                <a className="sidebar-link" href="#copilot">AI Copilot</a>

                <div className="sidebar-bottom">
                    <p>Personal Finance</p>
                    <small>PayGuard AI Dashboard</small>
                </div>
            </aside>

            <main className="dashboard-main">
                <header className="dashboard-topbar">
                    <div>
                        <h2>Overview</h2>
                        <p>Manage your finances in one place.</p>
                    </div>

                    <div className="profile-avatar">U</div>
                </header>

                <section className="welcome-section" id="overview">
                    <h1>Welcome to PayGuard AI</h1>
                    <p>Here's an overview of your financial activity.</p>
                </section>

                <section className="summary-grid">
                    <div className="summary-card">
                        <p>Total Balance</p>
                        <h2>₹{balance.toLocaleString("en-IN")}</h2>
                        <span>Income minus expenses</span>
                    </div>

                    <div className="summary-card">
                        <p>Total Income</p>
                        <h2 className="income-text">
                            ₹{totalIncome.toLocaleString("en-IN")}
                        </h2>
                        <span>Total recorded income</span>
                    </div>

                    <div className="summary-card">
                        <p>Total Expenses</p>
                        <h2 className="expense-text">
                            ₹{totalExpenses.toLocaleString("en-IN")}
                        </h2>
                        <span>Total recorded expenses</span>
                    </div>

                    <div className="summary-card">
                        <p>Transactions</p>
                        <h2>{transactions.length}</h2>
                        <span>Total recorded</span>
                    </div>
                </section>

                <section className="transaction-workspace">
                    <div className="workspace-card">
                        <TransactionForm onAddTransaction={addTransaction} />
                    </div>

                    <div className="workspace-card">
                        <ImportTransactions />
                    </div>
                </section>

                <section
                    className="workspace-card transaction-list-card"
                    id="transactions"
                >
                    <TransactionList
                        transactions={transactions}
                        onDeleteTransaction={deleteTransaction}
                        onUpdateTransaction={updateTransaction}
                    />
                </section>
            </main>
        </div>
    );
}

export default Dashboard;