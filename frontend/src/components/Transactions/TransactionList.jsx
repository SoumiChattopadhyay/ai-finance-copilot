import { useState } from "react";
import "./TransactionList.css";

function TransactionList({
    transactions = [],
    onDeleteTransaction,
    onUpdateTransaction,
    isLoading = false,
    error = null,
}) {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All");
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [message, setMessage] = useState({
        type: "",
        text: "",
    });

    const filteredTransactions = transactions.filter((transaction) => {
        const matchesSearch =
            transaction.description.toLowerCase().includes(search.toLowerCase()) ||
            transaction.category.toLowerCase().includes(search.toLowerCase());

        const matchesFilter =
            filter === "All" || transaction.type === filter;

        return matchesSearch && matchesFilter;
    });


    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this transaction?")) {
            return;
        }

        try {
            await onDeleteTransaction(id);

            setMessage({
                type: "success",
                text: "Transaction deleted successfully!",
            });
        } catch (error) {
            setMessage({
                type: "error",
                text: error.message || "Failed to delete transaction.",
            });
        }
    };



    const handleEdit = async (e) => {
        e.preventDefault();

        if (Number(editingTransaction.amount) <= 0) {
            setMessage({
                type: "error",
                text: "Please enter a valid amount.",
            });
            return;
        }

        try {
            await onUpdateTransaction(editingTransaction);

            setEditingTransaction(null);

            setMessage({
                type: "success",
                text: "Transaction updated successfully!",
            });
        } catch (error) {
            setMessage({
                type: "error",
                text: error.message || "Failed to update transaction.",
            });
        }
    };


    return (
        <div className="transaction-page">
            <div className="transaction-header">
                <h2>Transactions</h2>
                <p>View and manage your transactions.</p>
            </div>

            {message.text && (
                <p className={`form-message ${message.type}`}>
                    {message.text}
                </p>
            )}

            <div className="transaction-controls">
                <input
                    className="input"
                    type="text"
                    placeholder="Search transactions..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select
                    className="select"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                >
                    <option value="All">All Transactions</option>
                    <option value="Income">Income</option>
                    <option value="Expense">Expense</option>
                </select>
            </div>

            <div className="transaction-table-container">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Category</th>
                            <th>Merchant</th>
                            <th>Receiver</th>
                            <th>Payment Method</th>
                            <th>Date</th>
                            <th>Type</th>
                            <th>Status</th>
                            <th>Amount</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan="10" className="table-message">
                                    Loading transactions...
                                </td>
                            </tr>
                        ) : error ? (
                            <tr>
                                <td colSpan="10" className="table-message error-text">
                                    {error}
                                </td>
                            </tr>
                        ) : filteredTransactions.length === 0 ? (
                            <tr>
                                <td colSpan="10" className="table-message">
                                    No transactions found. Add a transaction to get started.
                                </td>
                            </tr>
                        ) : (
                            filteredTransactions.map((transaction) => (
                                <tr key={transaction.id}>
                                    <td>{transaction.description}</td>
                                    <td>{transaction.category}</td>
                                    <td>{transaction.merchant || "—"}</td>
                                    <td>{transaction.receiver || "—"}</td>
                                    <td>{transaction.paymentMethod || "—"}</td>
                                    <td>{transaction.date}</td>
                                    <td>
                                        <span className={
                                            transaction.type === "Income"
                                                ? "badge badge-success"
                                                : "badge badge-danger"
                                        }>
                                            {transaction.type}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`status-badge status-${transaction.status?.toLowerCase() || "success"}`}>
                                            {transaction.status || "Success"}
                                        </span>
                                    </td>
                                    <td>₹{Number(transaction.amount).toLocaleString("en-IN")}</td>
                                    <td className="action-buttons">
                                        <button
                                            className="btn btn-secondary"
                                            onClick={() => setSelectedTransaction(transaction)}
                                        >
                                            View
                                        </button>

                                        <button
                                            className="btn btn-primary"
                                            onClick={() => setEditingTransaction({ ...transaction })}
                                        >
                                            Edit
                                        </button>

                                        <button
                                            className="btn btn-danger"
                                            onClick={() => handleDelete(transaction.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {selectedTransaction && (
                <div className="transaction-modal">
                    <div className="transaction-modal-content">
                        <h3>Transaction Details</h3>

                        <p><strong>Description:</strong> {selectedTransaction.description}</p>
                        <p><strong>Category:</strong> {selectedTransaction.category}</p>
                        <p><strong>Merchant:</strong> {selectedTransaction.merchant || "—"}</p>
                        <p><strong>Receiver:</strong> {selectedTransaction.receiver || "—"}</p>
                        <p><strong>Payment Method:</strong> {selectedTransaction.paymentMethod || "—"}</p>
                        <p><strong>Type:</strong> {selectedTransaction.type}</p>
                        <p><strong>Status:</strong> {selectedTransaction.status || "Success"}</p>
                        <p><strong>Amount:</strong> ₹{selectedTransaction.amount}</p>
                        <p><strong>Date:</strong> {selectedTransaction.date}</p>

                        <button
                            className="btn btn-secondary"
                            onClick={() => setSelectedTransaction(null)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {editingTransaction && (
                <div className="transaction-modal">
                    <div className="transaction-modal-content">
                        <h3>Edit Transaction</h3>

                        <form onSubmit={handleEdit}>
                            <label>Description</label>
                            <input
                                className="input"
                                value={editingTransaction.description}
                                onChange={(e) =>
                                    setEditingTransaction({
                                        ...editingTransaction,
                                        description: e.target.value,
                                    })
                                }
                                required
                            />

                            <label>Amount</label>
                            <input
                                className="input"
                                type="number"
                                min="0.01"
                                step="0.01"
                                value={editingTransaction.amount}
                                onChange={(e) =>
                                    setEditingTransaction({
                                        ...editingTransaction,
                                        amount: e.target.value,
                                    })
                                }
                                required
                            />

                            <label>Category</label>
                            <input
                                className="input"
                                value={editingTransaction.category}
                                onChange={(e) =>
                                    setEditingTransaction({
                                        ...editingTransaction,
                                        category: e.target.value,
                                    })
                                }
                                required
                            />

                            <label>Merchant</label>
                            <input
                                className="input"
                                value={editingTransaction.merchant || ""}
                                onChange={(e) =>
                                    setEditingTransaction({
                                        ...editingTransaction,
                                        merchant: e.target.value,
                                    })
                                }
                            />

                            <label>Receiver</label>
                            <input
                                className="input"
                                value={editingTransaction.receiver || ""}
                                onChange={(e) =>
                                    setEditingTransaction({
                                        ...editingTransaction,
                                        receiver: e.target.value,
                                    })
                                }
                            />

                            <label>Payment Method</label>
                            <select
                                className="select"
                                value={editingTransaction.paymentMethod || "UPI"}
                                onChange={(e) =>
                                    setEditingTransaction({
                                        ...editingTransaction,
                                        paymentMethod: e.target.value,
                                    })
                                }
                            >
                                <option value="UPI">UPI</option>
                                <option value="Credit Card">Credit Card</option>
                                <option value="Debit Card">Debit Card</option>
                                <option value="Bank Transfer">Bank Transfer</option>
                                <option value="Net Banking">Net Banking</option>
                                <option value="Cash">Cash</option>
                                <option value="Wallet">Wallet</option>
                            </select>

                            <label>Date</label>
                            <input
                                className="input"
                                type="date"
                                value={editingTransaction.date}
                                onChange={(e) =>
                                    setEditingTransaction({
                                        ...editingTransaction,
                                        date: e.target.value,
                                    })
                                }
                                required
                            />

                            <label>Type</label>
                            <select
                                className="select"
                                value={editingTransaction.type}
                                onChange={(e) =>
                                    setEditingTransaction({
                                        ...editingTransaction,
                                        type: e.target.value,
                                    })
                                }
                            >
                                <option value="Income">Income</option>
                                <option value="Expense">Expense</option>
                            </select>

                            <label>Status</label>
                            <select
                                className="select"
                                value={editingTransaction.status || "Success"}
                                onChange={(e) =>
                                    setEditingTransaction({
                                        ...editingTransaction,
                                        status: e.target.value,
                                    })
                                }
                            >
                                <option value="Success">Success</option>
                                <option value="Pending">Pending</option>
                                <option value="Failed">Failed</option>
                            </select>

                            <div className="modal-actions">
                                <button type="submit" className="btn btn-primary">
                                    Save Changes
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setEditingTransaction(null)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TransactionList;