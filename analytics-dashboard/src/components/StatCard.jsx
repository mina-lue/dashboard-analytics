import React from 'react';

const StatCard = ({ label, value, trend, color, icon: Icon, description }) => {
    const getTrendColor = (trendValue) => {
        if (!trendValue) return 'bg-slate-50 text-slate-500';
        if (trendValue === 'STABLE' || trendValue.includes('STABLE')) return 'bg-blue-50 text-blue-600';
        if (trendValue.includes('+') || trendValue.includes('/HR')) return 'bg-emerald-50 text-emerald-600';
        if (trendValue.includes('-')) return 'bg-rose-50 text-rose-500';
        return 'bg-slate-50 text-slate-500';
    };

    return (
        <div className="bg-white p-4 rounded-lg border border-slate-200 relative w-full transition-all hover:shadow-lg hover:-translate-y-0.5 group flex items-center gap-4 min-h-[90px]">
            <div
                className="w-11 h-11 rounded-xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-105 flex-shrink-0"
                style={{ backgroundColor: color, boxShadow: `0 4px 12px ${color}33` }}
            >
                <Icon size={18} className="text-white fill-current" />
            </div>
            <div className="flex-grow min-w-0">
                <p className="text-slate-500 text-[10px] font-semibold uppercase tracking-wide mb-1 leading-none truncate">{label}</p>
                <div className="flex items-baseline gap-2 flex-wrap">
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight leading-none tabular-nums">{value}</h3>
                    {trend && (
                        <span className={`text-[9px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-md ${getTrendColor(trend)}`}>
                            {trend}
                        </span>
                    )}
                </div>
                {description && (
                    <p className="text-[10px] text-slate-400 mt-1 truncate">{description}</p>
                )}
            </div>
        </div>
    );
};

export default StatCard;
