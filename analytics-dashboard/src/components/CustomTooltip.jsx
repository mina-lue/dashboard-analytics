import React from 'react';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white/95 p-4 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.1)] border border-black/5 backdrop-blur-md">
                <p className="font-black text-xs text-slate-800 mb-2 border-b border-slate-100 pb-1">{label}</p>
                {payload.map((entry, index) => (
                    <div key={index} className="flex items-center justify-between gap-4 my-1">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                            <p className="text-[10px] font-extrabold text-slate-500 uppercase">{entry.name}</p>
                        </div>
                        <p className="text-xs font-black text-slate-900">{entry.value}</p>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

export default CustomTooltip;
