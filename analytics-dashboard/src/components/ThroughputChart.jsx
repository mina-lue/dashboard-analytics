import React from 'react';
import {
    ComposedChart,
    Area,
    Line,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer
} from 'recharts';
import CustomTooltip from './CustomTooltip';

const ThroughputChart = ({ data }) => {
    return (
        <div className="col-span-12 2xl:col-span-8 bg-white p-10 rounded-[4rem] border border-slate-200 shadow-sm relative overflow-hidden group min-h-[550px]">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none group-hover:scale-110 transition-transform duration-1000" />
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12 relative z-10">
                <div>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter mb-2">Throughput Analytics</h3>
                    <p className="text-slate-400 font-medium max-w-sm">Detailed message processing rate vs hardware capacity spikes.</p>
                </div>
                <div className="flex bg-slate-100 p-2 rounded-2xl gap-2 shadow-inner">
                    {['Hourly', 'Daily', 'Weekly'].map(t => (
                        <button key={t} className={`px-6 py-2 rounded-xl text-[11px] font-black ${t === 'Hourly' ? 'bg-white shadow-xl text-indigo-600' : 'text-slate-500'}`}>{t}</button>
                    ))}
                </div>
            </div>

            <div className="h-[400px] w-full relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={data}>
                        <defs>
                            <linearGradient id="mainGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="8 8" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 900 }} dy={15} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 900 }} dx={-10} />
                        <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                        <Bar dataKey="events" fill="#e2e8f0" radius={[16, 16, 0, 0]} barSize={60} />
                        <Area type="monotone" dataKey="throughput" stroke="#6366f1" strokeWidth={6} fill="url(#mainGrad)" />
                        <Line type="monotone" dataKey="latency" stroke="#ec4899" strokeWidth={5} dot={{ r: 8, fill: '#ec4899', strokeWidth: 4, stroke: '#fff' }} activeDot={{ r: 10, fill: '#ec4899' }} />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default ThroughputChart;
