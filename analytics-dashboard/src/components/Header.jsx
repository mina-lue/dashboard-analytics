import React from 'react';
import { Search as SearchIcon, Bell } from 'lucide-react';

const Header = ({ activeTab, searchQuery, setSearchQuery }) => {
    return (
        <header className="flex flex-col lg:flex-row justify-between items-center gap-8 mb-4 px-12">
            <div className="flex-shrink-0">
                <h2 className="text-2xl font-semibold tracking-tighter text-slate-900">{activeTab}</h2>
            </div>

            <div className="flex items-center gap-2 w-full lg:w-auto flex-grow justify-end h-8">
                <div className="relative w-full max-w-[200px]">
                    <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Query resources, topics, schemas..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-8 py-2 bg-white border-2 border-slate-200 rounded-[2rem] focus:outline-none focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all font-bold text-sm shadow-2xl shadow-slate-200/50"
                    />
                </div>
                <button className="p-2 bg-white border border-slate-200 rounded-[1.5rem] text-slate-600 hover:bg-slate-50 transition-all shadow-xl relative flex-shrink-0">
                    <Bell size={24} />
                    <div className="absolute top-5 right-5 w-3.5 h-3.5 bg-indigo-500 rounded-full border-4 border-white" />
                </button>
                <div className="w-12 h-12 rounded-[1.5rem] border-4 border-white shadow-2xl overflow-hidden cursor-pointer hover:scale-105 transition-transform flex-shrink-0">
                    <img src="https://ui-avatars.com/api/?name=Admin+User&background=6366f1&color=fff" alt="User" />
                </div>
            </div>
        </header>
    );
};

export default Header;
