import React, { useEffect, useState, useMemo } from 'react';
import { getActionableItems } from '../services/api';
import { ActionableItem, Page, AlertInfo } from '../types';
import { AIInsightsIcon } from '../components/Icons';
import Alert from '../components/Alert';

interface ActionCenterProps {
    onNavigate: (page: Page) => void;
}

type FilterStatus = 'all' | 'todo' | 'done';
type FilterPriority = 'all' | 'High' | 'Medium' | 'Low';

const ActionCenter: React.FC<ActionCenterProps> = ({ onNavigate }) => {
    const [items, setItems] = useState<ActionableItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<AlertInfo | null>(null);
    const [filterStatus, setFilterStatus] = useState<FilterStatus>('todo');
    const [filterPriority, setFilterPriority] = useState<FilterPriority>('all');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await getActionableItems();
                setItems(response.items);
            } catch (err) {
                console.error("Failed to fetch actionable items", err);
                setError({ type: 'error', title: 'Could Not Load Actions', message: 'Failed to fetch your action items. Please try refreshing the page.' });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleStatusChange = (id: string, newStatus: 'todo' | 'done') => {
        setItems(prevItems =>
            prevItems.map(item =>
                item.id === id ? { ...item, status: newStatus } : item
            )
        );
    };

    const filteredItems = useMemo(() => {
        return items.filter(item => {
            const statusMatch = filterStatus === 'all' || item.status === filterStatus;
            const priorityMatch = filterPriority === 'all' || item.priority === filterPriority;
            return statusMatch && priorityMatch;
        });
    }, [items, filterStatus, filterPriority]);

    const getPriorityStyles = (priority: ActionableItem['priority']) => {
        switch (priority) {
            case 'High': return 'border-danger-500 bg-danger-50';
            case 'Medium': return 'border-warning-500 bg-warning-50';
            case 'Low': return 'border-primary-500 bg-primary-50';
            default: return 'border-neutral-300 bg-neutral-50';
        }
    };
    
    const getPriorityBadgeStyles = (priority: ActionableItem['priority']) => {
        switch (priority) {
            case 'High': return 'bg-danger-100 text-danger-800';
            case 'Medium': return 'bg-warning-100 text-warning-800';
            case 'Low': return 'bg-primary-100 text-primary-800';
            default: return 'bg-neutral-100 text-neutral-800';
        }
    };

    const todoCount = useMemo(() => items.filter(i => i.status === 'todo').length, [items]);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-neutral-800">Action Center</h1>
                <p className="text-neutral-500 mt-1">
                    You have {todoCount} pending task{todoCount !== 1 && 's'} to address.
                </p>
            </div>

            {error && <Alert {...error} onClose={() => setError(null)} />}

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-subtle flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-neutral-600">Status:</span>
                    <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as FilterStatus)} className="p-2 border border-neutral-300 rounded-md text-sm focus:ring-primary-500 focus:border-primary-500">
                        <option value="all">All</option>
                        <option value="todo">To Do</option>
                        <option value="done">Completed</option>
                    </select>
                </div>
                 <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-neutral-600">Priority:</span>
                    <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value as FilterPriority)} className="p-2 border border-neutral-300 rounded-md text-sm focus:ring-primary-500 focus:border-primary-500">
                        <option value="all">All</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>
                </div>
            </div>
            
            {/* Action Items List */}
            <div className="space-y-4">
                 {loading && <div className="text-center py-8 text-neutral-500">Loading Actions...</div>}
                {!loading && filteredItems.map(item => (
                    <div key={item.id} className={`p-4 rounded-lg border-l-4 flex items-start gap-4 transition-opacity ${getPriorityStyles(item.priority)} ${item.status === 'done' ? 'opacity-60' : ''}`}>
                        <div className="pt-1">
                             <input 
                                type="checkbox" 
                                className="h-5 w-5 rounded text-primary-600 focus:ring-primary-500 cursor-pointer"
                                checked={item.status === 'done'}
                                onChange={() => handleStatusChange(item.id, item.status === 'todo' ? 'done' : 'todo')}
                            />
                        </div>
                        <div className="flex-1">
                            <h3 className={`font-semibold text-neutral-800 ${item.status === 'done' ? 'line-through' : ''}`}>{item.title}</h3>
                            <p className="text-sm text-neutral-600 mt-1">{item.description}</p>
                            <div className="mt-2 flex items-center gap-2 flex-wrap">
                                <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${getPriorityBadgeStyles(item.priority)}`}>{item.priority} Priority</span>
                                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-neutral-200 text-neutral-800">{item.category}</span>
                                {item.actionUrl && (
                                    <button onClick={() => onNavigate(item.actionUrl!)} className="text-xs font-semibold text-primary-600 hover:underline">
                                        Go to {item.actionUrl.replace('-', ' ')}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
                 {!loading && filteredItems.length === 0 && !error &&(
                     <div className="text-center p-12 bg-white rounded-xl shadow-subtle">
                         <AIInsightsIcon className="w-16 h-16 text-neutral-300 mx-auto" />
                         <h2 className="mt-4 text-xl font-semibold text-neutral-700">All Clear!</h2>
                         <p className="mt-2 text-neutral-500">There are no items matching your current filters.</p>
                     </div>
                 )}
            </div>
        </div>
    );
};

export default ActionCenter;