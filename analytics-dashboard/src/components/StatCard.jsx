import React from 'react';

const StatCard = ({ label, value, trend, color, icon: Icon }) => (
    <div className="bg-white p-2 rounded-xl border border-slate-200 relative w-full transition-all hover:shadow-xl hover:-translate-y-1 group flex items-center gap-5 min-h-[80px]">
        <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-md transition-transform group-hover:scale-110 flex-shrink-0"
            style={{ backgroundColor: color, boxShadow: `0 8px 20px ${color}33` }}
        >
            <Icon size={20} className="text-white fill-current" />
        </div>
        <div className="flex-grow">
            <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] mb-1 leading-none w-200">{label}</p>
            <div className="flex items-baseline gap-2 flex-wrap">
                <h3 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">{value}</h3>
                <span className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-lg ${trend.includes('+') || trend === 'STABLE' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'}`}>
                    {trend}
                </span>
            </div>
        </div>
    </div>
);

export default StatCard;
