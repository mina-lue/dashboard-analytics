import React from 'react';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-200">
                <p className="font-semibold text-sm text-slate-900 mb-2 border-b border-slate-200 pb-2">{label}</p>
                {payload.map((entry, index) => (
                    <div key={index} className="flex items-center justify-between gap-4 my-1.5">
                        <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                            <p className="text-xs font-medium text-slate-600">{entry.name}</p>
                        </div>
                        <p className="text-xs font-semibold text-slate-900">{entry.value}</p>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

export default CustomTooltip;
