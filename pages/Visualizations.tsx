

import React, { useState } from 'react';
import { getVisualizationData } from '../services/api';
import { VisualizationConfig, ChartType, Metric, Dimension, AlertInfo } from '../types';
import { VisualizationsIcon } from '../components/Icons';
import Alert from '../components/Alert';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const COLORS = ['#2563eb', '#16a34a', '#f59e0b', '#dc2626', '#6d28d9', '#db2777', '#0891b2'];

const Visualizations: React.FC = () => {
    const [config, setConfig] = useState<VisualizationConfig>({
        chartType: 'bar',
        metric: 'totalRevenue',
        dimension: 'medicine',
    });
    const [chartData, setChartData] = useState<any[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState<AlertInfo | null>(null);

    const handleGenerateChart = async () => {
        setLoading(true);
        setAlert(null);
        setChartData(null);
        try {
            const response = await getVisualizationData(config);
            if (response.data.length === 0) {
                 setAlert({ type: 'info', title: 'No Data Available', message: 'There is no data matching your selected criteria to display.' });
            }
            setChartData(response.data);
        } catch (err) {
            setAlert({ type: 'error', title: 'Chart Generation Failed', message: 'We failed to generate chart data based on your selections. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    const renderChart = () => {
        if (!chartData || chartData.length === 0) return null;

        const metricKey = config.metric;
        const nameKey = config.dimension === 'time' ? 'name' : 'name';

        switch (config.chartType) {
            case 'bar':
                return (
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={chartData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey={nameKey} tick={{ fontSize: 12 }} />
                            <YAxis tickFormatter={(value) => config.metric === 'totalRevenue' ? `₹${(value / 1000)}k` : value} />
                            <Tooltip formatter={(value: number) => config.metric === 'totalRevenue' ? `₹${value.toLocaleString('en-IN')}` : value.toLocaleString('en-IN')} />
                            <Legend />
                            <Bar dataKey={metricKey} fill="#2563eb" name={metricKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}/>
                        </BarChart>
                    </ResponsiveContainer>
                );
            case 'line':
                 return (
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={chartData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey={nameKey} tick={{ fontSize: 12 }} />
                            <YAxis tickFormatter={(value) => config.metric === 'totalRevenue' ? `₹${(value / 1000)}k` : value} />
                            <Tooltip formatter={(value: number) => config.metric === 'totalRevenue' ? `₹${value.toLocaleString('en-IN')}` : value.toLocaleString('en-IN')} />
                            <Legend />
                            <Line type="monotone" dataKey={metricKey} stroke="#16a34a" strokeWidth={2} name={metricKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}/>
                        </LineChart>
                    </ResponsiveContainer>
                );
            case 'pie':
                 return (
                    <ResponsiveContainer width="100%" height={400}>
                        <PieChart>
                            <Pie data={chartData} dataKey={metricKey} nameKey={nameKey} cx="50%" cy="50%" outerRadius={120} labelLine={false}>
                                {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                            </Pie>
                            <Tooltip formatter={(value: number) => config.metric === 'totalRevenue' ? `₹${value.toLocaleString('en-IN')}` : value.toLocaleString('en-IN')} />
                            <Legend wrapperStyle={{ fontSize: '12px' }}/>
                        </PieChart>
                    </ResponsiveContainer>
                );
            default: return null;
        }
    };

    const isTimeDimensionDisabled = config.metric === 'stock';

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-neutral-800">Visualizations</h1>
            
            <div className="bg-white p-6 rounded-xl shadow-subtle">
                <h2 className="text-xl font-semibold text-neutral-700 mb-4">Chart Builder</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div>
                        <label className="block text-sm font-medium text-neutral-700">Chart Type</label>
                        <select value={config.chartType} onChange={(e) => setConfig({ ...config, chartType: e.target.value as ChartType })} className="mt-1 block w-full p-2 border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500">
                            <option value="bar">Bar Chart</option>
                            <option value="line">Line Chart</option>
                            <option value="pie">Pie Chart</option>
                        </select>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-neutral-700">Metric (Analyze)</label>
                        <select value={config.metric} onChange={(e) => setConfig({ ...config, metric: e.target.value as Metric, dimension: e.target.value === 'stock' ? 'medicine' : config.dimension })} className="mt-1 block w-full p-2 border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500">
                            <option value="totalRevenue">Total Revenue</option>
                            <option value="unitsSold">Units Sold</option>
                            <option value="stock">Current Stock</option>
                        </select>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-neutral-700">Dimension (Group By)</label>
                        <select value={config.dimension} onChange={(e) => setConfig({ ...config, dimension: e.target.value as Dimension })} disabled={isTimeDimensionDisabled} className="mt-1 block w-full p-2 border border-neutral-300 rounded-md disabled:bg-neutral-100 focus:ring-primary-500 focus:border-primary-500">
                            <option value="medicine">By Medicine</option>
                            <option value="time">Over Time</option>
                        </select>
                    </div>
                    <button onClick={handleGenerateChart} disabled={loading} className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-primary-700 transition disabled:bg-primary-300">
                        {loading ? 'Generating...' : 'Generate Chart'}
                    </button>
                </div>
                {isTimeDimensionDisabled && config.dimension === 'time' && <p className="text-xs text-warning-600 mt-1">Time dimension is not available for Current Stock metric.</p>}
            </div>

            {alert && <Alert {...alert} onClose={() => setAlert(null)} />}

            <div className="bg-white p-6 rounded-xl shadow-subtle min-h-[400px] flex items-center justify-center">
                {loading && <div className="text-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto"></div><p className="mt-2 text-neutral-500">Building your chart...</p></div>}
                {!loading && !alert && chartData && renderChart()}
                {!loading && !chartData && !alert && (
                    <div className="text-center text-neutral-500">
                        <VisualizationsIcon className="w-16 h-16 mx-auto text-neutral-300" />
                        <p className="mt-2 font-semibold">Your custom chart will appear here.</p>
                        <p>Configure your preferences above and click "Generate Chart".</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Visualizations;