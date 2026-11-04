
import { useState } from "react";
import "./TransactionForm.css";

const incomeCategories = [
    "Salary", "Freelance", "Business", "Investment", "Other Income"
];

const expenseCategories = [
    "Food", "Groceries", "Shopping", "Rent", "Bills", "Utilities",
    "Travel", "Entertainment", "Healthcare", "Education",
    "Subscription", "Transfer", "Other Expense"
];

function TransactionForm({ onAddTransaction }) {
    const [formData, setFormData] = useState({
        amount: "",
        type: "Expense",
        category: "",
        paymentMethod: "UPI",
        date: "",
        description: "",
        merchant: "",
        receiver: "",
        status: "Success",
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    const availableCategories =
        formData.type === "Income" ? incomeCategories : expenseCategories;

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
            ...(name === "type" ? { category: "" } : {}),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: "", text: "" });

        if (!formData.category || !formData.date) {
            setMessage({
                type: "error",
                text: "Please complete all required fields.",
            });
            return;
        }

        const payload = {
            amount: Number(formData.amount),
            type: formData.type === "Income" ? "Credit" : "Debit",
            category: {
                type: formData.type === "Income" ? "Income" : "Expenses",
                subcategory: formData.category,
            },
            paymentMethod: formData.paymentMethod,
            transactionDateTime: new Date(
                `${formData.date}T12:00:00`
            ).toISOString(),
            transactionStatus: formData.status,
            description: formData.description.trim(),
            merchant: formData.merchant.trim(),
            receiver: formData.receiver.trim(),
        };

        try {
            setLoading(true);

            await onAddTransaction(payload);

            setMessage({
                type: "success",
                text: "Transaction added successfully!",
            });

            setFormData({
                amount: "",
                type: "Expense",
                category: "",
                paymentMethod: "UPI",
                date: "",
                description: "",
                merchant: "",
                receiver: "",
                status: "Success",
            });
        } catch (error) {
            setMessage({
                type: "error",
                text: error.message || "Failed to add transaction.",
            });
        } finally {
            setLoading(false);
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
                    <label>Category</label>
                    <select
                        className="select"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select category</option>
                        {availableCategories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="transaction-form-group">
                    <label>Payment Method</label>
                    <select
                        className="select"
                        name="paymentMethod"
                        value={formData.paymentMethod}
                        onChange={handleChange}
                    >
                        {[
                            "UPI", "Credit Card", "Debit Card",
                            "Bank Transfer", "Net Banking", "Cash", "Wallet"
                        ].map((method) => (
                            <option key={method} value={method}>
                                {method}
                            </option>
                        ))}
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
                        {["Success", "Pending", "Failed", "Cancelled", "Refunded"].map(
                            (status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            )
                        )}
                    </select>
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
                    <label>Merchant (Optional)</label>
                    <input
                        className="input"
                        type="text"
                        name="merchant"
                        placeholder="e.g. Amazon"
                        value={formData.merchant}
                        onChange={handleChange}
                    />
                </div>

                <div className="transaction-form-group">
                    <label>Receiver (Optional)</label>
                    <input
                        className="input"
                        type="text"
                        name="receiver"
                        placeholder="e.g. Rahul"
                        value={formData.receiver}
                        onChange={handleChange}
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

                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                >
                    {loading ? "Adding..." : "Add Transaction"}
                </button>

                {message.text && (
                    <p className={`form-message ${message.type}`} role="status">
                        {message.text}
                    </p>
                )}
            </form>
        </div>
    );
}

export default TransactionForm;
