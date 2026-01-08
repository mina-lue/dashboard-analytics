import React from 'react';
import {
    Zap,
    LayoutDashboard,
    Radio,
    Globe,
    Database,
    ShieldCheck,
    Monitor,
    Settings
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
    return (
        <aside className="fixed left-0 top-0 h-screen w-80 bg-white border-r border-slate-200 hidden lg:flex flex-col p-8 z-50 shadow-2xl shadow-slate-200/50">
            <div className="flex items-center gap-4 mb-12 group cursor-pointer">
                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-600/30 group-hover:rotate-12 transition-all">
                    <Zap size={28} className="text-white fill-current" />
                </div>
                <div>
                    <h1 className="text-2xl font-black tracking-tighter text-slate-900 leading-none">ANTIGRAVITY</h1>
                    <p className="text-[10px] text-indigo-500 font-black uppercase tracking-[0.2em] mt-1.5">Systems Engine</p>
                </div>
            </div>

            <nav className="flex-grow space-y-10">
                <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 px-2">Ingestion Flow</p>
                    <ul className="space-y-1.5">
                        {[
                            { text: 'Analytics Hub', icon: <LayoutDashboard size={20} /> },
                            { text: 'Live Pipeline', icon: <Radio size={20} />, badge: 'LIVE' },
                            { text: 'Geographic Map', icon: <Globe size={20} /> },
                            { text: 'Topic Registry', icon: <Database size={20} /> },
                        ].map((item) => (
                            <li key={item.text} onClick={() => setActiveTab(item.text)}>
                                <button className={`w-full flex items-center gap-4 px-5 py-4 rounded-3xl transition-all font-black text-sm ${activeTab === item.text ? 'bg-slate-900 text-white shadow-2xl' : 'text-slate-500 hover:bg-slate-50'
                                    }`}>
                                    <span className={activeTab === item.text ? 'text-indigo-400' : 'text-slate-400'}>{item.icon}</span>
                                    <span className="flex-grow text-left">{item.text}</span>
                                    {item.badge && <span className="bg-rose-500 text-[8px] px-1.5 py-0.5 rounded-md text-white">{item.badge}</span>}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 px-2">Governance</p>
                    <ul className="space-y-1.5">
                        {[
                            { text: 'Security Hub', icon: <ShieldCheck size={20} /> },
                            { text: 'Cluster Health', icon: <Monitor size={20} /> },
                            { text: 'System Config', icon: <Settings size={20} /> },
                        ].map((item) => (
                            <li key={item.text}>
                                <button className="w-full flex items-center gap-4 px-5 py-4 rounded-3xl text-slate-500 hover:bg-slate-50 transition-all font-black text-sm">
                                    <span className="text-slate-400">{item.icon}</span>
                                    <span className="text-left">{item.text}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>

            <div className="mt-auto bg-indigo-600 rounded-[2.5rem] p-6 text-white relative overflow-hidden ring-4 ring-indigo-50 group hover:scale-[1.02] transition-transform shadow-2xl shadow-indigo-600/20">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-white/20 transition-all" />
                <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-80 mb-2">Performance Tier</p>
                <h4 className="text-2xl font-black mb-1">PRO-ULTRA</h4>
                <p className="text-[11px] font-medium opacity-80 leading-relaxed mb-6">Dedicated bandwidth for million-scale pipelines.</p>
                <button className="w-full bg-white text-indigo-600 py-3 rounded-2xl font-black text-xs shadow-xl shadow-black/10 hover:bg-slate-50">Manage Quota</button>
            </div>
        </aside>
    );
};

export default Sidebar;
