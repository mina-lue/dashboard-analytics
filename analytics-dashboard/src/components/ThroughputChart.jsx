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
        <div className="col-span-12 bg-white p-2 rounded-md border border-slate-200 shadow-sm relative overflow-hidden group min-h-[120px] w-1/3">
            <div className="absolute top-0 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none group-hover:scale-110 transition-transform duration-1000" />
            <div className="flex flex-col justify-between items-start gap-6 mb-8 relative z-10">
                <div>
                    <h3 className="text-xl font-semibold text-slate-900 tracking-tighter">Throughput Analytics</h3>
                </div>
                <div className="flex bg-slate-100 p-1 rounded-2xl gap-2 shadow-inner justify-center">
                    {['Hourly', 'Daily', 'Weekly'].map(t => (
                        <button key={t} className={`px-2 py-1 rounded-xl text-[11px] font-semibold ${t === 'Hourly' ? 'bg-white shadow-xl text-indigo-600' : 'text-slate-500'}`}>{t}</button>
                    ))}
                </div>
            </div>

            <div className="h-[200px] w-full relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={data}>
                        <defs>
                            <linearGradient id="mainGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="8 8" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 6, fontWeight: 90 }} dy={5} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 6, fontWeight: 90 }} dx={-5} />
                        <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                        <Bar dataKey="events" fill="#a9b0b9" fillOpacity={0.6} radius={[6, 6, 0, 0]} barSize={5} />
                        <Line type="monotone" dataKey="throughput" stroke="#6366f1" strokeWidth={3} dot={{ r: 2, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 4, fill: '#6366f1' }} z={10} />
                        <Line type="monotone" dataKey="latency" stroke="#ec4899" strokeWidth={3} dot={{ r: 2, fill: '#ec4899', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 4, fill: '#ec4899' }} z={10} />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default ThroughputChart;
