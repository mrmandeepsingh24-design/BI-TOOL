
import React, { useEffect, useState } from 'react';
import { Page, ROIData, BusinessAdvice, AlertInfo } from '../types';
import { getROICalculation, getBusinessAdvice } from '../services/api';
import Card from '../components/Card';
import Alert from '../components/Alert';
import { LowStockIcon, TopSellingIcon, UploadIcon, AIInsightsIcon, MoneyIcon, CalendarIcon } from '../components/Icons';

interface DashboardProps {
    onNavigate: (page: Page) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
    const [roiData, setRoiData] = useState<ROIData | null>(null);
    const [advice, setAdvice] = useState<BusinessAdvice[]>([]);
    const [loading, setLoading] = useState({ roi: true, advice: true });
    const [error, setError] = useState<AlertInfo | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setError(null);
                setLoading(prev => ({ ...prev, roi: true, advice: true }));
                const [roi, adviceData] = await Promise.all([
                    getROICalculation(),
                    getBusinessAdvice()
                ]);
                setRoiData(roi);
                setAdvice(adviceData.advice);
            } catch (err) {
                console.error("Failed to fetch dashboard data", err);
                setError({ type: 'error', title: 'Data Load Failed', message: "We couldn't load your dashboard data. Please try refreshing the page." });
            } finally {
                setLoading({ roi: false, advice: false });
            }
        };
        fetchData();
    }, []);

    const getCategoryStyle = (category: BusinessAdvice['category']) => {
        switch (category) {
            case 'Inventory': return { bg: 'bg-warning-50', text: 'text-warning-600', iconBg: 'bg-warning-100' };
            case 'Sales': return { bg: 'bg-success-50', text: 'text-success-600', iconBg: 'bg-success-100' };
            case 'Strategy': return { bg: 'bg-primary-50', text: 'text-primary-600', iconBg: 'bg-primary-100' };
            default: return { bg: 'bg-neutral-50', text: 'text-neutral-600', iconBg: 'bg-neutral-100' };
        }
    };

    return (
        <div className="space-y-8">
            {error && <Alert {...error} onClose={() => setError(null)} />}
            <div>
                <h1 className="text-3xl font-bold text-neutral-800">Dashboard</h1>
                <p className="text-neutral-500 mt-1">An overview of your pharmacy's performance.</p>
            </div>

            {/* Quick Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card 
                    title="Low Stock Items" 
                    value="4" 
                    icon={<LowStockIcon className="w-6 h-6 text-warning-500" />}
                    change="+1"
                    changeType="negative"
                />
                <Card 
                    title="Out of Stock Items" 
                    value="2" 
                    icon={<LowStockIcon className="w-6 h-6 text-danger-500" />}
                    change="-1"
                    changeType="positive"
                />
                 <Card 
                    title="Top Selling Item" 
                    value="Paracetamol" 
                    icon={<TopSellingIcon className="w-6 h-6 text-success-500" />} 
                />
                <Card 
                    title="Inventory Value" 
                    value="₹1.25L" 
                    icon={<MoneyIcon className="w-6 h-6 text-primary-500" />}
                    change="+2.5%"
                    changeType="positive"
                />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* ROI & Savings Snapshot */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-subtle">
                    <h2 className="text-xl font-semibold text-neutral-700 mb-4">ROI & Savings Snapshot</h2>
                    {loading.roi ? (
                        <div className="text-center py-8 text-neutral-500">Loading Savings Data...</div>
                    ) : roiData ? (
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="text-center md:text-left">
                                <p className="text-neutral-500">Potential Monthly Savings with PharmaIQ</p>
                                <p className="text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-success-500 to-green-600 my-2">
                                    ₹{roiData.totalSavings.toLocaleString('en-IN')}
                                </p>
                                <div className="flex justify-center md:justify-start gap-4 text-sm mt-2">
                                    <span className="flex items-center text-neutral-600"><CalendarIcon className="w-4 h-4 mr-1.5 text-warning-500" />Expiry Waste: ₹{roiData.expiryWaste.toLocaleString('en-IN')}</span>
                                    <span className="flex items-center text-neutral-600"><MoneyIcon className="w-4 h-4 mr-1.5 text-danger-500" />Lost Sales: ₹{roiData.lostSales.toLocaleString('en-IN')}</span>
                                </div>
                            </div>
                            <button onClick={() => onNavigate(Page.ROITracker)} className="bg-primary-600 text-white py-2.5 px-6 rounded-lg font-semibold hover:bg-primary-700 transition duration-300 shadow-sm hover:shadow-md">
                                View Detailed Report
                            </button>
                        </div>
                    ) : (
                        !error && <div className="text-center py-8 text-neutral-500">Could not load savings data.</div>
                    )}
                </div>
                 {/* Quick Actions */}
                 <div className="bg-white p-6 rounded-xl shadow-subtle">
                    <h2 className="text-xl font-semibold text-neutral-700 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <ActionButton 
                            title="Low Stock"
                            icon={<LowStockIcon className="w-7 h-7 mx-auto text-primary-600" />}
                            onClick={() => onNavigate(Page.LowStock)}
                        />
                        <ActionButton 
                            title="Upload Data"
                            icon={<UploadIcon className="w-7 h-7 mx-auto text-primary-600" />}
                            onClick={() => onNavigate(Page.UploadData)}
                        />
                        <ActionButton 
                            title="Top Selling"
                            icon={<TopSellingIcon className="w-7 h-7 mx-auto text-primary-600" />}
                            onClick={() => onNavigate(Page.TopSelling)}
                        />
                        <ActionButton 
                            title="AI Insights"
                            icon={<AIInsightsIcon className="w-7 h-7 mx-auto text-primary-600" />}
                            onClick={() => onNavigate(Page.AIInsights)}
                        />
                    </div>
                </div>
            </div>
            
            {/* AI Business Advisor */}
            <div className="bg-white p-6 rounded-xl shadow-subtle">
                 <h2 className="text-xl font-semibold text-neutral-700 mb-4">AI Business Advisor</h2>
                 {loading.advice ? (<div className="text-center py-4 text-neutral-500">Loading Advice...</div>) :
                 (<div className="space-y-4">
                     {advice.map(item => {
                         const style = getCategoryStyle(item.category);
                         return (
                         <div key={item.id} className={`p-4 rounded-lg flex items-start gap-4 ${style.bg}`}>
                             <div className={`flex-shrink-0 p-2 rounded-full ${style.iconBg}`}>
                                <AIInsightsIcon className={`w-6 h-6 ${style.text}`} />
                             </div>
                             <div>
                                 <h3 className="font-semibold text-neutral-800">{item.title} <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${style.iconBg} ${style.text}`}>{item.category}</span></h3>
                                 <p className="text-sm text-neutral-600">{item.message}</p>
                             </div>
                         </div>
                     )})}
                 </div>)}
            </div>
        </div>
    );
};

interface ActionButtonProps {
    title: string;
    icon: React.ReactNode;
    onClick: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({ title, icon, onClick }) => (
    <button onClick={onClick} className="p-4 bg-primary-50 rounded-lg text-center hover:bg-primary-100 transition-colors duration-200">
        {icon}
        <p className="mt-2 text-sm font-semibold text-primary-700">{title}</p>
    </button>
);

export default Dashboard;