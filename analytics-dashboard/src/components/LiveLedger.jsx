import React, { useMemo } from 'react';
import { ArrowUpRight } from 'lucide-react';

const LiveLedger = ({ data, categories, activeCategory, setCategory }) => {
    // Sort data to ensure newest items are first (in case API doesn't sort correctly)
    const sortedData = useMemo(() => {
        return [...data].sort((a, b) => {
            const dateA = a.datetime ? new Date(a.datetime).getTime() : 0;
            const dateB = b.datetime ? new Date(b.datetime).getTime() : 0;
            return dateB - dateA; // Descending order (newest first)
        });
    }, [data]);

    // Count items from the last minute
    const recentCount = useMemo(() => {
        const oneMinuteAgo = Date.now() - 60000;
        return sortedData.filter(item => {
            if (!item.datetime) return false;
            return new Date(item.datetime).getTime() >= oneMinuteAgo;
        }).length;
    }, [sortedData]);

    return (
        <div className="col-span-12 bg-white rounded-lg border border-slate-200 overflow-hidden relative mt-2">
            <div className="px-4 py-3 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white">
                <div className="flex items-center gap-3">
                    <h3 className="text-base font-semibold text-slate-900">Live Platform Ledger</h3>
                    {recentCount > 0 && (
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-xs font-medium rounded">
                            {recentCount} new
                        </span>
                    )}
                </div>

                <div className="flex gap-1 items-center flex-wrap">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setCategory(cat)}
                            className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                                activeCategory === cat 
                                    ? 'bg-indigo-600 text-white' 
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="px-4 py-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Resource ID</th>
                            <th className="px-4 py-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Title</th>
                            <th className="px-4 py-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wide text-center">Category</th>
                            <th className="px-4 py-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wide text-center">Priority</th>
                            <th className="px-4 py-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wide text-right">Time</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {sortedData.slice(0, 15).map((row, index) => {
                            // Check if this is a very recent item (within last minute)
                            const rowDate = row.datetime ? new Date(row.datetime) : null;
                            const isNewItem = rowDate && (Date.now() - rowDate.getTime()) < 60000; // Within last minute
                            
                            return (
                            <tr key={`${row.id}-${row.datetime || index}`} className={`group hover:bg-indigo-50/30 transition-colors ${isNewItem ? 'bg-blue-50/20 border-l-2 border-l-blue-500' : ''}`}>
                                <td className="px-4 py-2">
                                    <p className="text-xs font-medium text-slate-900 truncate max-w-[200px]">#{row.id}</p>
                                </td>
                                <td className="px-4 py-2">
                                    <p className="text-xs text-slate-700 truncate max-w-md">{row.title}</p>
                                </td>
                                <td className="px-4 py-2 text-center">
                                    <span className="text-xs font-medium text-slate-600 uppercase">{row.category}</span>
                                </td>
                                <td className="px-4 py-2 text-center">
                                    <span className={`text-xs font-medium ${row.priority === 'High' ? 'text-rose-600' : 'text-amber-600'}`}>{row.priority || 'NORMAL'}</span>
                                </td>
                                <td className="px-4 py-2 text-right">
                                    <p className="text-xs font-medium text-slate-700 tabular-nums">
                                        {row.datetime ? new Date(row.datetime).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }) : 'LIVE'}
                                    </p>
                                </td>
                            </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
                <button className="inline-flex items-center gap-2 px-6 py-2 border border-slate-200 rounded-lg bg-white text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                    Initiate Historical Audit <ArrowUpRight size={14} />
                </button>
            </div>
        </div>
    );
};

export default LiveLedger;
