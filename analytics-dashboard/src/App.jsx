import React, { useEffect, useState, useMemo, useRef } from 'react';
import axios from 'axios';
import {
  Search as SearchIcon,
  Activity,
  LayoutDashboard,
  Database,
  ShieldCheck,
  Bell,
  Settings,
  ChevronRight,
  Zap,
  Clock,
  ExternalLink,
  Globe,
  Radio,
  BarChart3,
  TrendingUp,
  MoreVertical,
  Cpu,
  Unplug,
  Server,
  Terminal,
  Filter,
  ArrowUpRight,
  Monitor,
  HardDrive,
  Network,
  Lock,
  MessageSquare,
  RefreshCw
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, Legend, PieChart, Pie, Cell,
  AreaChart, Area, LineChart, Line, ComposedChart,
  RadialBarChart, RadialBar, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

// --- PREMIUM SAMPLE DATA ---
const SAMPLE_DATA = [
  { id: 'ST-001', title: 'OpenAI announces new GPT-5 capabilities', category: 'Technology', datetime: new Date().toISOString(), source: 'TechCrunch', priority: 'High' },
  { id: 'ST-002', title: 'Global markets react to inflation data', category: 'Finance', datetime: new Date(Date.now() - 3600000).toISOString(), source: 'Bloomberg', priority: 'Medium' },
  { id: 'ST-003', title: 'Stunning goal in Champions League final', category: 'Sports', datetime: new Date(Date.now() - 7200000).toISOString(), source: 'ESPN', priority: 'Low' },
  { id: 'ST-004', title: 'New drug shows promise for heart health', category: 'Health', datetime: new Date(Date.now() - 10800000).toISOString(), source: 'Mayo Clinic', priority: 'High' },
  { id: 'ST-005', title: 'Hollywood legend returns to big screen', category: 'Entertainment', datetime: new Date(Date.now() - 14400000).toISOString(), source: 'Variety', priority: 'Medium' },
  { id: 'ST-006', title: 'Startup raises $100M for fusion energy', category: 'Technology', datetime: new Date(Date.now() - 18000000).toISOString(), source: 'CNBC', priority: 'High' },
];

const TRAFFIC_DATA = [
  { time: '00:00', events: 45, latency: 12, throughput: 30, cpu: 15, memory: 40, nodes: 4 },
  { time: '04:00', events: 32, latency: 15, throughput: 25, cpu: 12, memory: 42, nodes: 4 },
  { time: '08:00', events: 85, latency: 25, throughput: 60, cpu: 45, memory: 55, nodes: 6 },
  { time: '12:00', events: 120, latency: 22, throughput: 90, cpu: 85, memory: 70, nodes: 8 },
  { time: '16:00', events: 95, latency: 18, throughput: 75, cpu: 65, memory: 75, nodes: 8 },
  { time: '20:00', events: 65, latency: 14, throughput: 50, cpu: 30, memory: 65, nodes: 5 },
  { time: '23:59', events: 50, latency: 13, throughput: 35, cpu: 20, memory: 60, nodes: 4 },
];

const COLORS = ['#6366f1', '#6366f1', '#f59e0b', '#10b981', '#3b82f6'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 p-4 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.1)] border border-black/5 backdrop-blur-md">
        <p className="font-black text-xs text-slate-800 mb-2 border-b border-slate-100 pb-1">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center justify-between gap-4 my-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <p className="text-[10px] font-extrabold text-slate-500 uppercase">{entry.name}</p>
            </div>
            <p className="text-xs font-black text-slate-900">{entry.value}</p>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// --- COMPONENTS ---
