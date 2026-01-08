import React from 'react';
import { Cpu, Lock } from 'lucide-react';

const SystemHealth = () => {
    return (
        <div className="col-span-12 2xl:col-span-4 grid grid-cols-1 gap-8 h-full w-1/3">
            <div className="bg-[#0f172a] rounded-xl p-2 text-white border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col justify-center  p-4">
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
        </div>
    );
};

export default SystemHealth;
