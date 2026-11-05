
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { transactionAPI } from "../../services/api";

import TransactionList from "../Transactions/TransactionList";
import TransactionForm from "../Transactions/TransactionForm";
import ImportTransactions from "../Transactions/ImportTransactions";

import FinancialSummary from "./Analytics/FinancialSummary";

import IncomeExpenseChart from "./Analytics/IncomeExpenseChart";

import ExpenseCategoryChart from "./Analytics/ExpenseCategoryChart";

import MonthlyTrendChart from "./Analytics/MonthlyTrendChart";

import "./Dashboard.css";

function Dashboard() {
    const navigate = useNavigate();

    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    // Format transaction data received from backend
    const formatTransaction = (t) => ({
        ...t,
        id: t._id,
        category: t.category.subcategory,
        type: t.category.type === "Income" ? "Income" : "Expense",
        date: new Date(t.transactionDateTime)
            .toISOString()
            .slice(0, 10),
        status: t.transactionStatus,
    });

    // Logout
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login", { replace: true });
    };

    // Fetch transactions from backend
    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                setIsLoading(true);
                setError("");

                const response = await transactionAPI.getAll();

                const formattedTransactions = response.data.map(
                    formatTransaction
                );

                setTransactions(formattedTransactions);
            } catch (err) {
                setError(
                    err.message || "Failed to fetch transactions."
                );
            } finally {
                setIsLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    // Add transaction
    const addTransaction = async (newTransaction) => {
        const response = await transactionAPI.create(newTransaction);

        const formattedTransaction = formatTransaction(response.data);

        setTransactions((prev) => [
            formattedTransaction,
            ...prev,
        ]);
    };

    // Delete transaction
    const deleteTransaction = async (id) => {
        await transactionAPI.delete(id);

        setTransactions((prev) =>
            prev.filter((transaction) => transaction.id !== id)
        );
    };

    // Update transaction
    const updateTransaction = async (updatedTransaction) => {
        const payload = {
            amount: Number(updatedTransaction.amount),

            type:
                updatedTransaction.type === "Income"
                    ? "Credit"
                    : "Debit",

            category: {
                type:
                    updatedTransaction.type === "Income"
                        ? "Income"
                        : "Expenses",

                subcategory: updatedTransaction.category,
            },

            paymentMethod: updatedTransaction.paymentMethod,

            transactionDateTime: new Date(
                `${updatedTransaction.date}T12:00:00`
            ).toISOString(),

            transactionStatus: updatedTransaction.status,
            description: updatedTransaction.description,
            merchant: updatedTransaction.merchant || "",
            receiver: updatedTransaction.receiver || "",
        };

        const response = await transactionAPI.update(
            updatedTransaction.id,
            payload
        );

        const formattedTransaction = formatTransaction(response.data);

        setTransactions((prev) =>
            prev.map((transaction) =>
                transaction.id === updatedTransaction.id
                    ? formattedTransaction
                    : transaction
            )
        );
    };

    // Calculate financial summary
    const totalIncome = transactions
        .filter((t) => t.type === "Income")
        .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalExpenses = transactions
        .filter((t) => t.type === "Expense")
        .reduce((sum, t) => sum + Number(t.amount), 0);

    const balance = totalIncome - totalExpenses;

    // Upload CSV transactions
    const uploadTransactions = async (file) => {
        const response = await transactionAPI.uploadCSV(file);

        const transactionsResponse = await transactionAPI.getAll();

        const formattedTransactions = transactionsResponse.data.map(
            formatTransaction
        );

        setTransactions(formattedTransactions);

        return response;
    };

    return (
        <div className="dashboard-layout">

            {/* Sidebar */}
            <aside className="dashboard-sidebar">
                <h2 className="brand">PayGuard AI</h2>

                <p className="sidebar-label">MAIN MENU</p>

                <a className="sidebar-link active" href="#overview">
                    Overview
                </a>

                <a className="sidebar-link" href="#transactions">
                    Transactions
                </a>

                <a className="sidebar-link" href="#analytics">
                    Analytics
                </a>

                <a className="sidebar-link" href="#fraud">
                    Fraud Detection
                </a>

                <a className="sidebar-link" href="#copilot">
                    AI Copilot
                </a>

                <div className="sidebar-bottom">
                    <p>Personal Finance</p>
                    <small>PayGuard AI Dashboard</small>
                </div>
            </aside>

            {/* Main Dashboard */}
            <main className="dashboard-main">

                {/* Top Navigation */}
                <header className="dashboard-topbar">
                    <div>
                        <h2>Overview</h2>
                        <p>Manage your finances in one place.</p>
                    </div>

                    <div className="dashboard-user-actions">
                        <div className="profile-avatar">U</div>

                        <button
                            type="button"
                            className="logout-button"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </div>
                </header>

                {/* Welcome Section */}
                <section className="welcome-section" id="overview">
                    <h1>Welcome to PayGuard AI</h1>

                    <p>
                        Here's an overview of your financial activity.
                    </p>
                </section>

                {/* Financial Summary Cards */}
                <FinancialSummary
                    totalBalance={balance}
                    totalIncome={totalIncome}
                    totalExpenses={totalExpenses}
                    totalTransactions={transactions.length}
                />

                {/* Financial Analytics */}
                    <section className="financial-analytics-grid" id="analytics">

                        <IncomeExpenseChart
                            transactions={transactions}
                            isLoading={isLoading}
                        />

                        <ExpenseCategoryChart
                            transactions={transactions}
                            isLoading={isLoading}
                        />

                    </section>
                    {/* Monthly Financial Trends */}
                        <MonthlyTrendChart
                            transactions={transactions}
                            isLoading={isLoading}
                        />

                {/* Transaction Management */}
                <section className="transaction-workspace">

                    <div className="workspace-card">
                        <TransactionForm
                            onAddTransaction={addTransaction}
                        />
                    </div>

                    <div className="workspace-card">
                        <ImportTransactions
                            onUpload={uploadTransactions}
                        />
                    </div>

                </section>

                {/* Transaction List */}
                <section
                    className="workspace-card transaction-list-card"
                    id="transactions"
                >
                    <TransactionList
                        transactions={transactions}
                        onDeleteTransaction={deleteTransaction}
                        onUpdateTransaction={updateTransaction}
                        isLoading={isLoading}
                        error={error}
                    />
                </section>

            </main>
        </div>
    );
}

export default Dashboard;
