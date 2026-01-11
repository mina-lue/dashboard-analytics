import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import {
  Zap,
  Activity,
  Database,
  Globe
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
import CategoryBreakdown from './components/CategoryBreakdown';
import SummaryPanel from './components/SummaryPanel';

function App() {
  const [newsData, setNewsData] = useState([]);
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [activeTab, setActiveTab] = useState('Analytics Hub');
  const [pipelineLatency, setPipelineLatency] = useState(0);
  const [previousDataLength, setPreviousDataLength] = useState(0);
  const [analyticsStats, setAnalyticsStats] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      const startTime = performance.now();
      
      // Fetch news data and analytics in parallel
      const [newsRes, analyticsRes] = await Promise.all([
        axios.get('http://localhost:9081/api/news?size=100&sort=datetime,desc'),
        axios.get('http://localhost:9081/api/analytics/stats').catch(() => null) // Analytics is optional, don't fail if unavailable
      ]);
      
      const endTime = performance.now();
      const latency = Math.round((endTime - startTime) * 10) / 10; // Round to 1 decimal place
      setPipelineLatency(latency);
      setLastUpdated(Date.now());
      
      // Update analytics stats if available
      if (analyticsRes && analyticsRes.data) {
        setAnalyticsStats(analyticsRes.data);
      }
      
      if (newsRes.data.content && newsRes.data.content.length > 0) {
        // Sort by datetime descending to ensure newest first (in case API doesn't sort)
        const sortedData = [...newsRes.data.content].sort((a, b) => {
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
      console.error('Error fetching data:', err);
      setNewsData(SAMPLE_DATA);
      setIsLive(false);
      setLoading(false);
      setPipelineLatency(0);
    } finally {
      setIsRefreshing(false);
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
  // Use backend analytics if available, otherwise fallback to frontend calculation
  const ingestionThroughput = useMemo(() => {
    // Prefer backend analytics if available
    if (analyticsStats && analyticsStats.ingestionThroughput) {
      return Math.round(analyticsStats.ingestionThroughput);
    }
    
    // Fallback to frontend calculation if backend analytics not available
    if (!isLive || newsData.length === 0) return 0;
    
    // Get all items with valid datetime, sorted by newest first
    const itemsWithDate = newsData
      .filter(item => item.datetime)
      .map(item => new Date(item.datetime).getTime())
      .filter(ts => !isNaN(ts))
      .sort((a, b) => b - a); // Sort newest first (newest first)
    
    if (itemsWithDate.length === 0) {
      return 0;
    }
    
    const now = Date.now();
    const oneHourAgo = now - (60 * 60 * 1000);
    
    // Filter items from the last hour
    const recentItems = itemsWithDate.filter(ts => ts >= oneHourAgo);
    
    if (recentItems.length === 0) {
      // No items from the last hour - calculate rate from available items
      if (itemsWithDate.length < 2) {
        return 0;
      }
      
      // Use the time span between oldest and newest item to calculate rate
      const newestTime = itemsWithDate[0];
      const oldestTime = itemsWithDate[itemsWithDate.length - 1];
      const timeSpanMs = Math.max(newestTime - oldestTime, 60000); // At least 1 minute
      const timeSpanHours = timeSpanMs / (60 * 60 * 1000);
      
      if (timeSpanHours <= 0) return 0;
      
      // Calculate rate: total items / time span in hours
      const rate = itemsWithDate.length / timeSpanHours;
      return Math.round(rate);
    }
    
    // If we have exactly 100 items (page size limit) and they're all recent,
    // we might be hitting the page limit, so we need to estimate more accurately
    if (recentItems.length === 100 && newsData.length === 100) {
      // We likely hit the page limit - calculate rate from time span of items
      const newestTime = recentItems[0];
      const oldestTime = recentItems[recentItems.length - 1];
      const timeSpanMs = Math.max(newestTime - oldestTime, 60000); // At least 1 minute
      const timeSpanHours = timeSpanMs / (60 * 60 * 1000);
      
      if (timeSpanHours <= 0) {
        // All items have same/similar timestamp - assume they're from recent period
        // Estimate based on minimum time span (1 minute = 0.0167 hours)
        return Math.round(100 / 0.0167); // This will cap at 720 anyway
      }
      
      // Calculate actual rate based on time span
      const rate = recentItems.length / timeSpanHours;
      
      // Cap at theoretical maximum (720 items/hour = 1 every 5 seconds)
      return Math.min(Math.round(rate), 720);
    }
    
    // Normal case: items from last hour, but less than page limit
    // Use time span to calculate accurate rate
    if (recentItems.length >= 2) {
      const newestTime = recentItems[0];
      const oldestTime = recentItems[recentItems.length - 1];
      const timeSpanMs = Math.max(newestTime - oldestTime, 60000); // At least 1 minute
      const timeSpanHours = timeSpanMs / (60 * 60 * 1000);
      
      if (timeSpanHours > 0) {
        const rate = recentItems.length / timeSpanHours;
        return Math.min(Math.round(rate), 720);
      }
    }
    
    // Fallback: if only 1 item or can't calculate time span, use count
    // But extrapolate to hourly rate if it's within last hour
    if (recentItems.length === 1) {
      const itemAge = (now - recentItems[0]) / (60 * 60 * 1000); // Age in hours
      if (itemAge > 0 && itemAge < 1) {
        return Math.round(1 / itemAge); // Extrapolate to hourly rate
      }
    }
    
    return recentItems.length;
  }, [newsData, isLive, analyticsStats]);

  // Calculate unique schemas (categories) from actual data
  // Use backend analytics if available, otherwise fallback to frontend calculation
  const liveSchemas = useMemo(() => {
    // Prefer backend analytics if available
    if (analyticsStats && analyticsStats.uniqueCategories) {
      return analyticsStats.uniqueCategories;
    }
    
    // Fallback to frontend calculation
    if (!isLive || newsData.length === 0) return 8; // Default fallback
    const uniqueCategories = new Set(newsData.map(item => item.category).filter(Boolean));
    return uniqueCategories.size;
  }, [newsData, isLive, analyticsStats]);

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

  // Calculate throughput chart data from actual news data
  const throughputChartData = useMemo(() => {
    if (!isLive || newsData.length === 0) {
      // Return sample data if no live data
      return TRAFFIC_DATA;
    }

    // Group news items by hour buckets
    const now = new Date();
    const hoursAgo = 24; // Show last 24 hours
    const buckets = {};
    
    // Initialize buckets for the last 24 hours (7 representative hours)
    const hourLabels = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '23:59'];
    hourLabels.forEach(hour => {
      buckets[hour] = {
        time: hour,
        events: 0,
        latency: 0,
        throughput: 0,
        timestamps: []
      };
    });

    // Process news items and assign to nearest bucket
    newsData.forEach(item => {
      if (!item.datetime) return;
      
      const itemDate = new Date(item.datetime);
      const itemHour = itemDate.getHours();
      
      // Find the nearest bucket hour
      let nearestHour = hourLabels[0];
      let minDiff = Math.abs(itemHour - parseInt(nearestHour.split(':')[0]));
      
      hourLabels.forEach(hour => {
        const hourValue = parseInt(hour.split(':')[0]);
        const diff = Math.abs(itemHour - hourValue);
        if (diff < minDiff) {
          minDiff = diff;
          nearestHour = hour;
        }
      });
      
      if (buckets[nearestHour]) {
        buckets[nearestHour].events += 1;
        buckets[nearestHour].timestamps.push(itemDate.getTime());
      }
    });

    // Calculate latency and throughput for each bucket
    Object.values(buckets).forEach(bucket => {
      if (bucket.timestamps.length > 0) {
        // Use pipeline latency as a proxy for processing latency (convert ms to approximate seconds)
        // Add some variation based on bucket size
        const baseLatency = Math.round(pipelineLatency / 100); // Convert ms to approximate scale (0-20 range)
        bucket.latency = Math.max(10, Math.min(25, baseLatency + (bucket.events > 50 ? 5 : 0)));
        
        // Throughput = events per hour (events count in this bucket)
        bucket.throughput = bucket.events;
      } else {
        // For empty buckets, use minimal values
        bucket.latency = Math.round(pipelineLatency / 100) || 12;
        bucket.throughput = 0;
      }
    });

    // Convert to array and sort by time
    const chartDataArray = hourLabels.map(hour => ({
      time: buckets[hour].time,
      events: buckets[hour].events,
      latency: buckets[hour].latency,
      throughput: buckets[hour].throughput
    }));

    return chartDataArray.length > 0 ? chartDataArray : TRAFFIC_DATA;
  }, [newsData, isLive, pipelineLatency]);

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

        <div className="p-4 md:p-8 lg:p-8 max-w-[1800px] mx-auto w-full flex-grow flex flex-col min-h-0 overflow-x-hidden">
          <div className="grid grid-cols-12 gap-6 min-h-0 flex-1 w-full">
            {activeTab === 'Analytics Hub' && (
              <>
                

                {/* Row 1: KPIs */}
                <div className="col-span-12 mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard 
                      label="Ingestion Throughput" 
                      value={ingestionThroughput} 
                      trend={throughputTrend} 
                      color="#6366f1" 
                      icon={Zap}
                      description="Events processed per hour"
                    />
                    <StatCard 
                      label="Pipeline Latency" 
                      value={isLive ? `${pipelineLatency}ms` : '0.2ms'} 
                      trend={pipelineLatency < 100 ? 'STABLE' : pipelineLatency < 300 ? 'WARNING' : 'HIGH'} 
                      color="#ec4899" 
                      icon={Activity}
                      description="API response time"
                    />
                    <StatCard 
                      label="Live Schemas" 
                      value={isLive ? liveSchemas.toString() : '8'} 
                      trend={isLive && newsData.length > previousDataLength ? `+${Math.max(0, newsData.length - previousDataLength)} NEW` : '+0 NEW'} 
                      color="#f59e0b" 
                      icon={Database}
                      description="Active category types"
                    />
                    <StatCard 
                      label="Total Events" 
                      value={analyticsStats?.totalEvents?.toLocaleString() || newsData.length.toLocaleString()} 
                      trend={`${analyticsStats?.eventsLastHour || 0} /HR`} 
                      color="#10b981" 
                      icon={Globe}
                      description="All-time processed events"
                    />
                  </div>
                </div>

                {/* Row 2: Charts and Category Breakdown */}
                <div className="col-span-12 grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 w-full overflow-x-hidden">
                  <div className="min-w-0 w-full overflow-hidden">
                    <ThroughputChart data={throughputChartData} />
                  </div>
                  <div className="min-w-0 w-full overflow-hidden">
                    <CategoryBreakdown 
                      categoryDistribution={analyticsStats?.categoryDistribution}
                      totalEvents={analyticsStats?.totalEvents || newsData.length}
                    />
                  </div>
                  <div className="min-w-0 w-full overflow-hidden">
                    <SystemHealth
                      totalEvents={analyticsStats?.totalEvents || newsData.length}
                      eventsLastHour={analyticsStats?.eventsLastHour}
                      ingestionThroughput={ingestionThroughput}
                      pipelineLatency={pipelineLatency}
                    />
                  </div>
                </div>
              </>
            )}

            {activeTab === 'Live Pipeline' && (
              <>
                {/* Summary Panel for Live Pipeline */}
                <div className="col-span-12 mb-4">
                  <SummaryPanel
                    lastUpdated={lastUpdated}
                    isLive={isLive}
                    totalEvents={analyticsStats?.totalEvents || newsData.length}
                    eventsLastHour={analyticsStats?.eventsLastHour}
                    isRefreshing={isRefreshing}
                  />
                </div>

                {/* Live Ledger - Main Content */}
                <LiveLedger
                  data={filteredData}
                  categories={categories}
                  activeCategory={categoryFilter}
                  setCategory={setCategoryFilter}
                />
              </>
            )}

            {activeTab === 'Geographic Map' && (
              <GeoDistribution 
                categoryCounts={categoryCounts} 
                totalEvents={analyticsStats?.totalEvents || newsData.length}
                analyticsStats={analyticsStats}
                eventsLastHour={analyticsStats?.eventsLastHour || 0}
              />
            )}
          </div>
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