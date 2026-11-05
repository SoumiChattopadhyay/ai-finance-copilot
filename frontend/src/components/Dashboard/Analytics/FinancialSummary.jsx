
import "./FinancialSummary.css";

function FinancialSummary({
    totalBalance,
    totalIncome,
    totalExpenses,
    totalTransactions
}) {
    const formatCurrency = (amount) => {
        return `₹${Number(amount || 0).toLocaleString("en-IN", {
            maximumFractionDigits: 2
        })}`;
    };

    const summaryItems = [
        {
            title: "Total Balance",
            value: formatCurrency(totalBalance),
            description: "Income minus expenses",
            className: "balance"
        },
        {
            title: "Total Income",
            value: formatCurrency(totalIncome),
            description: "Total recorded income",
            className: "income"
        },
        {
            title: "Total Expenses",
            value: formatCurrency(totalExpenses),
            description: "Total recorded expenses",
            className: "expenses"
        },
        {
            title: "Transactions",
            value: Number(totalTransactions || 0).toLocaleString("en-IN"),
            description: "Total recorded transactions",
            className: "transactions"
        }
    ];

    return (
        <section className="financial-summary-grid">
            {summaryItems.map((item) => (
                <div
                    className={`financial-summary-card ${item.className}`}
                    key={item.title}
                >
                    <p className="summary-title">{item.title}</p>

                    <h2 className="summary-value">{item.value}</h2>

                    <span className="summary-description">
                        {item.description}
                    </span>
                </div>
            ))}
        </section>
    );
}

export default FinancialSummary;
