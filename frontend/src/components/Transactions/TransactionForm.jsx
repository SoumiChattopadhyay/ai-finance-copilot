import { useState } from "react";
import "./TransactionForm.css";

function TransactionForm({ onAddTransaction }) {
    const [formData, setFormData] = useState({
        amount: "",
        type: "Expense",
        category: "",
        date: "",
        description: "",
        status: "Success",
    });

    const [message, setMessage] = useState({
        type: "",
        text: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (Number(formData.amount) <= 0) {
            setMessage({
                type: "error",
                text: "Please enter a valid amount.",
            });
            return;
        }

        try {
            onAddTransaction(formData);

            setMessage({
                type: "success",
                text: "Transaction added successfully!",
            });

            setFormData({
                amount: "",
                type: "Expense",
                category: "",
                date: "",
                description: "",
                status: "Success",
            });
        } catch (error) {
            setMessage({
                type: "error",
                text: "Failed to add transaction. Please try again.",
            });
        }
    };

    return (
        <div className="transaction-form-container">
            <h2>Add Transaction</h2>

            <form onSubmit={handleSubmit}>
                <div className="transaction-form-group">
                    <label>Amount (₹)</label>
                    <input
                        className="input"
                        type="number"
                        name="amount"
                        placeholder="Enter amount"
                        value={formData.amount}
                        onChange={handleChange}
                        min="0.01"
                        step="0.01"
                        required
                    />
                </div>

                <div className="transaction-form-group">
                    <label>Transaction Type</label>
                    <select
                        className="select"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                    >
                        <option value="Expense">Expense</option>
                        <option value="Income">Income</option>
                    </select>
                </div>

                <div className="transaction-form-group">
                    <label>Transaction Status</label>
                    <select
                        className="select"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                    >
                        <option value="Success">Success</option>
                        <option value="Pending">Pending</option>
                        <option value="Failed">Failed</option>
                    </select>
                </div>

                <div className="transaction-form-group">
                    <label>Category</label>
                    <input
                        className="input"
                        type="text"
                        name="category"
                        placeholder="e.g. Food, Travel, Salary"
                        value={formData.category}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="transaction-form-group">
                    <label>Date</label>
                    <input
                        className="input"
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="transaction-form-group">
                    <label>Description</label>
                    <textarea
                        className="textarea"
                        name="description"
                        placeholder="Enter transaction details"
                        value={formData.description}
                        onChange={handleChange}
                        rows="3"
                        required
                    />
                </div>

                <button type="submit" className="btn btn-primary">
                    Add Transaction
                </button>

                {message.text && (
                    <p className={`form-message ${message.type}`}>
                        {message.text}
                    </p>
                )}
            </form>
        </div>
    );
}

export default TransactionForm;