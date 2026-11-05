
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend
} from "recharts";

import "./IncomeExpenseChart.css";

function IncomeExpenseChart({ transactions = [], isLoading = false }) {

    // Prepare the last six months
    const getMonthlyData = () => {
        const today = new Date();

        const months = [];

        for (let i = 5; i >= 0; i--) {
            const date = new Date(
                today.getFullYear(),
                today.getMonth() - i,
                1
            );

            months.push({
                month: date.toLocaleDateString("en-IN", {
                    month: "short"
                }),
                year: date.getFullYear(),
                monthIndex: date.getMonth(),
                income: 0,
                expenses: 0
            });
        }

        // Include successful transactions only
        transactions.forEach((transaction) => {
            if (transaction.status !== "Success") return;

            const transactionDate = new Date(
                transaction.transactionDateTime || transaction.date
            );

            if (Number.isNaN(transactionDate.getTime())) return;

            const matchingMonth = months.find(
                (month) =>
                    month.monthIndex === transactionDate.getMonth() &&
                    month.year === transactionDate.getFullYear()
            );

            if (!matchingMonth) return;

            const amount = Number(transaction.amount) || 0;

            if (transaction.type === "Income") {
                matchingMonth.income += amount;
            } else if (transaction.type === "Expense") {
                matchingMonth.expenses += amount;
            }
        });

        return months;
    };

    const monthlyData = getMonthlyData();

    const formatCurrency = (value) =>
        `₹${Number(value).toLocaleString("en-IN")}`;

    // Custom tooltip
    const CustomTooltip = ({ active, payload, label }) => {
        if (!active || !payload || !payload.length) return null;

        return (
            <div className="income-expense-tooltip">
                <p className="tooltip-month">{label}</p>

                {payload.map((item) => (
                    <p
                        key={item.dataKey}
                        style={{ color: item.color }}
                    >
                        {item.name}: {formatCurrency(item.value)}
                    </p>
                ))}
            </div>
        );
    };

    return (
        <section className="income-expense-chart-card">
            <div className="chart-header">
                <div>
                    <h2>Income vs Expenses</h2>
                    <p>Monthly comparison of your financial activity.</p>
                </div>

                <span className="chart-period">Last 6 Months</span>
            </div>

            {isLoading ? (
                <div className="chart-message">
                    Loading financial data...
                </div>
            ) : transactions.length === 0 ? (
                <div className="chart-message">
                    No transaction data available.
                    <span>
                        Add transactions to view your monthly comparison.
                    </span>
                </div>
            ) : (
                <div className="income-expense-chart">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={monthlyData}
                            margin={{
                                top: 15,
                                right: 15,
                                left: 10,
                                bottom: 5
                            }}
                            barGap={8}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                vertical={false}
                                stroke="#e8e4ef"
                            />

                            <XAxis
                                dataKey="month"
                                tick={{ fill: "#777087", fontSize: 12 }}
                                axisLine={false}
                                tickLine={false}
                            />

                            <YAxis
                                tickFormatter={formatCurrency}
                                tick={{ fill: "#777087", fontSize: 11 }}
                                axisLine={false}
                                tickLine={false}
                                width={85}
                            />

                            <Tooltip content={<CustomTooltip />} />

                            <Legend />

                            <Bar
                                dataKey="income"
                                name="Income"
                                fill="#7045E8"
                                radius={[5, 5, 0, 0]}
                                maxBarSize={35}
                            />

                            <Bar
                                dataKey="expenses"
                                name="Expenses"
                                fill="#A993FF"
                                radius={[5, 5, 0, 0]}
                                maxBarSize={35}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </section>
    );
}

export default IncomeExpenseChart;
