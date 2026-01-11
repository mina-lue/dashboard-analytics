export const SAMPLE_DATA = [
    { id: 'ST-001', title: 'OpenAI announces new GPT-5 capabilities', category: 'Technology', datetime: new Date().toISOString(), source: 'TechCrunch', priority: 'High' },
    { id: 'ST-002', title: 'Global markets react to inflation data', category: 'Finance', datetime: new Date(Date.now() - 3600000).toISOString(), source: 'Bloomberg', priority: 'Medium' },
    { id: 'ST-003', title: 'Stunning goal in Champions League final', category: 'Sports', datetime: new Date(Date.now() - 7200000).toISOString(), source: 'ESPN', priority: 'Low' },
    { id: 'ST-004', title: 'New drug shows promise for heart health', category: 'Health', datetime: new Date(Date.now() - 10800000).toISOString(), source: 'Mayo Clinic', priority: 'High' },
    { id: 'ST-005', title: 'Hollywood legend returns to big screen', category: 'Entertainment', datetime: new Date(Date.now() - 14400000).toISOString(), source: 'Variety', priority: 'Medium' },
    { id: 'ST-006', title: 'Startup raises $100M for fusion energy', category: 'Technology', datetime: new Date(Date.now() - 18000000).toISOString(), source: 'CNBC', priority: 'High' },
];

export const TRAFFIC_DATA = [
    { time: '00:00', events: 45, latency: 12, throughput: 30, cpu: 15, memory: 40, nodes: 4 },
    { time: '04:00', events: 32, latency: 15, throughput: 25, cpu: 12, memory: 42, nodes: 4 },
    { time: '08:00', events: 85, latency: 25, throughput: 60, cpu: 45, memory: 55, nodes: 6 },
    { time: '12:00', events: 120, latency: 22, throughput: 90, cpu: 85, memory: 70, nodes: 8 },
    { time: '16:00', events: 95, latency: 18, throughput: 75, cpu: 65, memory: 75, nodes: 8 },
    { time: '20:00', events: 65, latency: 14, throughput: 50, cpu: 30, memory: 65, nodes: 5 },
    { time: '23:59', events: 50, latency: 13, throughput: 35, cpu: 20, memory: 60, nodes: 4 },
];

export const COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ef4444', '#14b8a6', '#f97316'];
