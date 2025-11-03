import React, { useEffect, useState } from 'react';
import { getROIDetails } from '../services/api';
import { ROIDetails, AlertInfo } from '../types';
import { MoneyIcon, CalendarIcon } from '../components/Icons';
import Alert from '../components/Alert';

const ROITracker: React.FC = () => {
    const [details, setDetails] = useState<ROIDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<AlertInfo | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getROIDetails();
                setDetails(data);
            } catch (err) {
                console.error("Failed to fetch ROI details", err);
                setError({ type: 'error', title: 'Data Load Failed', message: "We couldn't load your ROI and savings details. Please refresh the page." });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const formatCurrency = (value: number) => `₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-neutral-800">ROI & Savings Tracker</h1>
                <p className="text-neutral-500 mt-1">A detailed breakdown of how PharmaIQ saves you money.</p>
            </div>

            {error && <Alert {...error} onClose={() => setError(null)} />}

            {loading && <div className="text-center py-10 text-neutral-500">Loading ROI Details...</div>}

            {!loading && !details && !error && <div className="text-center py-10 text-neutral-500">Could not load ROI data.</div>}

            {details && (
                <>
                    {/* Total Savings Card */}
                    <div className="bg-white p-6 rounded-xl shadow-subtle text-center">
                        <p className="text-lg font-medium text-neutral-600">Total Potential Monthly Savings</p>
                        <p className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-success-500 to-green-600 my-2">{formatCurrency(details.totalSavings)}</p>
                        <p className="text-neutral-500 text-sm">This is an estimate based on your current inventory and sales data.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Reduced Expiry Waste */}
                        <div className="bg-white p-6 rounded-xl shadow-subtle">
                            <div className="flex items-center mb-4">
                                <div className="p-3 rounded-full bg-warning-100 mr-4">
                                    <CalendarIcon className="w-8 h-8 text-warning-600" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold text-neutral-700">Reduced Expiry Waste</h2>
                                    <p className="text-2xl font-bold text-warning-600">{formatCurrency(details.expiryWaste)}</p>
                                </div>
                            </div>
                            <p className="text-sm text-neutral-500 mb-4">Value of stock expiring in the next two months. PharmaIQ helps you manage this stock before it becomes a loss.</p>
                            <div className="overflow-x-auto border rounded-md">
                                <table className="min-w-full text-sm">
                                    <thead className="bg-neutral-50 text-left">
                                        <tr>
                                            <th className="px-4 py-2 font-medium text-neutral-600">Medicine</th>
                                            <th className="px-4 py-2 font-medium text-neutral-600">Stock</th>
                                            <th className="px-4 py-2 font-medium text-neutral-600">Expiry</th>
                                            <th className="px-4 py-2 font-medium text-neutral-600 text-right">Value</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-200">
                                        {details.expiringSoon.map(item => (
                                            <tr key={item.id} className="hover:bg-neutral-50">
                                                <td className="px-4 py-2 font-medium text-neutral-800">{item.name}</td>
                                                <td className="px-4 py-2">{item.stock}</td>
                                                <td className="px-4 py-2">{new Date(item.expiry).toLocaleDateString('en-GB')}</td>
                                                <td className="px-4 py-2 text-right">{formatCurrency(item.stock * (item.price || 0))}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Prevented Lost Sales */}
                        <div className="bg-white p-6 rounded-xl shadow-subtle">
                             <div className="flex items-center mb-4">
                                <div className="p-3 rounded-full bg-danger-100 mr-4">
                                    <MoneyIcon className="w-8 h-8 text-danger-600" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold text-neutral-700">Prevented Lost Sales</h2>
                                     <p className="text-2xl font-bold text-danger-600">{formatCurrency(details.lostSales)}</p>
                                </div>
                            </div>
                            <p className="text-sm text-neutral-500 mb-4">Potential revenue missed from out-of-stock items. Low stock alerts help you reorder in time.</p>
                            <div className="overflow-x-auto border rounded-md">
                                 <table className="min-w-full text-sm">
                                    <thead className="bg-neutral-50 text-left">
                                        <tr>
                                            <th className="px-4 py-2 font-medium text-neutral-600">Medicine</th>
                                            <th className="px-4 py-2 font-medium text-neutral-600 text-right">Potential Lost Revenue</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-200">
                                        {details.outOfStock.map(item => (
                                            <tr key={item.id} className="hover:bg-neutral-50">
                                                <td className="px-4 py-2 font-medium text-neutral-800">{item.name}</td>
                                                <td className="px-4 py-2 text-right">{formatCurrency(item.potentialLostRevenue)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default ROITracker;