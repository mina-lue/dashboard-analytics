import React, { useMemo } from 'react';
import { Cpu, Database, Zap, Server } from 'lucide-react';

const SystemHealth = ({ totalEvents, eventsLastHour, ingestionThroughput, pipelineLatency }) => {
    // Calculate system health metrics based on actual data
    const healthMetrics = useMemo(() => {
        // Calculate load based on throughput (max 720 items/hour theoretical)
        const maxThroughput = 720;
        const throughputLoad = ingestionThroughput > 0 
            ? Math.min(Math.round((ingestionThroughput / maxThroughput) * 100), 100)
            : 10;
        
        // Calculate memory pool based on total events (scaled)
        const memoryLoad = totalEvents > 0
            ? Math.min(Math.round((totalEvents / 10000) * 100), 95)
            : 15;
        
        // Calculate storage load based on recent activity
        const storageLoad = eventsLastHour > 0
            ? Math.min(Math.round((eventsLastHour / 500) * 100), 90)
            : 12;
        
        // Overall system load (average)
        const globalLoad = Math.round((throughputLoad + memoryLoad + storageLoad) / 3);

        return {
            globalLoad,
            clusterCpu: throughputLoad,
            memoryPool: memoryLoad,
            storageNode: storageLoad
        };
    }, [totalEvents, eventsLastHour, ingestionThroughput]);

    const { globalLoad, clusterCpu, memoryPool, storageNode } = healthMetrics;

    return (
        <div className="w-full bg-[#0f172a] rounded-lg border border-slate-800 shadow-lg relative overflow-hidden flex flex-col p-4 max-w-full" style={{ minHeight: '420px' }}>
            <div className="absolute inset-0 bg-[radial-gradient(#6366f1_1px,transparent_1px)] opacity-10 [background-size:24px_24px]" />
            <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-center mb-6">
                    <div className="p-3 bg-white/10 rounded-xl border border-white/10 backdrop-blur-md">
                        <Cpu className="text-indigo-400" size={24} />
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide leading-none mb-1">System Load</p>
                        <h4 className="text-3xl font-bold text-white leading-none tabular-nums">{globalLoad}%</h4>
                    </div>
                </div>
                
                <div className="space-y-4 flex-1 min-h-0 overflow-y-auto">
                    {[
                        { 
                            label: 'Throughput Load', 
                            val: clusterCpu, 
                            color: '#6366f1',
                            icon: Zap,
                            description: `${ingestionThroughput || 0} items/hr`
                        },
                        { 
                            label: 'Data Pool', 
                            val: memoryPool, 
                            color: '#ec4899',
                            icon: Database,
                            description: `${totalEvents?.toLocaleString() || 0} events`
                        },
                        { 
                            label: 'Storage Node', 
                            val: storageNode, 
                            color: '#10b981',
                            icon: Server,
                            description: `${eventsLastHour || 0} last hour`
                        }
                    ].map((bar, i) => {
                        const Icon = bar.icon;
                        const isHealthy = bar.val < 70;
                        const isWarning = bar.val >= 70 && bar.val < 85;
                        const isCritical = bar.val >= 85;
                        
                        return (
                            <div key={i}>
                                <div className="flex justify-between items-center mb-2">
                                    <div className="flex items-center gap-2">
                                        <Icon size={14} className={`${isHealthy ? 'text-emerald-400' : isWarning ? 'text-amber-400' : 'text-rose-400'}`} />
                                        <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{bar.label}</span>
                                    </div>
                                    <div className="text-right">
                                        <span className={`text-sm font-bold tabular-nums ${isHealthy ? 'text-white' : isWarning ? 'text-amber-400' : 'text-rose-400'}`}>
                                            {bar.val}%
                                        </span>
                                    </div>
                                </div>
                                <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5 mb-1">
                                    <div 
                                        className="h-full rounded-full transition-all duration-1000" 
                                        style={{ 
                                            width: `${bar.val}%`, 
                                            backgroundColor: bar.color, 
                                            boxShadow: `0 0 12px ${bar.color}88` 
                                        }} 
                                    />
                                </div>
                                <p className="text-[9px] text-slate-500 font-medium">{bar.description}</p>
                            </div>
                        );
                    })}
                </div>
                
                <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">Pipeline Latency</span>
                        <span className={`text-sm font-bold tabular-nums ${
                            pipelineLatency < 50 ? 'text-emerald-400' : 
                            pipelineLatency < 200 ? 'text-amber-400' : 
                            'text-rose-400'
                        }`}>
                            {pipelineLatency || 0}ms
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SystemHealth;
