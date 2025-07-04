import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PerformanceChart = ({ data, isExpanded, onToggleExpand }) => {
  const [timeframe, setTimeframe] = useState('7d');
  
  const timeframes = [
    { label: '24H', value: '24h' },
    { label: '7D', value: '7d' },
    { label: '30D', value: '30d' },
    { label: '90D', value: '90d' },
    { label: '1Y', value: '1y' }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm text-text-secondary">{label}</p>
          <p className="font-medium text-text-primary">
            ${payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-surface border border-border rounded-xl p-6 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary">Portfolio Performance</h3>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-surface-secondary rounded-lg p-1">
            {timeframes.map((tf) => (
              <Button
                key={tf.value}
                variant={timeframe === tf.value ? "primary" : "ghost"}
                size="xs"
                onClick={() => setTimeframe(tf.value)}
                className="px-2 py-1"
              >
                {tf.label}
              </Button>
            ))}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleExpand}
            className="p-2"
          >
            <Icon name={isExpanded ? "Minimize2" : "Maximize2"} size={16} />
          </Button>
          <Button variant="ghost" size="sm" className="p-2">
            <Icon name="Settings" size={16} />
          </Button>
        </div>
      </div>
      
      <div className={`transition-all duration-300 ${isExpanded ? 'h-96' : 'h-64'}`}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="date" 
              stroke="var(--color-text-secondary)"
              fontSize={12}
            />
            <YAxis 
              stroke="var(--color-text-secondary)"
              fontSize={12}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="var(--color-primary)" 
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: "var(--color-primary)" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-sm text-text-secondary">Highest</div>
          <div className="font-semibold text-success">$156,789</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-text-secondary">Lowest</div>
          <div className="font-semibold text-error">$98,234</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-text-secondary">Average</div>
          <div className="font-semibold text-text-primary">$127,456</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-text-secondary">Volatility</div>
          <div className="font-semibold text-warning">12.4%</div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceChart;