import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import {
  Zap,
  Activity,
  Database,
  Globe,
  Unplug,
  Lock
} from 'lucide-react';

// Data
import { SAMPLE_DATA, TRAFFIC_DATA, COLORS } from './data/constants';

// Components
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import StatCard from './components/StatCard';
import ThroughputChart from './components/ThroughputChart';
import SystemHealth from './components/SystemHealth';
import GeoDistribution from './components/GeoDistribution';
import LiveLedger from './components/LiveLedger';

function App() {
  const [newsData, setNewsData] = useState([]);
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [activeTab, setActiveTab] = useState('Analytics Hub');

  const refreshData = async () => {
    try {
      const res = await axios.get('http://localhost:9081/api/news?size=100');
      if (res.data.content && res.data.content.length > 0) {
        setNewsData(res.data.content);
        setIsLive(true);
      } else {
        setNewsData(SAMPLE_DATA);
        setIsLive(false);
      }
      setLoading(false);
    } catch (err) {
      setNewsData(SAMPLE_DATA);
      setIsLive(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 3000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const filteredData = useMemo(() => {
    return newsData.filter(item =>
      (categoryFilter === 'All' || item.category === categoryFilter) &&
      (item.title.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [newsData, searchQuery, categoryFilter]);

  const categoryCounts = useMemo(() => {
    const counts = newsData.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {});
    const total = newsData.length;
    return Object.keys(counts).map((key, index) => ({
      name: key,
      value: counts[key],
      fill: COLORS[index % COLORS.length],
      fullMark: total
    }));
  }, [newsData]);

  const categories = ['All', ...new Set(newsData.map(item => item.category))];

  return (
    <div className="flex min-h-screen bg-[#f1f5f9] font-outfit text-slate-800">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="lg:ml-60 flex-grow p-4 md:p-10 lg:p-8 transition-all">
        <Header activeTab={activeTab} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        <div className="grid grid-cols-12 gap-8">
          {activeTab === 'Analytics Hub' && (
            <>
              {/* Row 1: KPIs */}
              <div className="col-span-12 mb-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <StatCard label="Ingestion Throughput" value={newsData.length} trend="+24.2% / HR" color="#6366f1" icon={Zap} />
                  <StatCard label="Pipeline Latency" value={isLive ? '12.4ms' : '0.2ms'} trend="STABLE" color="#ec4899" icon={Activity} />
                  <StatCard label="Live Schemas" value={isLive ? '142' : '8'} trend="+12 NEW" color="#f59e0b" icon={Database} />
                </div>
              </div>

              {/* Row 2: Charts */}
              <div className="col-span-12 flex gap-6">
                <ThroughputChart data={TRAFFIC_DATA} />
                <SystemHealth />
              </div>

              {/* Row 4: Ledger */}
              <LiveLedger
                data={filteredData}
                categories={categories}
                activeCategory={categoryFilter}
                setCategory={setCategoryFilter}
              />
            </>
          )}

          {activeTab === 'Geographic Map' && (
            <GeoDistribution categoryCounts={categoryCounts} totalEvents={newsData.length} />
          )}
        </div>

        {/* Footer */}
        <footer className="mt-32 pt-16 border-t border-slate-200 flex flex-col xl:flex-row justify-between items-center gap-10 select-none pb-12">
          <div className="flex items-center gap-8">
            <div className="flex flex-col">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Platform Integrity</p>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(i => <div key={i} className={`w-1.5 h-5 rounded-full ${i > 10 ? 'bg-slate-200 animate-pulse' : 'bg-emerald-400 shadow-[0_0_8px_#10b981]'}`} />)}
              </div>
            </div>
            <div className="w-px h-10 bg-slate-200 hidden md:block" />
            <div className="flex flex-col">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Global Uptime</p>
              <p className="text-xl font-black text-indigo-500">99.98% <span className="text-[10px] text-slate-400 ml-1">SLA_OK</span></p>
            </div>
          </div>

          <div className="flex gap-8 items-center opacity-40 hover:opacity-100 transition-opacity">
            <p className="text-[11px] font-black text-slate-400">© 2026 ANTIGRAVITY SYSTEMS • V.4.0.28-CORE</p>
            <div className="flex gap-4">
              <Globe size={16} />
              <Unplug size={16} />
              <Lock size={16} />
            </div>
          </div>
        </footer>
      </main>

      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap');
          
          body {
            font-family: 'Outfit', sans-serif;
            background-color: #f1f5f9;
            margin: 0;
            overflow-x: hidden;
          }

          ::-webkit-scrollbar {
            width: 10px;
            height: 10px;
          }
          ::-webkit-scrollbar-track {
            background: #f1f5f9;
          }
          ::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 10px;
            border: 3px solid #f1f5f9;
          }
          ::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
          }

          .recharts-cartesian-grid-horizontal line,
          .recharts-cartesian-grid-vertical line {
            stroke: #f1f5f9;
          }
          
          /* Force charts to respect container */
          .recharts-responsive-container {
             min-height: 200px;
          }

          @keyframes pulse-custom {
             0% { transform: scale(0.95); opacity: 0.5; }
             50% { transform: scale(1.05); opacity: 1; }
             100% { transform: scale(0.95); opacity: 0.5; }
          }
        `}
      </style>
    </div>
  );
}

export default App;