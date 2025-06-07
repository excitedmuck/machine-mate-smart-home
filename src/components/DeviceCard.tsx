
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Thermometer, Bell } from 'lucide-react';

interface Device {
  id: number;
  name: string;
  type: string;
  status: string;
  location: string;
  anomalyScore: number;
  lastUpdated: Date;
  temperature: number;
  vibration: string;
  sound: string;
}

interface DeviceCardProps {
  device: Device;
  onClick: (device: Device) => void;
}

const DeviceCard: React.FC<DeviceCardProps> = ({ device, onClick }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Normal': return 'bg-green-100 text-green-800 border-green-200';
      case 'Alert': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Fault': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case 'Normal': return 'bg-green-500';
      case 'Alert': return 'bg-amber-500';
      case 'Fault': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'washer': return '🧺';
      case 'dryer': return '🌪️';
      case 'hvac': return '❄️';
      case 'dishwasher': return '🍽️';
      default: return '🔧';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card 
      className="cursor-pointer transition-all hover:shadow-md border-l-4 border-l-primary"
      onClick={() => onClick(device)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">{getDeviceIcon(device.type)}</div>
            <div>
              <h3 className="font-semibold text-foreground">{device.name}</h3>
              <p className="text-sm text-muted-foreground">{device.location}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className={`h-3 w-3 rounded-full ${getStatusDot(device.status)}`} />
            <Badge variant="outline" className={getStatusColor(device.status)}>
              {device.status}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-3">
          <div className="text-center">
            <div className="text-lg font-bold text-foreground">
              {Math.round(device.anomalyScore)}
            </div>
            <div className="text-xs text-muted-foreground">Anomaly Score</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1">
              <Thermometer className="h-4 w-4 text-muted-foreground" />
              <span className="text-lg font-bold text-foreground">{device.temperature}°F</span>
            </div>
            <div className="text-xs text-muted-foreground">Temperature</div>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Last updated: {formatTime(device.lastUpdated)}</span>
          {(device.status === 'Alert' || device.status === 'Fault') && (
            <Bell className="h-4 w-4 text-amber-500" />
          )}
        </div>

        {device.status !== 'Normal' && (
          <div className="mt-2 p-2 bg-amber-50 rounded-md border-l-2 border-amber-400">
            <div className="text-xs text-amber-800">
              <strong>Issues detected:</strong> {device.vibration} vibration, {device.sound} sound levels
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DeviceCard;
