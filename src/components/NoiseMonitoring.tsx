
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Waves, Shield, AlertTriangle, Zap } from 'lucide-react';

interface NoiseData {
  timestamp: string;
  level: number;
  deviceId: string;
  deviceName: string;
}

type NoiseStatus = 'normal' | 'good' | 'fair' | 'concern' | 'critical' | 'faulty';

interface NoiseHealth {
  status: NoiseStatus;
  level: number;
  statusText: string;
}

const NoiseMonitoring = () => {
  const [noiseData, setNoiseData] = useState<NoiseData[]>([]);
  const [currentHealth, setCurrentHealth] = useState<NoiseHealth>({
    status: 'normal',
    level: 42,
    statusText: 'Optimal Performance'
  });

  const getNoiseStatus = (level: number): { status: NoiseStatus; text: string; color: string; icon: any } => {
    if (level <= 30) return { 
      status: 'normal', 
      text: 'Optimal Performance', 
      color: '#10b981',
      icon: Shield
    };
    if (level <= 45) return { 
      status: 'good', 
      text: 'Good Condition', 
      color: '#22c55e',
      icon: Shield
    };
    if (level <= 60) return { 
      status: 'fair', 
      text: 'Fair Condition', 
      color: '#84cc16',
      icon: Waves
    };
    if (level <= 75) return { 
      status: 'concern', 
      text: 'Needs Attention', 
      color: '#f59e0b',
      icon: AlertTriangle
    };
    if (level <= 90) return { 
      status: 'critical', 
      text: 'Critical Level', 
      color: '#f97316',
      icon: Zap
    };
    return { 
      status: 'faulty', 
      text: 'System Fault', 
      color: '#ef4444',
      icon: Zap
    };
  };

  // Simulate live streaming noise data
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const newLevel = Math.random() * 100;
      
      const newDataPoint: NoiseData = {
        timestamp: now.toLocaleTimeString(),
        level: newLevel,
        deviceId: 'sensor-001',
        deviceName: 'Main Sensor'
      };

      setNoiseData(prev => {
        const updated = [...prev, newDataPoint];
        return updated.slice(-20);
      });

      const statusInfo = getNoiseStatus(newLevel);
      setCurrentHealth({
        status: statusInfo.status,
        level: Math.round(newLevel),
        statusText: statusInfo.text
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const currentStatusInfo = getNoiseStatus(currentHealth.level);
  const StatusIcon = currentStatusInfo.icon;

  const getHealthBadge = () => {
    return (
      <Badge 
        className="flex items-center text-white"
        style={{ backgroundColor: currentStatusInfo.color }}
      >
        <StatusIcon className="h-3 w-3 mr-1" />
        {currentHealth.statusText}
      </Badge>
    );
  };

  return (
    <Card className="border-2" style={{ borderColor: `${currentStatusInfo.color}20` }}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <Waves className="h-5 w-5 mr-2" />
            System Health Monitor
          </CardTitle>
          {getHealthBadge()}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Current Level Display */}
          <div className="text-center">
            <div className="text-4xl font-bold mb-2" style={{ color: currentStatusInfo.color }}>
              {currentHealth.level}%
            </div>
            <div className="text-sm text-muted-foreground mb-4">Current System Load</div>
            
            {/* Progress Bar */}
            <div className="relative">
              <Progress 
                value={currentHealth.level} 
                className="h-3"
                style={{ 
                  background: 'hsl(var(--muted))',
                }}
              />
              <div 
                className="absolute top-0 left-0 h-3 rounded-full transition-all duration-500"
                style={{ 
                  width: `${currentHealth.level}%`,
                  backgroundColor: currentStatusInfo.color,
                }}
              />
            </div>
          </div>

          {/* Status Indicators */}
          <div className="grid grid-cols-3 gap-3 text-xs">
            <div className="text-center p-2 bg-green-50 rounded-lg border">
              <div className="font-semibold text-green-700">0-30%</div>
              <div className="text-green-600">Optimal</div>
            </div>
            <div className="text-center p-2 bg-amber-50 rounded-lg border">
              <div className="font-semibold text-amber-700">31-75%</div>
              <div className="text-amber-600">Monitor</div>
            </div>
            <div className="text-center p-2 bg-red-50 rounded-lg border">
              <div className="font-semibold text-red-700">76-100%</div>
              <div className="text-red-600">Critical</div>
            </div>
          </div>

          {/* Real-time Chart */}
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={noiseData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis 
                  dataKey="timestamp" 
                  tick={{ fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  domain={[0, 100]} 
                  tick={{ fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  formatter={(value: number) => [`${value}%`, 'System Load']}
                  labelFormatter={(label) => `Time: ${label}`}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="level" 
                  stroke={currentStatusInfo.color}
                  strokeWidth={2}
                  dot={false}
                  name="System Load"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Connection Info */}
          <div className="text-xs text-muted-foreground text-center flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Live monitoring • Updated every 2 seconds</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NoiseMonitoring;
