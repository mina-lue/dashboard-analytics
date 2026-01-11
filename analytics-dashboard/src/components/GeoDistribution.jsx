import React, { useMemo } from 'react';
import {
    RadialBarChart,
    RadialBar,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Legend,
    Cell
} from 'recharts';
import { MapPin, Activity, Server, TrendingUp, Globe } from 'lucide-react';
import CustomTooltip from './CustomTooltip';

const GeoDistribution = ({ categoryCounts, totalEvents, analyticsStats, eventsLastHour }) => {
    // Calculate active nodes based on data volume (simulated but based on real metrics)
    const activeNodes = useMemo(() => {
        if (!totalEvents || totalEvents === 0) return 6;
        // Scale nodes based on total events (more events = more nodes handling them)
        const baseNodes = 6;
        const additionalNodes = Math.min(Math.floor(totalEvents / 500), 8);
        return baseNodes + additionalNodes;
    }, [totalEvents]);

    // Calculate global sync percentage based on data freshness
    const globalSync = useMemo(() => {
        if (eventsLastHour && eventsLastHour > 0) {
            // Higher sync if we're getting recent events
            return Math.min(95 + (eventsLastHour / 20), 99.9).toFixed(1);
        }
        return '98.5';
    }, [eventsLastHour]);

    // Calculate network density trend
    const networkDensity = useMemo(() => {
        if (!eventsLastHour || eventsLastHour === 0) return { value: 'Stable', percent: 0, color: 'text-slate-600' };
        const percent = Math.min(Math.floor(eventsLastHour / 5), 85);
        if (percent > 50) {
            return { value: 'High', percent, color: 'text-rose-600' };
        } else if (percent > 25) {
            return { value: 'Moderate', percent, color: 'text-amber-600' };
        }
        return { value: 'Low', percent, color: 'text-emerald-600' };
    }, [eventsLastHour]);

    // Enhanced node positions with more realistic distribution
    const edgeNodes = useMemo(() => {
        const nodes = [
            { name: 'LDN-01', lat: 51.5, lng: -0.1, region: 'Europe', status: 'ACTIVE' },
            { name: 'NYC-04', lat: 40.7, lng: -74.0, region: 'Americas', status: 'ACTIVE' },
            { name: 'SFO-02', lat: 37.7, lng: -122.4, region: 'Americas', status: 'ACTIVE' },
            { name: 'TYO-09', lat: 35.6, lng: 139.6, region: 'Asia', status: 'ACTIVE' },
            { name: 'SYD-03', lat: -33.8, lng: 151.2, region: 'Asia-Pacific', status: 'ACTIVE' },
            { name: 'SIN-01', lat: 1.3, lng: 103.8, region: 'Asia', status: 'ACTIVE' },
        ];
        
        // Add more nodes if we have high event volume
        if (activeNodes > 6) {
            nodes.push(
                { name: 'FRA-05', lat: 50.1, lng: 8.6, region: 'Europe', status: 'ACTIVE' },
                { name: 'DXB-07', lat: 25.2, lng: 55.2, region: 'Middle East', status: 'ACTIVE' }
            );
        }
        
        return nodes.slice(0, activeNodes);
    }, [activeNodes]);

    // Convert geographic coordinates to percentage positions for display
    const getNodePosition = (node) => {
        // Simple mapping: convert lat/lng to approximate screen position
        // Europe: top-left area, Americas: left-middle, Asia: right-middle, etc.
        const positions = {
            'LDN-01': { top: 20, left: 25 },
            'NYC-04': { top: 35, left: 20 },
            'SFO-02': { top: 40, left: 15 },
            'TYO-09': { top: 30, left: 75 },
            'SYD-03': { top: 70, left: 80 },
            'SIN-01': { top: 50, left: 70 },
            'FRA-05': { top: 25, left: 35 },
            'DXB-07': { top: 45, left: 55 },
        };
        return positions[node.name] || { top: 50, left: 50 };
    };

    // Prepare category chart data sorted by value
    const sortedCategoryData = useMemo(() => {
        if (!categoryCounts || categoryCounts.length === 0) return [];
        return [...categoryCounts]
            .sort((a, b) => b.value - a.value)
            .slice(0, 8); // Top 8 categories
    }, [categoryCounts]);

    if (!categoryCounts || categoryCounts.length === 0) {
        return (
            <div className="col-span-12 bg-white rounded-lg border border-slate-200 shadow-sm p-8">
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Geographic Distribution</h3>
                <p className="text-slate-500 text-center py-12">No category data available</p>
            </div>
        );
    }

    return (
        <div className="col-span-12 space-y-6">
            {/* Summary Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Total Events</p>
                        <Server size={16} className="text-indigo-500" />
                    </div>
                    <p className="text-2xl font-bold text-slate-900 tabular-nums">{totalEvents?.toLocaleString() || 0}</p>
                </div>
                <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Active Nodes</p>
                        <Activity size={16} className="text-emerald-500" />
                    </div>
                    <p className="text-2xl font-bold text-slate-900 tabular-nums">{activeNodes}</p>
                </div>
                <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Global Sync</p>
                        <TrendingUp size={16} className="text-blue-500" />
                    </div>
                    <p className="text-2xl font-bold text-emerald-600 tabular-nums">{globalSync}%</p>
                </div>
                <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Network Load</p>
                        <MapPin size={16} className="text-rose-500" />
                    </div>
                    <p className={`text-2xl font-bold tabular-nums ${networkDensity.color}`}>
                        {networkDensity.value}
                    </p>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Category Distribution Chart */}
                <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900">Category Distribution</h3>
                            <p className="text-xs text-slate-500 mt-1">By volume</p>
                        </div>
                    </div>

                    <div className="flex-1 min-h-[350px] flex flex-col">
                        <div className="flex-1" style={{ minHeight: '280px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <RadialBarChart 
                                    innerRadius="40%" 
                                    outerRadius="80%" 
                                    data={sortedCategoryData} 
                                    startAngle={180} 
                                    endAngle={0}
                                    barSize={16}
                                >
                                    <RadialBar 
                                        minAngle={10} 
                                        background={{ fill: '#f1f5f9' }} 
                                        dataKey="value" 
                                        cornerRadius={6}
                                    >
                                        {sortedCategoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </RadialBar>
                                    <RechartsTooltip content={<CustomTooltip />} />
                                </RadialBarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Legend */}
                        <div className="mt-4 pt-4 border-t border-slate-100">
                            <div className="grid grid-cols-2 gap-2">
                                {sortedCategoryData.slice(0, 6).map((item, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.fill }} />
                                            <span className="text-xs font-medium text-slate-700 truncate">{item.name}</span>
                                        </div>
                                        <span className="text-xs font-semibold text-slate-900 tabular-nums ml-2">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Geographic Map Visualization */}
                <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200 shadow-sm p-6 flex flex-col min-h-[500px]">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900">Global Edge Network</h3>
                            <p className="text-xs text-slate-500 mt-1">Real-time data ingestion points</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wide mb-1">Active Nodes</p>
                                <p className="text-xl font-bold text-slate-900 tabular-nums">{activeNodes}</p>
                            </div>
                            <div className="w-px h-8 bg-slate-200" />
                            <div className="text-right">
                                <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wide mb-1">Sync Rate</p>
                                <p className="text-xl font-bold text-emerald-600 tabular-nums">{globalSync}%</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 bg-gradient-to-br from-slate-50 to-indigo-50 rounded-lg border border-slate-200 relative overflow-hidden">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#6366f1_1px,transparent_1px)] bg-[length:40px_40px]" />
                        
                        {/* Central Globe Icon */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <Globe size={180} className="text-indigo-500/10" />
                        </div>

                        {/* Edge Nodes */}
                        {edgeNodes.map((node, index) => {
                            const pos = getNodePosition(node);
                            return (
                                <div 
                                    key={index} 
                                    className="absolute group cursor-pointer transition-transform hover:scale-125"
                                    style={{ top: `${pos.top}%`, left: `${pos.left}%` }}
                                >
                                    <div className="relative">
                                        <div className="w-4 h-4 bg-indigo-500 rounded-full shadow-[0_0_20px_#6366f1] animate-pulse" />
                                        <div className="absolute inset-0 bg-indigo-500 rounded-full animate-ping opacity-30" />
                                        
                                        {/* Tooltip on hover */}
                                        <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-medium px-3 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 shadow-lg">
                                            <div className="font-semibold mb-0.5">{node.name}</div>
                                            <div className="text-emerald-400 text-[9px]">{node.status}</div>
                                            <div className="text-slate-400 text-[9px] mt-0.5">{node.region}</div>
                                            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Network Density Indicator */}
                        <div className="absolute bottom-6 right-6 flex items-center gap-3 bg-white/95 backdrop-blur-sm px-4 py-3 rounded-lg border border-slate-200 shadow-lg">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wide mb-1">Network Load</span>
                                <span className={`text-sm font-bold ${networkDensity.color}`}>
                                    {networkDensity.value} ({networkDensity.percent}%)
                                </span>
                            </div>
                            <TrendingUp size={18} className={networkDensity.color} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Category Bar Chart */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900">Category Volume Analysis</h3>
                        <p className="text-xs text-slate-500 mt-1">Events by category</p>
                    </div>
                </div>
                <div className="h-80" style={{ minHeight: '320px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={sortedCategoryData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis 
                                dataKey="name" 
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#475569', fontSize: 11, fontWeight: 500 }}
                                angle={-30}
                                textAnchor="end"
                                height={80}
                            />
                            <YAxis 
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#475569', fontSize: 11, fontWeight: 500 }}
                                dx={-5}
                            />
                            <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: '#f1f5f9' }} />
                            <Legend 
                                wrapperStyle={{ paddingTop: '10px' }}
                                formatter={(value) => <span style={{ color: '#475569', fontSize: '12px', fontWeight: 500 }}>{value}</span>}
                                iconSize={12}
                            />
                            <Bar 
                                dataKey="value" 
                                radius={[4, 4, 0, 0]} 
                                name="Events"
                            >
                                {sortedCategoryData.map((entry, index) => (
                                    <Cell key={`bar-cell-${index}`} fill={entry.fill} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default GeoDistribution;
