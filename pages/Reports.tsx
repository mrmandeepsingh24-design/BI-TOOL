import React, { useEffect, useState } from 'react';
import { getWeeklyReportData } from '../services/api';
import { WeeklyReportData, AlertInfo } from '../types';
import Card from '../components/Card';
import Alert from '../components/Alert';
import { TopSellingIcon, LowStockIcon, MoneyIcon, AIInsightsIcon, ReportsIcon } from '../components/Icons';
import { LineChart, Line, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const STOCK_COLORS = ['#16a34a', '#f59e0b', '#ef4444']; // Green, Orange, Red

const Reports: React.FC = () => {
    const [reportData, setReportData] = useState<WeeklyReportData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<AlertInfo | null>(null);
    const [downloading, setDownloading] = useState(false);
    const [downloadMessage, setDownloadMessage] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getWeeklyReportData('this-week');
                setReportData(data);
            } catch (err) {
                console.error("Failed to fetch report data", err);
                setError({ type: 'error', title: 'Report Generation Failed', message: 'Could not generate the weekly report. Please try refreshing the page.' });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleDownloadPdf = () => {
        setDownloading(true);
        setDownloadMessage('');
        setTimeout(() => {
            setDownloading(false);
            setDownloadMessage('Download complete!');
            
            const link = document.createElement('a');
            link.href = 'data:application/pdf;base64,';
            link.download = `PharmaIQ_Weekly_Report_${reportData?.week.replace(/\s/g, '_')}.pdf`;
            link.click();

            setTimeout(() => setDownloadMessage(''), 3000);
        }, 2000);
    };
    
    return (
        <div className="space-y-6">
             {error && <Alert {...error} onClose={() => setError(null)} />}
            {loading ? (
                <div className="text-center py-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
                    <p className="mt-4 text-neutral-600">Generating Your Weekly Report...</p>
                </div>
            ) : !reportData ? (
                 <div className="text-center py-10">Could not load report data.</div>
            ) : (
                <>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-neutral-800">Weekly Business Report</h1>
                            <p className="text-neutral-500 mt-1">{reportData.week}</p>
                        </div>
                        <button 
                            onClick={handleDownloadPdf}
                            disabled={downloading}
                            className="bg-success-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-success-700 transition duration-300 disabled:bg-success-300"
                        >
                            {downloading ? 'Generating PDF...' : 'Download as PDF'}
                        </button>
                    </div>
                    {downloadMessage && <p className="text-center text-success-600 font-medium">{downloadMessage}</p>}

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                         <Card 
                            title="Total Revenue" 
                            value={`₹${reportData.totalRevenue.toLocaleString('en-IN')}`}
                            icon={<MoneyIcon className="w-6 h-6 text-success-500" />} 
                        />
                        <Card 
                            title="Units Sold" 
                            value={reportData.unitsSold.toLocaleString('en-IN')}
                            icon={<ReportsIcon className="w-6 h-6 text-primary-500" />} 
                        />
                         <Card 
                            title="Top Selling Item" 
                            value={reportData.topSeller.name}
                            icon={<TopSellingIcon className="w-6 h-6 text-indigo-500" />} 
                        />
                        <Card 
                            title="New Low Stock Items" 
                            value={reportData.newLowStockItems}
                            icon={<LowStockIcon className="w-6 h-6 text-warning-500" />} 
                        />
                    </div>
                    
                    {/* AI Summary */}
                    <div className="bg-white p-6 rounded-xl shadow-subtle flex items-start gap-4">
                        <div className="flex-shrink-0 p-3 rounded-full bg-primary-100">
                            <AIInsightsIcon className="w-6 h-6 text-primary-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-neutral-700 mb-2">AI-Powered Summary</h2>
                            <p className="text-neutral-600">{reportData.aiSummary}</p>
                        </div>
                    </div>

                    {/* Visualizations */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-xl shadow-subtle">
                             <h2 className="text-xl font-semibold text-neutral-700 mb-4">Daily Sales Trend</h2>
                              <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={reportData.dailySales} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                    <YAxis tickFormatter={(value) => `₹${value/1000}k`} />
                                    <Tooltip formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`} />
                                    <Line type="monotone" dataKey="sales" stroke="#2563eb" strokeWidth={2} name="Sales" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                         <div className="bg-white p-6 rounded-xl shadow-subtle">
                             <h2 className="text-xl font-semibold text-neutral-700 mb-4">Inventory Status</h2>
                             <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie data={reportData.stockStatus} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                        {reportData.stockStatus.map((entry, index) => <Cell key={`cell-${index}`} fill={STOCK_COLORS[index % STOCK_COLORS.length]} />)}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Reports;