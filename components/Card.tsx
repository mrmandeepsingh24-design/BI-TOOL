import React from 'react';

interface CardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    change?: string;
    changeType?: 'positive' | 'negative';
}

const Card: React.FC<CardProps> = ({ title, value, icon, change, changeType }) => {
    const changeColor = changeType === 'positive' ? 'text-success-500' : 'text-danger-500';

    return (
        <div className="bg-white p-5 rounded-xl shadow-subtle flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:-translate-y-1">
            <div className="flex justify-between items-start">
                <p className="text-sm font-medium text-neutral-500">{title}</p>
                {icon}
            </div>
            <div className="mt-2">
                <p className="text-3xl font-bold text-neutral-800 truncate">{value}</p>
                {change && (
                    <p className={`text-xs font-medium ${changeColor}`}>
                        {change} vs last period
                    </p>
                )}
            </div>
        </div>
    );
};

export default Card;