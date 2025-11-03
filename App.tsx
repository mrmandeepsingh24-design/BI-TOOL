import React, { useState, useEffect } from 'react';
import { User, Page } from './types';

// Import Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UploadData from './pages/UploadData';
import LowStock from './pages/LowStock';
import TopSelling from './pages/TopSelling';
import AIInsights from './pages/AIInsights';
import AIChat from './pages/AIChat';
import ROITracker from './pages/ROITracker';
import Visualizations from './pages/Visualizations';
import Settings from './pages/Settings';
import Reports from './pages/Reports';
import ActionCenter from './pages/ActionCenter';
import Documentation from './pages/Documentation';

// Import Components
import Sidebar from './components/Sidebar';
import Header from './components/Header';

const App: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [currentPage, setCurrentPage] = useState<Page>(Page.Dashboard);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        // Mock checking for a logged-in user
        const loggedInUser = sessionStorage.getItem('user');
        if (loggedInUser) {
            setUser(JSON.parse(loggedInUser));
        }
    }, []);

    const handleLoginSuccess = (loggedInUser: User) => {
        setUser(loggedInUser);
        sessionStorage.setItem('user', JSON.stringify(loggedInUser));
    };

    const handleLogout = () => {
        setUser(null);
        setCurrentPage(Page.Dashboard);
        sessionStorage.removeItem('user');
    };

    const renderPage = () => {
        switch (currentPage) {
            case Page.Dashboard:
                return <Dashboard onNavigate={setCurrentPage} />;
            case Page.ActionCenter:
                return <ActionCenter onNavigate={setCurrentPage} />;
            case Page.UploadData:
                return <UploadData />;
            case Page.LowStock:
                return <LowStock />;
            case Page.TopSelling:
                return <TopSelling />;
            case Page.AIInsights:
                return <AIInsights />;
            case Page.AIChat:
                return <AIChat />;
            case Page.ROITracker:
                return <ROITracker />;
            case Page.Reports:
                return <Reports />;
            case Page.Visualizations:
                return <Visualizations />;
            case Page.Settings:
                return <Settings />;
            case Page.Documentation:
                return <Documentation />;
            default:
                return <Dashboard onNavigate={setCurrentPage} />;
        }
    };

    if (!user) {
        return <Login onLoginSuccess={handleLoginSuccess} />;
    }

    return (
        <div className="flex h-screen bg-neutral-50 text-neutral-800">
            <Sidebar 
                currentPage={currentPage} 
                onNavigate={setCurrentPage}
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}
            />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header 
                    user={user} 
                    onLogout={handleLogout}
                    onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                />
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 lg:p-8">
                    {renderPage()}
                </main>
            </div>
        </div>
    );
};

export default App;