const StatCard = ({ label, value, trend, color, icon: Icon }) => (
  <div className="bg-white p-2 rounded-md border border-slate-200 relative w-full transition-all hover:shadow-xl hover:-translate-y-1 group flex items-center gap-5 min-h-[110px]">
    <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: color }} />
    <div
      className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-md transition-transform group-hover:scale-110 flex-shrink-0"
      style={{ backgroundColor: color, boxShadow: `0 8px 20px ${color}33` }}
    >
      <Icon size={20} className="text-white fill-current" />
    </div>
    <div className="flex-grow">
      <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] mb-1 leading-none w-200">{label}</p>
      <div className="flex items-baseline gap-2 flex-wrap">
        <h3 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">{value}</h3>
        <span className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-lg ${trend.includes('+') || trend === 'STABLE' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'}`}>
          {trend}
        </span>
      </div>
    </div>
  </div>
);


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

      {/* --- SIDEBAR --- */}
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

      {/* --- MAIN --- */}
      <main className="lg:ml-80 flex-grow p-4 md:p-10 lg:p-8 transition-all">

        {/* Header */}
        <header className="flex flex-col lg:flex-row justify-between items-center gap-8 mb-8">
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

        {/* --- GRID --- */}
        <div className="grid grid-cols-12 gap-8">

          {/* Row 1: KPIs and Live Terminal */}
          <div className="col-span-12 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard label="Ingestion Throughput" value={newsData.length} trend="+24.2% / HR" color="#6366f1" icon={Zap} />
              <StatCard label="Pipeline Latency" value={isLive ? '12.4ms' : '0.2ms'} trend="STABLE" color="#ec4899" icon={Activity} />
              <StatCard label="Live Schemas" value={isLive ? '142' : '8'} trend="+12 NEW" color="#f59e0b" icon={Database} />
            </div>
          </div>

          {/* Row 2: Main Chart and Performance Summary */}
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
                <ComposedChart data={TRAFFIC_DATA}>
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

          {/* Row 3: Category Spread and World View */}
          <div className="col-span-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white p-10 rounded-[4.5rem] border border-slate-200 shadow-sm flex flex-col min-h-[500px]">
              <div className="flex justify-between items-start mb-10 px-2">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-2">Category Mix</h3>
                  <p className="text-slate-400 text-[11px] font-black uppercase tracking-widest">Volume distribution</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100"><Filter size={18} className="text-slate-400" /></div>
              </div>

              <div className="flex-grow flex items-center justify-center relative">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-20">
                  {categoryCounts.map((entry, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">{entry.name}</span>
                      <div className="w-6 h-2 rounded-full shadow-lg" style={{ backgroundColor: entry.fill }} />
                    </div>
                  ))}
                </div>
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart innerRadius="25%" outerRadius="120%" data={categoryCounts} startAngle={180} endAngle={-90} barSize={22}>
                      <RadialBar minAngle={15} background={{ fill: '#f8fafc' }} dataKey="value" radius={30} cornerRadius={20} />
                      <RechartsTooltip content={<CustomTooltip />} />
                    </RadialBarChart>
                  </ResponsiveContainer>
                </div>
                <div className="absolute top-[55%] left-[45%] -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                  <h4 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">{newsData.length}</h4>
                  <p className="text-indigo-600 font-black uppercase tracking-[0.4em] text-[10px] mt-3">Events</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 bg-white rounded-[4.5rem] border border-slate-200 overflow-hidden shadow-sm relative group p-12 flex flex-col">
              <div className="flex justify-between items-start mb-10 flex-wrap gap-6">
                <div>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tighter leading-none mb-3">Geographic Ingestion</h3>
                  <p className="text-slate-400 text-sm font-medium">Real-time load balancing across global edge nodes.</p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Nodes</p>
                    <p className="text-2xl font-black text-slate-900 leading-none tabular-nums">1,242</p>
                  </div>
                  <div className="w-px h-10 bg-slate-100" />
                  <div className="text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Global Sync</p>
                    <p className="text-2xl font-black text-emerald-500 leading-none tabular-nums">99.2%</p>
                  </div>
                </div>
              </div>

              <div className="flex-grow bg-slate-50 rounded-[3.5rem] border-2 border-slate-100 relative group overflow-hidden">
                <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#6366f1_1.5px,transparent_1.5px)] bg-[length:30px_30px]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Globe size={200} className="text-indigo-500/10 animate-pulse" />
                </div>

                {/* Fake Global Points */}
                {[
                  { t: 15, l: 30, n: 'LDN-01' }, { t: 40, l: 45, n: 'NYC-04' },
                  { t: 60, l: 20, n: 'SFO-02' }, { t: 25, l: 70, n: 'TYO-09' },
                  { t: 70, l: 60, n: 'SYD-03' }, { t: 50, l: 80, n: 'SIN-01' }
                ].map((pt, i) => (
                  <div key={i} className="absolute group/pt" style={{ top: `${pt.t}%`, left: `${pt.l}%` }}>
                    <div className="w-4 h-4 bg-indigo-500 rounded-full shadow-[0_0_20px_#6366f1] animate-pulse cursor-pointer transition-transform hover:scale-125" />
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[8px] font-black px-2 py-1 rounded-md opacity-0 group-hover/pt:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">{pt.n}: READY</div>
                  </div>
                ))}

                <div className="absolute bottom-8 right-8 flex items-center gap-3 bg-white/80 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/50 shadow-xl">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Network Density</span>
                    <span className="text-sm font-black text-slate-900">Critical (+42%)</span>
                  </div>
                  <ArrowUpRight size={20} className="text-emerald-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Row 4: Detailed Multi-Tab Table */}
          <div className="col-span-12 bg-white rounded-[5rem] border-2 border-slate-200 overflow-hidden shadow-2xl relative mt-8">
            <div className="p-10 md:p-14 border-b border-slate-100 flex flex-col 2xl:flex-row justify-between items-start 2xl:items-center gap-12 bg-slate-50/50">
              <div className="flex gap-6 items-center">
                <div className="w-20 h-20 bg-indigo-600 rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl shadow-indigo-600/30">
                  <Terminal size={32} />
                </div>
                <div>
                  <h3 className="text-4xl font-black text-slate-900 tracking-tighter leading-none mb-3">Live Platform Ledger</h3>
                  <p className="text-slate-500 font-bold flex items-center gap-2 text-sm">
                    Master partition <span className="text-indigo-600 font-black">X-OFFSET_241</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                    Integrity score: <span className="text-emerald-500 font-black">99.98%</span>
                  </p>
                </div>
              </div>

              <div className="flex bg-white p-3 rounded-[2.5rem] shadow-2xl border border-slate-200 gap-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-8 py-4 rounded-[1.8rem] text-[11px] font-black tracking-widest transition-all ${categoryFilter === cat ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/40 -translate-y-1' : 'text-slate-400 hover:bg-slate-50'
                      }`}
                  >
                    {cat.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[1200px]">
                <thead>
                  <tr className="bg-white">
                    <th className="px-12 py-10 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] w-32">Status</th>
                    <th className="px-12 py-10 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Resource ID</th>
                    <th className="px-12 py-10 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Payload Insight</th>
                    <th className="px-12 py-10 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] text-center">Protocol</th>
                    <th className="px-12 py-10 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] text-center">Priority</th>
                    <th className="px-12 py-10 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] text-right">Processed</th>
                    <th className="px-12 py-10 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] text-right w-16"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredData.slice(0, 15).map((row, i) => (
                    <tr key={row.id} className="group hover:bg-indigo-50/50 transition-all cursor-default relative overflow-hidden">
                      <td className="px-12 py-8 relative">
                        <div className="relative">
                          <div className="w-3.5 h-3.5 bg-emerald-500 rounded-full shadow-[0_0_15px_#10b981]" />
                          <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-20" />
                        </div>
                      </td>
                      <td className="px-12 py-8">
                        <p className="text-base font-black text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors tracking-tight">#{row.id}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{row.source || 'CLUSTER_A'}</p>
                      </td>
                      <td className="px-12 py-8 max-w-md">
                        <p className="text-sm font-black text-slate-700 leading-snug line-clamp-1 mb-2">{row.title}</p>
                        <div className="flex items-center gap-3">
                          <span className="px-2 py-0.5 bg-slate-100 text-[8px] font-black text-slate-500 rounded-md uppercase tracking-widest border border-slate-200">Schema_V2</span>
                          <span className="px-2 py-0.5 bg-indigo-50 text-[8px] font-black text-indigo-500 rounded-md uppercase tracking-widest border border-indigo-100">Encrypted</span>
                        </div>
                      </td>
                      <td className="px-12 py-8 text-center uppercase tracking-widest text-[9px] font-black">
                        <span className="px-4 py-1.5 bg-white border-2 border-slate-200 rounded-xl text-slate-500 shadow-sm group-hover:border-indigo-500 group-hover:text-indigo-600 transition-all">{row.category}</span>
                      </td>
                      <td className="px-12 py-8 text-center uppercase tracking-widest text-[9px] font-black">
                        <span className={`px-4 py-1.5 rounded-xl border-2 ${row.priority === 'High' ? 'bg-rose-50 border-rose-100 text-rose-500' : 'bg-amber-50 border-amber-100 text-amber-500'}`}>{row.priority || 'NORMAL'}</span>
                      </td>
                      <td className="px-12 py-8 text-right flex flex-col items-end">
                        <p className="text-lg font-black text-slate-800 leading-none mb-1 tabular-nums tracking-tighter">
                          {row.datetime ? new Date(row.datetime).toLocaleTimeString([], { hour12: false }) : 'LIVE'}
                        </p>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">TIMESTAMP</p>
                      </td>
                      <td className="px-12 py-8 text-right opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                        <button className="p-3 hover:bg-white rounded-2xl shadow-xl transition-all"><ChevronRight size={20} className="text-indigo-500" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-16 bg-slate-50 border-t border-slate-100 text-center relative overflow-hidden group/f">
              <div className="absolute inset-0 bg-indigo-600 translate-y-full group-hover/f:translate-y-0 transition-transform duration-700 pointer-events-none" />
              <button className="relative z-10 inline-flex items-center gap-4 px-12 py-6 border-4 border-slate-200 rounded-[2.5rem] bg-white text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 group-hover/f:text-white group-hover/f:border-white/20 group-hover/f:bg-transparent transition-all shadow-2xl hover:scale-105">
                Initiate Historical Audit <ArrowUpRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* --- FOOTER --- */}
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
      </main >

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
    </div >
  );
}

export default App;