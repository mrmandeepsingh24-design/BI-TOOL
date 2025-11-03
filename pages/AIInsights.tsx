

import React, { useState } from 'react';
import { getAIInsights } from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AIInsightsIcon } from '../components/Icons';
import { AlertInfo } from '../types';
import Alert from '../components/Alert';

const AIInsights: React.FC = () => {
    const [insights, setInsights] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<AlertInfo | null>(null);

    const handleGenerateInsights = async () => {
        setLoading(true);
        setInsights([]);
        setError(null);
        try {
            const data = await getAIInsights();
            setInsights(data.insights);
        } catch (err) {
            console.error("Failed to fetch AI insights", err);
            setError({ type: 'error', title: 'Generation Failed', message: "Couldn't generate AI insights at the moment. Please try again." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap justify-between items-center gap-4">
                 <h1 className="text-3xl font-bold text-neutral-800">AI Insights</h1>
                 <button 
                    onClick={handleGenerateInsights}
                    disabled={loading}
                    className="flex items-center bg-primary-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-primary-700 transition duration-300 disabled:bg-primary-300 shadow-sm hover:shadow-md"
                 >
                    <AIInsightsIcon className="w-5 h-5 mr-2" />
                    {loading ? 'Generating...' : 'Generate Insights'}
                 </button>
            </div>
            
            {error && <Alert {...error} onClose={() => setError(null)} />}

            {loading && <div className="text-center p-8">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
                <p className="mt-4 text-neutral-600">Our AI is analyzing your data...</p>
            </div>}
            
            {!loading && insights.length === 0 && !error && (
                <div className="text-center p-12 bg-white rounded-xl shadow-subtle">
                    <AIInsightsIcon className="w-16 h-16 text-neutral-300 mx-auto" />
                    <h2 className="mt-4 text-xl font-semibold text-neutral-700">Ready for smart recommendations?</h2>
                    <p className="mt-2 text-neutral-500">Click the "Generate Insights" button to get started.</p>
                </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {insights.map((insight, index) => (
                    <div key={index} className="bg-white p-6 rounded-xl shadow-subtle">
                        <h3 className="font-bold text-lg text-primary-700">{insight.title}</h3>
                        <p className="mt-2 text-neutral-600">{insight.message}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AIInsights;