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
  const [pipelineLatency, setPipelineLatency] = useState(0);
  const [previousDataLength, setPreviousDataLength] = useState(0);

  const refreshData = async () => {
    try {
      const startTime = performance.now();
      // Request with sort parameter to get newest items first
      const res = await axios.get('http://localhost:9081/api/news?size=100&sort=datetime,desc');
      const endTime = performance.now();
      const latency = Math.round((endTime - startTime) * 10) / 10; // Round to 1 decimal place
      setPipelineLatency(latency);
      
      if (res.data.content && res.data.content.length > 0) {
        // Sort by datetime descending to ensure newest first (in case API doesn't sort)
        const sortedData = [...res.data.content].sort((a, b) => {
          const dateA = a.datetime ? new Date(a.datetime).getTime() : 0;
          const dateB = b.datetime ? new Date(b.datetime).getTime() : 0;
          return dateB - dateA; // Descending order (newest first)
        });
        setNewsData(sortedData);
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
      setPipelineLatency(0);
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
    const filtered = newsData.filter(item =>
      (categoryFilter === 'All' || item.category === categoryFilter) &&
      (item.title.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    
    // Sort by datetime descending (newest first) - ensure newest items appear at top
    const sorted = filtered.sort((a, b) => {
      const dateA = a.datetime ? new Date(a.datetime).getTime() : 0;
      const dateB = b.datetime ? new Date(b.datetime).getTime() : 0;
      return dateB - dateA; // Descending order (newest first)
    });
    
    return sorted;
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

  // Calculate ingestion throughput (items per hour)
  // This represents the rate at which news items are being ingested into the system
  // Producer API generates news every 5 seconds = 720 items/hour theoretically
  const ingestionThroughput = useMemo(() => {
    if (!isLive || newsData.length === 0) return 0;
    
    // Get all items with valid datetime, sorted by newest first
    const itemsWithDate = newsData
      .filter(item => item.datetime)
      .map(item => new Date(item.datetime).getTime())
      .filter(ts => !isNaN(ts))
      .sort((a, b) => b - a); // Sort newest first
    
    if (itemsWithDate.length === 0) {
      // No valid dates - fallback to showing total count
      return newsData.length;
    }
    
    // Check items from the last hour
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    const recentItems = itemsWithDate.filter(ts => ts >= oneHourAgo);
    
    if (recentItems.length > 0) {
      // Calculate actual rate based on items in the last hour
      return recentItems.length; // Items in last hour = items/hour
    } else {
      // No items from last hour - estimate from recent items
      // Use the 10 most recent items to estimate rate
      const sampleSize = Math.min(10, itemsWithDate.length);
      const sampleItems = itemsWithDate.slice(0, sampleSize);
      
      if (sampleItems.length < 2) {
        // Not enough data - return total as estimate
        return newsData.length;
      }
      
      // Calculate time span of sample
      const oldestSample = sampleItems[sampleItems.length - 1];
      const newestSample = sampleItems[0];
      const timeSpanMs = Math.max(newestSample - oldestSample, 300000); // At least 5 minutes
      const timeSpanHours = timeSpanMs / (60 * 60 * 1000);
      
      // Estimate hourly rate from sample
      const estimatedRate = sampleItems.length / timeSpanHours;
      
      // Producer API generates every 5 seconds = 720 items/hour maximum
      // Return a reasonable estimate (cap at 720)
      return Math.min(Math.round(estimatedRate), 720);
    }
  }, [newsData, isLive]);

  // Calculate unique schemas (categories) from actual data
  const liveSchemas = useMemo(() => {
    if (!isLive || newsData.length === 0) return 8; // Default fallback
    const uniqueCategories = new Set(newsData.map(item => item.category).filter(Boolean));
    return uniqueCategories.size;
  }, [newsData, isLive]);

  // Calculate trend for ingestion throughput
  const throughputTrend = useMemo(() => {
    if (!isLive) return '0% / HR';
    const currentLength = newsData.length;
    if (previousDataLength === 0) {
      return '+0% / HR';
    }
    const change = ((currentLength - previousDataLength) / previousDataLength) * 100;
    const sign = change >= 0 ? '+' : '';
    return `${sign}${Math.round(change * 10) / 10}% / HR`;
  }, [newsData.length, previousDataLength, isLive]);

  // Update previous data length for trend calculation
  useEffect(() => {
    if (isLive && newsData.length > 0) {
      setPreviousDataLength(newsData.length);
    }
  }, [newsData.length, isLive]);

  return (
    <div className="flex min-h-screen bg-gray-200 font-outfit text-slate-800">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="lg:ml-54  bg-gray-100 flex-grow min-h-screen transition-all flex flex-col rounded-t-xl">
        <Header activeTab={activeTab} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        <div className="p-4 md:p-8 lg:p-8 max-w-[1600px] mx-auto w-full flex-grow flex flex-col">
          <div className="grid grid-cols-12 gap-6">
            {activeTab === 'Analytics Hub' && (
              <>
                {/* Row 1: KPIs */}
                <div className="col-span-12 mb-2">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard label="Ingestion Throughput" value={ingestionThroughput} trend={throughputTrend} color="#6366f1" icon={Zap} />
                    <StatCard label="Pipeline Latency" value={isLive ? `${pipelineLatency}ms` : '0.2ms'} trend="STABLE" color="#ec4899" icon={Activity} />
                    <StatCard label="Live Schemas" value={isLive ? liveSchemas.toString() : '8'} trend={isLive && newsData.length > previousDataLength ? `+${Math.max(0, newsData.length - previousDataLength)} NEW` : '+0 NEW'} color="#f59e0b" icon={Database} />
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
          <footer className="mt-auto pt-12 border-t border-slate-200 flex flex-col xl:flex-row justify-between items-center gap-10 select-none pb-8 text-slate-400">
            <div className="flex items-center gap-8">
              <div className="flex flex-col">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 opacity-70">Platform Integrity</p>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(i => <div key={i} className={`w-1.5 h-5 rounded-full ${i > 10 ? 'bg-slate-200 animate-pulse' : 'bg-emerald-400 shadow-[0_0_8px_#10b981]'}`} />)}
                </div>
              </div>
              <div className="w-px h-10 bg-slate-200 hidden md:block" />
              <div className="flex flex-col">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1 opacity-70">Global Uptime</p>
                <p className="text-xl font-black text-indigo-500">99.98% <span className="text-[10px] text-slate-400 ml-1">SLA_OK</span></p>
              </div>
            </div>

            <div className="flex gap-8 items-center opacity-60 hover:opacity-100 transition-opacity">
              <p className="text-[11px] font-black">© 2026 ANTIGRAVITY SYSTEMS • V.4.0.28-CORE</p>
              <div className="flex gap-4">
                <Globe size={16} />
                <Unplug size={16} />
                <Lock size={16} />
              </div>
            </div>
          </footer>
        </div>
      </main>

      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap');
          
          body {
            font-family: 'Outfit', sans-serif;
            background-color: #ffffff;
            margin: 0;
            overflow-x: hidden;
          }

          ::-webkit-scrollbar {
            width: 10px;
            height: 10px;
          }
          ::-webkit-scrollbar-track {
            background: #ffffff;
          }
          ::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 5px;
            border: 2px solid #ffffff;
          }
          ::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
          }

          .recharts-cartesian-grid-horizontal line,
          .recharts-cartesian-grid-vertical line {
            stroke: #e2e8f0;
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