
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend
} from "recharts";

import "./MonthlyTrendChart.css";

function MonthlyTrendChart({
    transactions = [],
    isLoading = false
}) {
    // Prepare monthly financial data for the last 6 months
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

    const hasChartData = transactions.some(
        (transaction) =>
            transaction.status === "Success" &&
            ["Income", "Expense"].includes(transaction.type) &&
            Number(transaction.amount) > 0 &&
            !Number.isNaN(
                new Date(
                    transaction.transactionDateTime || transaction.date
                ).getTime()
            )
    );

    const formatCurrency = (value) =>
        `₹${Number(value).toLocaleString("en-IN")}`;

    // Custom tooltip
    const CustomTooltip = ({ active, payload, label }) => {
        if (!active || !payload || !payload.length) {
            return null;
        }

        return (
            <div className="monthly-trend-tooltip">
                <strong>{label}</strong>

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
        <section className="monthly-trend-card">

            <div className="monthly-trend-header">
                <div>
                    <h2>Monthly Financial Trends</h2>
                    <p>Track how your income and expenses change over time.</p>
                </div>

                <span className="monthly-trend-period">
                    Last 6 Months
                </span>
            </div>

            {isLoading ? (
                <div className="monthly-trend-message">
                    Loading financial data...
                </div>
            ) : !hasChartData ? (
                <div className="monthly-trend-message">
                    No financial trend data available.
                    <span>
                        Add successful transactions to view your monthly trends.
                    </span>
                </div>
            ) : (
                <div className="monthly-trend-chart">

                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={monthlyData}
                            margin={{
                                top: 15,
                                right: 20,
                                left: 10,
                                bottom: 5
                            }}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                vertical={false}
                                stroke="#e8e4ef"
                            />

                            <XAxis
                                dataKey="month"
                                tick={{
                                    fill: "#777087",
                                    fontSize: 12
                                }}
                                axisLine={false}
                                tickLine={false}
                            />

                            <YAxis
                                tickFormatter={formatCurrency}
                                tick={{
                                    fill: "#777087",
                                    fontSize: 11
                                }}
                                axisLine={false}
                                tickLine={false}
                                width={85}
                            />

                            <Tooltip content={<CustomTooltip />} />

                            <Legend />

                            <Line
                                type="monotone"
                                dataKey="income"
                                name="Income"
                                stroke="#7045E8"
                                strokeWidth={3}
                                dot={{
                                    r: 4,
                                    fill: "#7045E8"
                                }}
                                activeDot={{ r: 7 }}
                            />

                            <Line
                                type="monotone"
                                dataKey="expenses"
                                name="Expenses"
                                stroke="#E05B70"
                                strokeWidth={3}
                                dot={{
                                    r: 4,
                                    fill: "#E05B70"
                                }}
                                activeDot={{ r: 7 }}
                            />

                        </LineChart>
                    </ResponsiveContainer>

                </div>
            )}

        </section>
    );
}

export default MonthlyTrendChart;
