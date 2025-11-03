import React, { useEffect, useState, useMemo } from 'react';
import { getLowStock } from '../services/api';
import { Medicine, AlertInfo } from '../types';
import Alert from '../components/Alert';

type SortKey = keyof Medicine | '';

const LowStock: React.FC = () => {
    const [medicines, setMedicines] = useState<Medicine[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<AlertInfo | null>(null);
    const [threshold, setThreshold] = useState(10);
    const [filter, setFilter] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'ascending' | 'descending' }>({ key: 'stock', direction: 'ascending' });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getLowStock();
                setMedicines(data.medicines);
            } catch (err) {
                console.error("Failed to fetch low stock data", err);
                setError({ type: 'error', title: 'Error Loading Data', message: 'Could not fetch low stock data. Please try again later.' });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const sortedAndFilteredMedicines = useMemo(() => {
        let sortableItems = [...medicines].filter(m => m.name.toLowerCase().includes(filter.toLowerCase()));

        if (sortConfig.key !== '') {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [medicines, filter, sortConfig]);

    const requestSort = (key: SortKey) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const getStockStatus = (stock: number) => {
        if (stock === 0) return { text: 'Out of Stock', color: 'bg-danger-100 text-danger-800' };
        if (stock <= threshold) return { text: 'Low Stock', color: 'bg-warning-100 text-warning-800' };
        return { text: 'Sufficient', color: 'bg-success-100 text-success-800' };
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-neutral-800">Low Stock Alerts</h1>
            
            {error && <Alert {...error} onClose={() => setError(null)} />}

            <div className="bg-white p-4 rounded-xl shadow-subtle flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-2">
                    <label htmlFor="threshold" className="text-sm font-medium text-neutral-700 whitespace-nowrap">Low Stock Threshold:</label>
                    <input 
                        type="number" 
                        id="threshold" 
                        value={threshold} 
                        onChange={(e) => setThreshold(Number(e.target.value))}
                        className="w-20 p-2 border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    />
                </div>
                 <div className="w-full sm:w-auto sm:flex-grow sm:max-w-xs">
                    <input 
                        type="text" 
                        placeholder="Filter by medicine name..." 
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="w-full p-2 border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-subtle overflow-hidden">
                <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left text-neutral-500">
                    <thead className="text-xs text-neutral-500 uppercase bg-neutral-50 tracking-wider">
                        <tr>
                            <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => requestSort('name')}>Medicine Name</th>
                            <th scope="col" className="px-6 py-3 cursor-pointer text-center" onClick={() => requestSort('stock')}>Available Stock</th>
                            <th scope="col" className="px-6 py-3 cursor-pointer text-center" onClick={() => requestSort('minRequired')}>Minimum Required</th>
                            <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => requestSort('expiry')}>Expiry Date</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200">
                        {loading ? (
                            <tr><td colSpan={5} className="text-center py-8 text-neutral-500">Loading...</td></tr>
                        ) : sortedAndFilteredMedicines.length > 0 ? (
                            sortedAndFilteredMedicines.map((med) => {
                                const status = getStockStatus(med.stock);
                                return (
                                <tr key={med.id} className="hover:bg-neutral-50">
                                    <td className="px-6 py-4 font-medium text-neutral-900 whitespace-nowrap">{med.name}</td>
                                    <td className="px-6 py-4 text-center">{med.stock}</td>
                                    <td className="px-6 py-4 text-center">{med.minRequired}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{new Date(med.expiry).toLocaleDateString('en-GB')}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${status.color}`}>
                                            {status.text}
                                        </span>
                                    </td>
                                </tr>
                            )})
                        ) : (
                             <tr><td colSpan={5} className="text-center py-8 text-neutral-500">No low stock items found.</td></tr>
                        )}
                    </tbody>
                </table>
                </div>
            </div>
        </div>
    );
};

export default LowStock;