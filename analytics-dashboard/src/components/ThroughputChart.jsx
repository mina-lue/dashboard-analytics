import React, { useState, useMemo } from 'react';
import {
    ComposedChart,
    Line,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';
import CustomTooltip from './CustomTooltip';

const ThroughputChart = ({ data }) => {
    const [selectedView, setSelectedView] = useState('Hourly');

    // Transform data based on selected view
    const chartData = useMemo(() => {
        if (selectedView === 'Hourly') {
            // Return hourly data (original data)
            return data;
        } else if (selectedView === 'Daily') {
            // Aggregate to daily data - group hours into days
            // Sample data structure: split the hourly data into 2-3 day groups
            const days = ['Mon', 'Tue', 'Wed'];
            const itemsPerDay = Math.ceil(data.length / days.length);
            
            return days.map((day, dayIndex) => {
                const startIdx = dayIndex * itemsPerDay;
                const endIdx = Math.min(startIdx + itemsPerDay, data.length);
                const dayItems = data.slice(startIdx, endIdx);
                
                const totalEvents = dayItems.reduce((sum, item) => sum + (item.events || 0), 0);
                const avgLatency = dayItems.length > 0 
                    ? Math.round(dayItems.reduce((sum, item) => sum + (item.latency || 0), 0) / dayItems.length)
                    : 0;
                const avgThroughput = dayItems.length > 0
                    ? Math.round(dayItems.reduce((sum, item) => sum + (item.throughput || 0), 0) / dayItems.length)
                    : 0;
                
                return {
                    time: day,
                    events: totalEvents,
                    latency: avgLatency,
                    throughput: avgThroughput
                };
            });
        } else {
            // Weekly view - aggregate to weeks
            const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
            const itemsPerWeek = Math.ceil(data.length / weeks.length);
            
            return weeks.map((week, weekIndex) => {
                const startIdx = weekIndex * itemsPerWeek;
                const endIdx = Math.min(startIdx + itemsPerWeek, data.length);
                const weekItems = data.slice(startIdx, endIdx);
                
                const totalEvents = weekItems.reduce((sum, item) => sum + (item.events || 0), 0);
                const avgLatency = weekItems.length > 0
                    ? Math.round(weekItems.reduce((sum, item) => sum + (item.latency || 0), 0) / weekItems.length)
                    : 0;
                const avgThroughput = weekItems.length > 0
                    ? Math.round(weekItems.reduce((sum, item) => sum + (item.throughput || 0), 0) / weekItems.length)
                    : 0;
                
                return {
                    time: week,
                    events: totalEvents,
                    latency: avgLatency,
                    throughput: avgThroughput
                };
            });
        }
    }, [data, selectedView]);

    return (
        <div className="w-full bg-white rounded-lg border border-slate-200 shadow-sm relative overflow-hidden flex flex-col max-w-full" style={{ minHeight: '420px' }}>
            <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 flex-shrink-0">
                <h3 className="text-base font-semibold text-slate-900">Throughput Analytics</h3>
                <div className="flex bg-slate-100 p-1 rounded-lg gap-1">
                    {['Hourly', 'Daily', 'Weekly'].map(view => (
                        <button
                            key={view}
                            onClick={() => setSelectedView(view)}
                            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                                selectedView === view
                                    ? 'bg-indigo-600 text-white shadow-sm'
                                    : 'text-slate-600 hover:bg-slate-200'
                            }`}
                        >
                            {view}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 p-4 overflow-hidden" style={{ minHeight: '340px', height: '340px', width: '100%' }}>
                <div style={{ width: '100%', height: '100%', minHeight: '300px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={chartData} margin={{ top: 15, right: 15, left: 5, bottom: 25 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis
                                dataKey="time"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#475569', fontSize: 12, fontWeight: 500 }}
                                dy={10}
                                height={selectedView === 'Weekly' ? 40 : 60}
                                angle={selectedView === 'Weekly' ? 0 : -30}
                                textAnchor={selectedView === 'Weekly' ? 'middle' : 'end'}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#475569', fontSize: 12, fontWeight: 500 }}
                                dx={-5}
                                label={{ 
                                    value: 'Value', 
                                    angle: -90, 
                                    position: 'insideLeft', 
                                    style: { textAnchor: 'middle', fill: '#475569', fontSize: 13, fontWeight: 500 } 
                                }}
                            />
                            <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: '#f1f5f9' }} />
                            <Legend
                                wrapperStyle={{ paddingTop: '10px', paddingBottom: '5px' }}
                                iconType="line"
                                formatter={(value) => <span style={{ color: '#475569', fontSize: '13px', fontWeight: 500 }}>{value}</span>}
                                iconSize={12}
                            />
                            <Bar dataKey="events" fill="#cbd5e1" fillOpacity={0.7} radius={[4, 4, 0, 0]} name="Events" />
                            <Line
                                type="monotone"
                                dataKey="throughput"
                                stroke="#6366f1"
                                strokeWidth={2.5}
                                dot={{ r: 3, fill: '#6366f1', strokeWidth: 1.5, stroke: '#fff' }}
                                activeDot={{ r: 5, fill: '#6366f1' }}
                                name="Throughput"
                            />
                            <Line
                                type="monotone"
                                dataKey="latency"
                                stroke="#ec4899"
                                strokeWidth={2.5}
                                dot={{ r: 3, fill: '#ec4899', strokeWidth: 1.5, stroke: '#fff' }}
                                activeDot={{ r: 5, fill: '#ec4899' }}
                                name="Latency"
                            />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default ThroughputChart;
