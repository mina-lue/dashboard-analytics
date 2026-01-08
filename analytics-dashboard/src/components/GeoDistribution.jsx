import React from 'react';
import {
    RadialBarChart,
    RadialBar,
    Tooltip as RechartsTooltip,
    ResponsiveContainer
} from 'recharts';
import { Filter, Globe, ArrowUpRight } from 'lucide-react';
import CustomTooltip from './CustomTooltip';

const GeoDistribution = ({ categoryCounts, totalEvents }) => {
    return (
        <div className="col-span-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white p-10 rounded-[4.5rem] border border-slate-200 shadow-sm flex flex-col min-h-[500px]">
                <div className="flex justify-between items-start mb-10 px-2">
                    <div>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-2">Category Mix</h3>
                        <p className="text-slate-400 text-[11px] font-black uppercase tracking-widest">Volume distribution</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100"><Filter size={18} className="text-slate-400" /></div>
                </div>

                <div className="flex-grow flex items-center justify-center relative">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-20">
                        {categoryCounts.map((entry, index) => (
                            <div key={index} className="flex items-center gap-3">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">{entry.name}</span>
                                <div className="w-6 h-2 rounded-full shadow-lg" style={{ backgroundColor: entry.fill }} />
                            </div>
                        ))}
                    </div>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadialBarChart innerRadius="25%" outerRadius="120%" data={categoryCounts} startAngle={180} endAngle={-90} barSize={22}>
                                <RadialBar minAngle={15} background={{ fill: '#f8fafc' }} dataKey="value" radius={30} cornerRadius={20} />
                                <RechartsTooltip content={<CustomTooltip />} />
                            </RadialBarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="absolute top-[55%] left-[45%] -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                        <h4 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">{totalEvents}</h4>
                        <p className="text-indigo-600 font-black uppercase tracking-[0.4em] text-[10px] mt-3">Events</p>
                    </div>
                </div>
            </div>

            <div className="lg:col-span-2 bg-white rounded-[4.5rem] border border-slate-200 overflow-hidden shadow-sm relative group p-12 flex flex-col">
                <div className="flex justify-between items-start mb-10 flex-wrap gap-6">
                    <div>
                        <h3 className="text-3xl font-black text-slate-900 tracking-tighter leading-none mb-3">Geographic Ingestion</h3>
                        <p className="text-slate-400 text-sm font-medium">Real-time load balancing across global edge nodes.</p>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="text-center">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Nodes</p>
                            <p className="text-2xl font-black text-slate-900 leading-none tabular-nums">1,242</p>
                        </div>
                        <div className="w-px h-10 bg-slate-100" />
                        <div className="text-center">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Global Sync</p>
                            <p className="text-2xl font-black text-emerald-500 leading-none tabular-nums">99.2%</p>
                        </div>
                    </div>
                </div>

                <div className="flex-grow bg-slate-50 rounded-[3.5rem] border-2 border-slate-100 relative group overflow-hidden">
                    <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#6366f1_1.5px,transparent_1.5px)] bg-[length:30px_30px]" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Globe size={200} className="text-indigo-500/10 animate-pulse" />
                    </div>

                    {[
                        { t: 15, l: 30, n: 'LDN-01' }, { t: 40, l: 45, n: 'NYC-04' },
                        { t: 60, l: 20, n: 'SFO-02' }, { t: 25, l: 70, n: 'TYO-09' },
                        { t: 70, l: 60, n: 'SYD-03' }, { t: 50, l: 80, n: 'SIN-01' }
                    ].map((pt, i) => (
                        <div key={i} className="absolute group/pt" style={{ top: `${pt.t}%`, left: `${pt.l}%` }}>
                            <div className="w-4 h-4 bg-indigo-500 rounded-full shadow-[0_0_20px_#6366f1] animate-pulse cursor-pointer transition-transform hover:scale-125" />
                            <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[8px] font-black px-2 py-1 rounded-md opacity-0 group-hover/pt:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">{pt.n}: READY</div>
                        </div>
                    ))}

                    <div className="absolute bottom-8 right-8 flex items-center gap-3 bg-white/80 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/50 shadow-xl">
                        <div className="flex flex-col">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Network Density</span>
                            <span className="text-sm font-black text-slate-900">Critical (+42%)</span>
                        </div>
                        <ArrowUpRight size={20} className="text-emerald-500" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GeoDistribution;
