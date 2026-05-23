export interface MetricConfig {
    id: string;
    title: string;
    accentColor: 'red' | 'green' | 'orange' | 'teal';
    accentPosition: 'bottom' | 'left';
    value: string;
    trendText: string;
    trendDirection: 'up' | 'down';
    trendColor: 'red' | 'green';
}