import React from 'react';
import { Page } from '../types';
import { PharmaIQLogo, DashboardIcon, UploadIcon, LowStockIcon, TopSellingIcon, AIInsightsIcon, AIChatIcon, ROITrackerIcon, SettingsIcon, VisualizationsIcon, ReportsIcon, ActionCenterIcon, DocumentationIcon } from './Icons';

interface SidebarProps {
    currentPage: Page;
    onNavigate: (page: Page) => void;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const navItems = [
    { page: Page.Dashboard, label: 'Dashboard', icon: DashboardIcon },
    { page: Page.ActionCenter, label: 'Action Center', icon: ActionCenterIcon },
    { page: Page.ROITracker, label: 'ROI Tracker', icon: ROITrackerIcon },
    { page: Page.Reports, label: 'Reports', icon: ReportsIcon },
    { page: Page.UploadData, label: 'Data Integration', icon: UploadIcon },
    { page: Page.LowStock, label: 'Low Stock', icon: LowStockIcon },
    { page: Page.TopSelling, label: 'Top Selling', icon: TopSellingIcon },
    { page: Page.Visualizations, label: 'Visualizations', icon: VisualizationsIcon },
    { page: Page.AIInsights, label: 'AI Insights', icon: AIInsightsIcon },
    { page: Page.AIChat, label: 'AI Chat', icon: AIChatIcon },
    { page: Page.Settings, label: 'Settings', icon: SettingsIcon },
    { page: Page.Documentation, label: 'Documentation', icon: DocumentationIcon },
];

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate, isOpen, setIsOpen }) => {
    const handleNavigation = (page: Page) => {
        onNavigate(page);
        if (window.innerWidth < 768) { // md breakpoint
            setIsOpen(false);
        }
    };
    
    return (
        <>
            <aside className={`fixed md:relative inset-y-0 left-0 bg-white shadow-lg w-64 md:w-56 lg:w-64 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out z-30 flex flex-col border-r border-neutral-200`}>
                <div className="flex items-center justify-center p-4 border-b border-neutral-200 h-16">
                     <PharmaIQLogo className="h-8 w-8 text-primary-600" />
                    <h1 className="text-2xl font-bold text-neutral-800 ml-2">PharmaIQ</h1>
                </div>
                <nav className="flex-1 overflow-y-auto py-4">
                    <ul>
                        {navItems.map(item => (
                            <li key={item.page} className="px-3 mb-1">
                                <a
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleNavigation(item.page);
                                    }}
                                    className={`flex items-center p-3 text-sm rounded-lg transition-all duration-200 ${
                                        currentPage === item.page
                                            ? 'bg-primary-50 text-primary-600 font-semibold shadow-sm'
                                            : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                                    }`}
                                >
                                    <item.icon className="w-5 h-5 mr-3" />
                                    {item.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>
            {/* Overlay for mobile */}
            {isOpen && <div onClick={() => setIsOpen(false)} className="fixed inset-0 bg-black opacity-50 z-20 md:hidden"></div>}
        </>
    );
};

export default Sidebar;