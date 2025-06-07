import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Waves, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

interface NoiseData {
  timestamp: string;
  level: number;
  deviceId: string;
  deviceName: string;
}

interface NoiseHealth {
  status: 'healthy' | 'medium' | 'fault';
  level: number;
  threshold: {
    healthy: number;
    medium: number;
  };
}

const NoiseMonitoring = () => {
  const [noiseData, setNoiseData] = useState<NoiseData[]>([]);
  const [currentHealth, setCurrentHealth] = useState<NoiseHealth>({
    status: 'healthy',
    level: 42,
    threshold: {
      healthy: 50,
      medium: 75
    }
  });

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
        // Keep only last 20 data points
        return updated.slice(-20);
      });

      // Update health status based on noise level
      let status: 'healthy' | 'medium' | 'fault';
      if (newLevel <= currentHealth.threshold.healthy) {
        status = 'healthy';
      } else if (newLevel <= currentHealth.threshold.medium) {
        status = 'medium';
      } else {
        status = 'fault';
      }

      setCurrentHealth(prev => ({
        ...prev,
        status,
        level: Math.round(newLevel)
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [currentHealth.threshold]);

  const getHealthBadge = () => {
    switch (currentHealth.status) {
      case 'healthy':
        return (
          <Badge className="bg-green-500 flex items-center">
            <CheckCircle className="h-3 w-3 mr-1" />
            Healthy
          </Badge>
        );
      case 'medium':
        return (
          <Badge className="bg-amber-500 flex items-center">
            <TrendingUp className="h-3 w-3 mr-1" />
            Medium Risk
          </Badge>
        );
      case 'fault':
        return (
          <Badge variant="destructive" className="flex items-center">
            <AlertTriangle className="h-3 w-3 mr-1" />
            At Fault
          </Badge>
        );
    }
  };

  const getHealthColor = () => {
    switch (currentHealth.status) {
      case 'healthy': return '#22c55e';
      case 'medium': return '#f59e0b';
      case 'fault': return '#ef4444';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <Waves className="h-5 w-5 mr-2" />
            Live Noise Monitoring
          </CardTitle>
          {getHealthBadge()}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Current Status */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold" style={{ color: getHealthColor() }}>
                {currentHealth.level}dB
              </div>
              <div className="text-sm text-muted-foreground">Current Level</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {currentHealth.threshold.healthy}dB
              </div>
              <div className="text-sm text-muted-foreground">Healthy Limit</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-600">
                {currentHealth.threshold.medium}dB
              </div>
              <div className="text-sm text-muted-foreground">Medium Limit</div>
            </div>
          </div>

          {/* Real-time Chart */}
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={noiseData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="timestamp" 
                  tick={{ fontSize: 10 }}
                  interval="preserveStartEnd"
                />
                <YAxis domain={[0, 100]} />
                <Tooltip 
                  formatter={(value: number) => [`${value}dB`, 'Noise Level']}
                  labelFormatter={(label) => `Time: ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="level" 
                  stroke={getHealthColor()}
                  strokeWidth={2}
                  dot={{ fill: getHealthColor(), r: 3 }}
                  name="Noise Level"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Connection Info */}
          <div className="text-xs text-muted-foreground text-center">
            Live data from sensor-001 • Updated every 2 seconds
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NoiseMonitoring;
