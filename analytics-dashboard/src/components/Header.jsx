import React from 'react';
import { Search as SearchIcon, Bell, LayoutGrid } from 'lucide-react';

const Header = ({ activeTab, searchQuery, setSearchQuery }) => {
    return (
        <header className="flex flex-col lg:flex-row justify-between items-center gap-6 mb-2 py-1 bg-white px-4 border-b border-slate-200 rounded-t-xl">
            <div className="flex items-center gap-3">
                <button className="lg:hidden p-2 -ml-2 text-slate-500">
                    <LayoutGrid size={20} />
                </button>
                <h2 className="text-md tracking-tight text-slate-800">{activeTab}</h2>
            </div>

            <div className="flex items-center gap-4 w-full lg:w-auto">
                <div className="relative w-full lg:w-[320px]">
                    <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-1 bg-white border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300 transition-all placeholder:text-slate-400"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                        <span className="text-[10px] font-medium text-slate-400 border border-slate-200 rounded px-1.5 py-0.5">⌘K</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4 w-full lg:w-auto">
                <div className="flex items-center gap-2 border-l border-slate-200 pl-4 ml-2">
                    <button className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors relative">
                        <Bell size={18} />
                        <span className="absolute top-2 right-2.5 w-1.5 h-1.5 bg-rose-500 rounded-full border border-white"></span>
                    </button>
                    <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 overflow-hidden ml-2">
                        <img src="https://ui-avatars.com/api/?name=Admin+User&background=0f172a&color=fff" alt="User" />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
