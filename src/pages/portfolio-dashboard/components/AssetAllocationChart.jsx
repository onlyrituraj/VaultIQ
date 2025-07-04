import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';


const AssetAllocationChart = ({ data, isExpanded, onToggleExpand }) => {
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-surface border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium text-text-primary">{data.name}</p>
          <p className="text-sm text-text-secondary">
            Value: ${data.payload.value.toLocaleString()}
          </p>
          <p className="text-sm text-text-secondary">
            Allocation: {data.payload.percentage}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-surface border border-border rounded-xl p-6 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary">Asset Allocation</h3>
        <div className="flex items-center gap-2">
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
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={isExpanded ? 60 : 40}
              outerRadius={isExpanded ? 120 : 80}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            {isExpanded && <Legend />}
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      {!isExpanded && (
        <div className="mt-4 space-y-2">
          {data.slice(0, 3).map((asset, index) => (
            <div key={asset.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: COLORS[index] }}
                />
                <span className="text-sm text-text-primary">{asset.name}</span>
              </div>
              <span className="text-sm font-medium text-text-secondary">
                {asset.percentage}%
              </span>
            </div>
          ))}
          {data.length > 3 && (
            <div className="text-xs text-text-muted text-center pt-2">
              +{data.length - 3} more assets
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AssetAllocationChart;