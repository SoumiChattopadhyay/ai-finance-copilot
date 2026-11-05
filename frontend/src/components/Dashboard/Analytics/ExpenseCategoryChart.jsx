
import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend
} from "recharts";

import "./ExpenseCategoryChart.css";

const CATEGORY_COLORS = [
    "#7045E8",
    "#A993FF",
    "#25874E",
    "#F0A34A",
    "#E05B70",
    "#4596C8",
    "#8B78B8",
    "#56A69B"
];

function ExpenseCategoryChart({
    transactions = [],
    isLoading = false
}) {
    // Calculate expenses category-wise
    const categoryData = transactions
        .filter(
            (transaction) =>
                transaction.type === "Expense" &&
                transaction.status === "Success"
        )
        .reduce((result, transaction) => {
            const category = transaction.category || "Other Expense";
            const amount = Number(transaction.amount) || 0;

            if (amount <= 0) return result;

            const existingCategory = result.find(
                (item) => item.category === category
            );

            if (existingCategory) {
                existingCategory.amount += amount;
            } else {
                result.push({
                    category,
                    amount
                });
            }

            return result;
        }, []);

    const totalExpenses = categoryData.reduce(
        (sum, item) => sum + item.amount,
        0
    );

    const formatCurrency = (value) =>
        `₹${Number(value).toLocaleString("en-IN", {
            maximumFractionDigits: 2
        })}`;

    const CustomTooltip = ({ active, payload }) => {
        if (!active || !payload || !payload.length) {
            return null;
        }

        const item = payload[0].payload;

        const percentage =
            totalExpenses > 0
                ? ((item.amount / totalExpenses) * 100).toFixed(1)
                : 0;

        return (
            <div className="expense-chart-tooltip">
                <strong>{item.category}</strong>
                <p>{formatCurrency(item.amount)}</p>
                <span>{percentage}% of total expenses</span>
            </div>
        );
    };

    return (
        <section className="expense-category-card">

            <div className="expense-category-header">
                <div>
                    <h2>Expense Breakdown</h2>
                    <p>Understand where your money is going.</p>
                </div>
            </div>

            {isLoading ? (
                <div className="expense-chart-message">
                    Loading expense data...
                </div>
            ) : categoryData.length === 0 ? (
                <div className="expense-chart-message">
                    No expense data available.
                    <span>
                        Add successful expense transactions to view
                        your category breakdown.
                    </span>
                </div>
            ) : (
                <div className="expense-chart-content">

                    <div className="expense-donut-wrapper">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    dataKey="amount"
                                    nameKey="category"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius="58%"
                                    outerRadius="82%"
                                    paddingAngle={3}
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell
                                            key={entry.category}
                                            fill={
                                                CATEGORY_COLORS[
                                                    index % CATEGORY_COLORS.length
                                                ]
                                            }
                                        />
                                    ))}
                                </Pie>

                                <Tooltip content={<CustomTooltip />} />

                                <Legend
                                    verticalAlign="bottom"
                                    align="center"
                                    iconType="circle"
                                />
                            </PieChart>
                        </ResponsiveContainer>

                        <div className="expense-donut-center">
                            <span>Total Expenses</span>
                            <strong>{formatCurrency(totalExpenses)}</strong>
                        </div>
                    </div>

                </div>
            )}

        </section>
    );
}

export default ExpenseCategoryChart;
