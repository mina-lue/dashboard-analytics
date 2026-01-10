import React from 'react';
import { Clock, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

const SummaryPanel = ({ 
    lastUpdated, 
    isLive, 
    totalEvents, 
    eventsLastHour,
    isRefreshing = false 
}) => {
    const formatLastUpdated = () => {
        if (!lastUpdated) return 'Never';
        const now = Date.now();
        const diff = now - lastUpdated;
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        
        if (seconds < 5) return 'Just now';
        if (seconds < 60) return `${seconds}s ago`;
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        return `${hours}h ago`;
    };

    return (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-50 rounded-lg">
                        <Clock size={18} className="text-slate-600" />
                    </div>
                    <div>
                        <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wide">Last Updated</p>
                        <p className="text-sm font-semibold text-slate-900">{formatLastUpdated()}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isLive ? 'bg-emerald-50' : 'bg-slate-50'}`}>
                        {isLive ? (
                            <CheckCircle2 size={18} className="text-emerald-600" />
                        ) : (
                            <AlertCircle size={18} className="text-slate-400" />
                        )}
                    </div>
                    <div>
                        <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wide">Status</p>
                        <p className={`text-sm font-semibold ${isLive ? 'text-emerald-600' : 'text-slate-400'}`}>
                            {isLive ? 'Live' : 'Offline'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 rounded-lg">
                        <CheckCircle2 size={18} className="text-indigo-600" />
                    </div>
                    <div>
                        <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wide">Total Events</p>
                        <p className="text-sm font-semibold text-slate-900 tabular-nums">
                            {totalEvents?.toLocaleString() || '0'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg relative">
                        <RefreshCw 
                            size={18} 
                            className={`text-blue-600 ${isRefreshing ? 'animate-spin' : ''}`}
                        />
                    </div>
                    <div>
                        <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wide">Last Hour</p>
                        <p className="text-sm font-semibold text-slate-900 tabular-nums">
                            {eventsLastHour?.toLocaleString() || '0'} events
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SummaryPanel;
