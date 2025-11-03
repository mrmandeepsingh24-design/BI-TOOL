import React, { useState, useRef, useEffect } from 'react';
import { User } from '../types';
import { UserIcon, LogoutIcon, MenuIcon } from './Icons';

interface HeaderProps {
    user: User;
    onLogout: () => void;
    onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, onToggleSidebar }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="bg-white/80 backdrop-blur-sm border-b border-neutral-200 px-2 py-3 sm:p-4 flex justify-between items-center z-10 sticky top-0">
            <button onClick={onToggleSidebar} className="md:hidden text-neutral-600 hover:text-primary-600 p-2">
                <MenuIcon className="w-6 h-6" />
            </button>
            <div className="hidden md:block">
                <h1 className="text-xl font-semibold text-neutral-700">Welcome, {user.name}</h1>
            </div>
            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center space-x-2 p-1 rounded-full hover:bg-neutral-100"
                >
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary-100 flex items-center justify-center">
                        <UserIcon className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" />
                    </div>
                    <div className="hidden sm:block text-left">
                        <p className="font-semibold text-neutral-800 text-sm">{user.name}</p>
                        <p className="text-xs text-neutral-500">{user.email}</p>
                    </div>
                </button>
                {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 py-1 border border-neutral-200">
                        <button
                            onClick={onLogout}
                            className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 flex items-center"
                        >
                            <LogoutIcon className="w-5 h-5 mr-2" />
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;