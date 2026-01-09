import React from 'react';
import {
    Zap,
    LayoutDashboard,
    Radio,
    Globe,
    Database,
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
    return (
        <aside className="fixed left-0 top-0 h-screen w-54 bg-gray-200 border-r border-slate-200 hidden lg:flex flex-col p-6 z-50">
            <div className="flex items-center gap-3 mb-10 px-2">
                <div className="w-8 h-8 bg-slate-900 rounded-md flex items-center justify-center">
                    <Zap size={18} className="text-white fill-current" />
                </div>
                <span className="font-bold text-lg tracking-tight text-slate-900">Shadcn UI Kit</span>
            </div>

            <nav className="flex-grow space-y-8">
                <div>
                    <p className="text-xs font-medium text-slate-500 mb-3 px-3">Dashboards</p>
                    <ul className="space-y-1">
                        {[
                            { text: 'Analytics Hub', icon: <LayoutDashboard size={18} /> },
                            { text: 'Live Pipeline', icon: <Radio size={18} />, badge: 'LIVE' },
                            { text: 'Geographic Map', icon: <Globe size={18} /> },
                            { text: 'Topic Registry', icon: <Database size={18} /> },
                        ].map((item) => (
                            <li key={item.text} onClick={() => setActiveTab(item.text)}>
                                <button className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium ${activeTab === item.text
                                    ? 'bg-slate-100 text-slate-900'
                                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                    }`}>
                                    <span>{item.icon}</span>
                                    <span className="flex-grow text-left">{item.text}</span>
                                    {item.badge && <span className="bg-emerald-100 text-emerald-700 text-[10px] px-1.5 py-0.5 rounded-sm font-semibold">{item.badge}</span>}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>

            <div className="mt-auto pt-6 border-t border-slate-100">
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                    <h4 className="font-semibold text-sm mb-1 text-slate-900">Get Pro</h4>
                    <p className="text-xs text-slate-500 mb-4 leading-relaxed">Unlock lifetime access to all dashboards and components.</p>
                    <button className="w-full bg-slate-900 text-white py-2 rounded-md text-xs font-medium hover:bg-slate-800 transition-colors">
                        Unlock Pro
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
