import React, { useEffect, useState, useMemo } from 'react';
import { getTopSelling } from '../services/api';
import { SalesRecord, AlertInfo } from '../types';
import Alert from '../components/Alert';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#2563eb', '#16a34a', '#f59e0b', '#dc2626', '#6d28d9'];

const TopSelling: React.FC = () => {
    const [sales, setSales] = useState<SalesRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<AlertInfo | null>(null);
    const [timePeriod, setTimePeriod] = useState('30days');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getTopSelling(timePeriod);
                setSales(data.sales);
            } catch (err) {
                console.error("Failed to fetch top selling data", err);
                setError({ type: 'error', title: 'Error Loading Data', message: 'Could not fetch top selling medicines data. Please try again later.'});
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [timePeriod]);

    const pieChartData = useMemo(() => {
        return sales.slice(0, 5).map(item => ({ name: item.name, value: item.totalRevenue }));
    }, [sales]);

    const exportToCSV = () => {
        const headers = ['Rank', 'Medicine Name', 'Units Sold', 'Total Revenue (₹)'];
        const rows = sales.map((item, index) => [
            index + 1,
            `"${item.name.replace(/"/g, '""')}"`,
            item.unitsSold,
            item.totalRevenue.toFixed(2)
        ]);
        
        let csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "top_selling_medicines.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <h1 className="text-3xl font-bold text-neutral-800">Top Selling Medicines</h1>
                <div className="flex items-center gap-4">
                    <select
                        value={timePeriod}
                        onChange={(e) => setTimePeriod(e.target.value)}
                        className="p-2 border border-neutral-300 rounded-md text-sm sm:text-base focus:ring-primary-500 focus:border-primary-500"
                    >
                        <option value="7days">Last 7 days</option>
                        <option value="30days">Last 30 days</option>
                        <option value="custom">Custom</option>
                    </select>
                     <button onClick={exportToCSV} className="bg-success-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-success-700 transition duration-300 text-sm sm:text-base">
                        Export CSV
                    </button>
                </div>
            </div>

            {error && <Alert {...error} onClose={() => setError(null)} />}
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3 bg-white rounded-xl shadow-subtle overflow-hidden">
                    <h2 className="text-xl font-semibold text-neutral-700 p-6">Sales Ranking</h2>
                    <div className="overflow-x-auto">
                    <table className="min-w-full text-sm text-left text-neutral-500">
                        <thead className="text-xs text-neutral-500 uppercase bg-neutral-50 tracking-wider">
                            <tr>
                                <th scope="col" className="px-6 py-3">Rank</th>
                                <th scope="col" className="px-6 py-3">Medicine Name</th>
                                <th scope="col" className="px-6 py-3 text-right">Units Sold</th>
                                <th scope="col" className="px-6 py-3 text-right">Total Revenue</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200">
                            {loading ? (
                                <tr><td colSpan={4} className="text-center py-8 text-neutral-500">Loading...</td></tr>
                            ) : sales.length > 0 ? (
                                sales.map((item, index) => (
                                <tr key={item.id} className="hover:bg-neutral-50">
                                    <td className="px-6 py-4 font-bold text-neutral-700">{index + 1}</td>
                                    <td className="px-6 py-4 font-medium text-neutral-900 whitespace-nowrap">{item.name}</td>
                                    <td className="px-6 py-4 text-right">{item.unitsSold.toLocaleString('en-IN')}</td>
                                    <td className="px-6 py-4 text-right font-semibold text-success-600">₹{item.totalRevenue.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                                </tr>
                                ))
                            ) : (
                                <tr><td colSpan={4} className="text-center py-8 text-neutral-500">No sales data available.</td></tr>
                            )}
                        </tbody>
                    </table>
                    </div>
                </div>

                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-subtle">
                     <h2 className="text-xl font-semibold text-neutral-700 mb-4">Top 5 by Revenue</h2>
                     <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={pieChartData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {pieChartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                             <Tooltip formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`} />
                            <Legend wrapperStyle={{ fontSize: '12px' }}/>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default TopSelling;