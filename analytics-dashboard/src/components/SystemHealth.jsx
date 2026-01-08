import React from 'react';
import { Cpu, Lock } from 'lucide-react';

const SystemHealth = () => {
    return (
        <div className="col-span-12 2xl:col-span-4 grid grid-cols-1 gap-8 h-full">
            <div className="bg-[#0f172a] rounded-[3.5rem] p-10 text-white border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col justify-center">
                <div className="absolute inset-0 bg-[radial-gradient(#6366f1_1px,transparent_1px)] opacity-10 [background-size:24px_24px]" />
                <div className="relative z-10">
                    <div className="flex justify-between items-center mb-10">
                        <div className="p-4 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-md">
                            <Cpu className="text-indigo-400" size={32} />
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Global Load</p>
                            <h4 className="text-4xl font-black text-white leading-none">42%</h4>
                        </div>
                    </div>
                    <div className="space-y-6">
                        {[
                            { label: 'Cluster CPU', val: 34, color: '#6366f1' },
                            { label: 'Memory Pool', val: 76, color: '#ec4899' },
                            { label: 'Storage Node', val: 12, color: '#10b981' }
                        ].map((bar, i) => (
                            <div key={i}>
                                <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">
                                    <span>{bar.label}</span>
                                    <span className="text-white">{bar.val}%</span>
                                </div>
                                <div className="h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                    <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${bar.val}%`, backgroundColor: bar.color, boxShadow: `0 0 15px ${bar.color}88` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-[3.5rem] p-10 border border-slate-200 shadow-sm flex flex-col group hover:shadow-2xl transition-all">
                <div className="w-16 h-16 bg-rose-50 rounded-3xl flex items-center justify-center text-rose-500 mb-8 border border-rose-100 shadow-inner group-hover:rotate-6 transition-transform">
                    <Lock size={32} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tighter mb-2">Compliance Hub</h3>
                <p className="text-slate-400 text-sm font-medium mb-10 leading-relaxed uppercase tracking-wider text-[11px] font-black">All active streams are verified against SOC-2 and HIPAA protocols.</p>
                <div className="flex -space-x-3 mb-8">
                    {[1, 2, 3, 4].map(i => <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-slate-100 overflow-hidden shadow-lg"><img src={`https://ui-avatars.com/api/?name=U${i}&background=f1f5f9&color=64748b`} /></div>)}
                    <div className="w-10 h-10 rounded-full border-4 border-white bg-indigo-500 flex items-center justify-center text-[10px] font-black text-white shadow-xl">+12</div>
                </div>
                <button className="mt-auto py-5 bg-slate-900 text-white rounded-3xl text-sm font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-slate-800 transition-colors">Access Control List</button>
            </div>
        </div>
    );
};

export default SystemHealth;
