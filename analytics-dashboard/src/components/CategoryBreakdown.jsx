import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { TrendingUp } from 'lucide-react';
import CustomTooltip from './CustomTooltip';

const CategoryBreakdown = ({ categoryDistribution, totalEvents }) => {
    // Convert category distribution map to chart data
    const chartData = React.useMemo(() => {
        if (!categoryDistribution || Object.keys(categoryDistribution).length === 0) {
            return [];
        }
        
        const colors = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ef4444'];
        
        return Object.entries(categoryDistribution)
            .sort((a, b) => b[1] - a[1]) // Sort by count descending
            .slice(0, 6) // Top 6 categories
            .map(([name, value], index) => ({
                name,
                value: Number(value),
                fill: colors[index % colors.length],
                percentage: totalEvents > 0 ? ((Number(value) / totalEvents) * 100).toFixed(1) : 0
            }));
    }, [categoryDistribution, totalEvents]);

    if (chartData.length === 0) {
        return (
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
                <h3 className="text-base font-semibold text-slate-900 mb-4">Category Distribution</h3>
                <div className="text-center py-8 text-slate-400 text-sm">No category data available</div>
            </div>
        );
    }

    return (
        <div className="w-full bg-white rounded-lg border border-slate-200 shadow-sm p-4 flex flex-col overflow-hidden max-w-full" style={{ minHeight: '420px' }}>
            <div className="flex items-center justify-between mb-4 flex-shrink-0">
                <div>
                    <h3 className="text-sm font-semibold text-slate-900">Category Distribution</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Top categories by volume</p>
                </div>
                <div className="p-2 bg-indigo-50 rounded-lg">
                    <TrendingUp size={16} className="text-indigo-600" />
                </div>
            </div>

            <div className="flex-1" style={{ minHeight: '260px', height: '260px' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percentage }) => `${name} (${percentage}%)`}
                            outerRadius={Math.min(70, 60)}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                        </Pie>
                        <RechartsTooltip content={<CustomTooltip />} />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100 flex-shrink-0">
                <div className="grid grid-cols-2 gap-2">
                    {chartData.slice(0, 4).map((item, index) => (
                        <div key={index} className="flex items-center justify-between min-w-0">
                            <div className="flex items-center gap-1.5 min-w-0 flex-1">
                                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.fill }} />
                                <span className="text-xs font-medium text-slate-700 truncate min-w-0">{item.name}</span>
                            </div>
                            <span className="text-xs font-semibold text-slate-900 tabular-nums ml-2 flex-shrink-0">{item.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CategoryBreakdown;
