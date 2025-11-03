import React from 'react';
import { AlertInfo } from '../types';
import { CloseIcon, AIInsightsIcon } from './Icons'; // Using AIInsights as a generic icon for now

interface AlertProps extends AlertInfo {
    onClose: () => void;
}

const Alert: React.FC<AlertProps> = ({ type, title, message, onClose }) => {
    const styles = {
        error: {
            bg: 'bg-danger-50',
            border: 'border-danger-200',
            iconColor: 'text-danger-500',
            titleColor: 'text-danger-800',
            textColor: 'text-danger-700',
            closeColor: 'text-danger-500 hover:bg-danger-100',
        },
        success: {
            bg: 'bg-success-50',
            border: 'border-success-200',
            iconColor: 'text-success-500',
            titleColor: 'text-success-800',
            textColor: 'text-success-700',
            closeColor: 'text-success-500 hover:bg-success-100',
        },
        warning: {
            bg: 'bg-warning-50',
            border: 'border-warning-200',
            iconColor: 'text-warning-500',
            titleColor: 'text-warning-800',
            textColor: 'text-warning-700',
            closeColor: 'text-warning-500 hover:bg-warning-100',
        },
        info: {
            bg: 'bg-primary-50',
            border: 'border-primary-200',
            iconColor: 'text-primary-500',
            titleColor: 'text-primary-800',
            textColor: 'text-primary-700',
            closeColor: 'text-primary-500 hover:bg-primary-100',
        },
    };

    const currentStyle = styles[type];

    return (
        <div className={`p-4 rounded-lg border ${currentStyle.bg} ${currentStyle.border} flex items-start gap-4 shadow-sm`}>
            <div className={`flex-shrink-0 ${currentStyle.iconColor}`}>
                <AIInsightsIcon className="w-6 h-6" />
            </div>
            <div className="flex-1">
                <h3 className={`font-semibold ${currentStyle.titleColor}`}>{title}</h3>
                <p className={`text-sm ${currentStyle.textColor}`}>{message}</p>
            </div>
            <button onClick={onClose} className={`p-1 rounded-full ${currentStyle.closeColor}`}>
                <CloseIcon className="w-5 h-5" />
            </button>
        </div>
    );
};

export default Alert;
