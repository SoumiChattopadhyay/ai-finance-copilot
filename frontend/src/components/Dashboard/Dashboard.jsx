import { useState, useEffect } from "react";
import { transactionAPI } from "../../services/api";

import TransactionList from "../Transactions/TransactionList";
import TransactionForm from "../Transactions/TransactionForm";
import ImportTransactions from "../Transactions/ImportTransactions";

import "./Dashboard.css";

function Dashboard() {
    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                setIsLoading(true);
                setError("");

                const response = await transactionAPI.getAll();

                const formattedTransactions = response.data.map((t) => ({
                    ...t,
                    id: t._id,
                    category: t.category.subcategory,
                    type: t.category.type === "Income" ? "Income" : "Expense",
                    date: new Date(t.transactionDateTime)
                        .toISOString()
                        .slice(0, 10),
                    status: t.transactionStatus,
                }));

                setTransactions(formattedTransactions);
            } catch (err) {
                setError(err.message || "Failed to fetch transactions.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchTransactions();
    }, []);


    const addTransaction = async (newTransaction) => {
        const response = await transactionAPI.create(newTransaction);

        const t = response.data;

        const formattedTransaction = {
            ...t,
            id: t._id,
            category: t.category.subcategory,
            type: t.category.type === "Income" ? "Income" : "Expense",
            date: new Date(t.transactionDateTime).toISOString().slice(0, 10),
            status: t.transactionStatus,
        };

        setTransactions((prev) => [formattedTransaction, ...prev]);
    };



    const deleteTransaction = async (id) => {
        await transactionAPI.delete(id);

        setTransactions((prev) =>
            prev.filter((transaction) => transaction.id !== id)
        );
    };

    const updateTransaction = async (updatedTransaction) => {
        const payload = {
            amount: Number(updatedTransaction.amount),
            type: updatedTransaction.type === "Income" ? "Credit" : "Debit",
            category: {
                type: updatedTransaction.type === "Income" ? "Income" : "Expenses",
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

        const t = response.data;

        const formattedTransaction = {
            ...t,
            id: t._id,
            category: t.category.subcategory,
            type: t.category.type === "Income" ? "Income" : "Expense",
            date: new Date(t.transactionDateTime).toISOString().slice(0, 10),
            status: t.transactionStatus,
        };

        setTransactions((prev) =>
            prev.map((transaction) =>
                transaction.id === updatedTransaction.id
                    ? formattedTransaction
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


    const uploadTransactions = async (file) => {
        const response = await transactionAPI.uploadCSV(file);

        const transactionsResponse = await transactionAPI.getAll();

        const formattedTransactions = transactionsResponse.data.map((t) => ({
            ...t,
            id: t._id,
            category: t.category.subcategory,
            type: t.category.type === "Income" ? "Income" : "Expense",
            date: new Date(t.transactionDateTime).toISOString().slice(0, 10),
            status: t.transactionStatus,
        }));

        setTransactions(formattedTransactions);

        return response;
    };


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
                        <ImportTransactions onUpload={uploadTransactions} />
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
                        isLoading={isLoading}
                        error={error}
                    />
                </section>
            </main>
        </div>
    );
}

export default Dashboard;