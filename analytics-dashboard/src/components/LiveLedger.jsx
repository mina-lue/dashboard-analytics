import React from 'react';
import { Terminal, ChevronRight, ArrowUpRight } from 'lucide-react';

const LiveLedger = ({ data, categories, activeCategory, setCategory }) => {
    return (
        <div className="col-span-12 bg-white rounded-xl border-2 border-slate-200 overflow-hidden shadow-2xl relative mt-2">
            <div className="p-4 border-b border-slate-100 flex flex-col 2xl:flex-row justify-between items-start 2xl:items-center gap-12 bg-slate-50/50">
                <div className="flex gap-6 items-center">
                    <div className="w-10 h-10 bg-indigo-600 rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl shadow-indigo-600/30">
                        <Terminal size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-slate-900 tracking-tighter leading-none mb-3">Live Platform Ledger</h3>
                        <p className="text-slate-500 font-bold flex items-center gap-2 text-sm">
                            Master partition <span className="text-indigo-600 font-black">X-OFFSET_241</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                            Integrity score: <span className="text-emerald-500 font-black">99.98%</span>
                        </p>
                    </div>
                </div>

                <div className="flex bg-white p-2 rounded-xl shadow-2xl border border-slate-200 gap-2 items-center">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setCategory(cat)}
                            className={`px-2 py-1 rounded-xl text-[11px] font-black tracking-widest transition-all ${activeCategory === cat ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/40 ' : 'text-slate-400 hover:bg-slate-50'
                                }`}
                        >
                            {cat.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[1200px]">
                    <thead>
                        <tr className="bg-white">
                            <th className="px-12 py-10 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] w-32">Status</th>
                            <th className="px-12 py-10 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Resource ID</th>
                            <th className="px-12 py-10 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Payload Insight</th>
                            <th className="px-12 py-10 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] text-center">Protocol</th>
                            <th className="px-12 py-10 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] text-center">Priority</th>
                            <th className="px-12 py-10 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] text-right">Processed</th>
                            <th className="px-12 py-10 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] text-right w-16"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {data.slice(0, 15).map((row) => (
                            <tr key={row.id} className="group hover:bg-indigo-50/50 transition-all cursor-default relative overflow-hidden">
                                <td className="px-12 py-8 relative">
                                    <div className="relative">
                                        <div className="w-3.5 h-3.5 bg-emerald-500 rounded-full shadow-[0_0_15px_#10b981]" />
                                        <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-20" />
                                    </div>
                                </td>
                                <td className="px-12 py-8">
                                    <p className="text-base font-black text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors tracking-tight">#{row.id}</p>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{row.source || 'CLUSTER_A'}</p>
                                </td>
                                <td className="px-12 py-8 max-w-md">
                                    <p className="text-sm font-black text-slate-700 leading-snug line-clamp-1 mb-2">{row.title}</p>
                                    <div className="flex items-center gap-3">
                                        <span className="px-2 py-0.5 bg-slate-100 text-[8px] font-black text-slate-500 rounded-md uppercase tracking-widest border border-slate-200">Schema_V2</span>
                                        <span className="px-2 py-0.5 bg-indigo-50 text-[8px] font-black text-indigo-500 rounded-md uppercase tracking-widest border border-indigo-100">Encrypted</span>
                                    </div>
                                </td>
                                <td className="px-12 py-8 text-center uppercase tracking-widest text-[9px] font-black">
                                    <span className="px-4 py-1.5 bg-white border-2 border-slate-200 rounded-xl text-slate-500 shadow-sm group-hover:border-indigo-500 group-hover:text-indigo-600 transition-all">{row.category}</span>
                                </td>
                                <td className="px-12 py-8 text-center uppercase tracking-widest text-[9px] font-black">
                                    <span className={`px-4 py-1.5 rounded-xl border-2 ${row.priority === 'High' ? 'bg-rose-50 border-rose-100 text-rose-500' : 'bg-amber-50 border-amber-100 text-amber-500'}`}>{row.priority || 'NORMAL'}</span>
                                </td>
                                <td className="px-12 py-8 text-right flex flex-col items-end">
                                    <p className="text-lg font-black text-slate-800 leading-none mb-1 tabular-nums tracking-tighter">
                                        {row.datetime ? new Date(row.datetime).toLocaleTimeString([], { hour12: false }) : 'LIVE'}
                                    </p>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">TIMESTAMP</p>
                                </td>
                                <td className="px-12 py-8 text-right opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                    <button className="p-3 hover:bg-white rounded-2xl shadow-xl transition-all"><ChevronRight size={20} className="text-indigo-500" /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="p-16 bg-slate-50 border-t border-slate-100 text-center relative overflow-hidden group/f">
                <div className="absolute inset-0 bg-indigo-600 translate-y-full group-hover/f:translate-y-0 transition-transform duration-700 pointer-events-none" />
                <button className="relative z-10 inline-flex items-center gap-4 px-12 py-6 border-4 border-slate-200 rounded-[2.5rem] bg-white text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 group-hover/f:text-white group-hover/f:border-white/20 group-hover/f:bg-transparent transition-all shadow-2xl hover:scale-105">
                    Initiate Historical Audit <ArrowUpRight size={18} />
                </button>
            </div>
        </div>
    );
};

export default LiveLedger;
