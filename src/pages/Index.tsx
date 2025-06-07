import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Bell, Settings, Home, Thermometer, Plus, Calendar, BellOff } from 'lucide-react';
import DeviceCard from '@/components/DeviceCard';
import NotificationPanel from '@/components/NotificationPanel';
import AddDeviceModal from '@/components/AddDeviceModal';
import MaintenanceModal from '@/components/MaintenanceModal';
import { useToast } from '@/hooks/use-toast';

// Mock data for demonstration
const mockDevices = [
  {
    id: 1,
    name: 'Washing Machine',
    type: 'washer',
    status: 'Normal',
    location: 'Laundry Room',
    anomalyScore: 15,
    lastUpdated: new Date(),
    temperature: 68,
    vibration: 'Low',
    sound: 'Normal'
  },
  {
    id: 2,
    name: 'Dryer',
    type: 'dryer',
    status: 'Alert',
    location: 'Laundry Room',
    anomalyScore: 72,
    lastUpdated: new Date(),
    temperature: 85,
    vibration: 'High',
    sound: 'Elevated'
  },
  {
    id: 3,
    name: 'HVAC System',
    type: 'hvac',
    status: 'Normal',
    location: 'Basement',
    anomalyScore: 23,
    lastUpdated: new Date(),
    temperature: 72,
    vibration: 'Normal',
    sound: 'Quiet'
  },
  {
    id: 4,
    name: 'Dishwasher',
    type: 'dishwasher',
    status: 'Fault',
    location: 'Kitchen',
    anomalyScore: 89,
    lastUpdated: new Date(),
    temperature: 95,
    vibration: 'Very High',
    sound: 'Loud'
  }
];

const mockChartData = [
  { time: '00:00', score: 15 },
  { time: '04:00', score: 22 },
  { time: '08:00', score: 18 },
  { time: '12:00', score: 45 },
  { time: '16:00', score: 32 },
  { time: '20:00', score: 28 },
  { time: '24:00', score: 25 }
];

const mockNotifications = [
  {
    id: 1,
    type: 'alert',
    device: 'Dryer',
    message: 'Unusual vibration patterns detected',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: false
  },
  {
    id: 2,
    type: 'fault',
    device: 'Dishwasher',
    message: 'Critical temperature anomaly - immediate attention required',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    read: false
  },
  {
    id: 3,
    type: 'maintenance',
    device: 'HVAC System',
    message: 'Scheduled maintenance completed successfully',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    read: true
  }
];

const Index = () => {
  const [devices, setDevices] = useState(mockDevices);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAddDevice, setShowAddDevice] = useState(false);
  const [showMaintenance, setShowMaintenance] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [isOnline, setIsOnline] = useState(true);
  const { toast } = useToast();

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (isOnline) {
        setDevices(prevDevices => 
          prevDevices.map(device => ({
            ...device,
            anomalyScore: Math.max(0, Math.min(100, device.anomalyScore + (Math.random() - 0.5) * 10)),
            lastUpdated: new Date()
          }))
        );
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isOnline]);

  // Monitor network status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast({
        title: "Connection restored",
        description: "Real-time monitoring resumed",
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: "Offline mode",
        description: "Showing cached data",
        variant: "destructive"
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [toast]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Normal': return 'bg-green-500';
      case 'Alert': return 'bg-amber-500';
      case 'Fault': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const unreadNotifications = notifications.filter(n => !n.read).length;

  const handleDeviceClick = (device) => {
    setSelectedDevice(device);
    setShowMaintenance(true);
  };

  const handleAddDevice = (deviceData) => {
    const newDevice = {
      id: devices.length + 1,
      ...deviceData,
      status: 'Normal',
      anomalyScore: Math.floor(Math.random() * 30),
      lastUpdated: new Date(),
      temperature: 70,
      vibration: 'Normal',
      sound: 'Normal'
    };
    setDevices([...devices, newDevice]);
    toast({
      title: "Device added successfully",
      description: `${deviceData.name} is now being monitored`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border p-4 sticky top-0 z-50">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center space-x-2">
            <Home className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold text-foreground">allert.ai</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            {!isOnline && (
              <Badge variant="destructive" className="text-xs">
                Offline
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative"
            >
              {unreadNotifications > 0 ? <Bell className="h-5 w-5" /> : <BellOff className="h-5 w-5" />}
              {unreadNotifications > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-red-500">
                  {unreadNotifications}
                </Badge>
              )}
            </Button>
            
            <Button variant="ghost" size="sm">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto p-4 pb-20">
        {/* Status Overview */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">System Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {devices.filter(d => d.status === 'Normal').length}
                </div>
                <div className="text-sm text-muted-foreground">Normal</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-600">
                  {devices.filter(d => d.status === 'Alert').length}
                </div>
                <div className="text-sm text-muted-foreground">Alerts</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {devices.filter(d => d.status === 'Fault').length}
                </div>
                <div className="text-sm text-muted-foreground">Faults</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Anomaly Score Chart */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">24-Hour Anomaly Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Device List */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Connected Devices</h2>
            <Button
              onClick={() => setShowAddDevice(true)}
              size="sm"
              className="bg-primary text-primary-foreground"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Device
            </Button>
          </div>
          
          {devices.map((device) => (
            <DeviceCard
              key={device.id}
              device={device}
              onClick={() => handleDeviceClick(device)}
            />
          ))}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => setShowMaintenance(true)}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Maintenance
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => toast({
                title: "System Check Complete",
                description: "All devices are responding normally",
              })}
            >
              <Thermometer className="h-4 w-4 mr-2" />
              Run System Check
            </Button>
          </CardContent>
        </Card>
      </main>

      {/* Modals and Panels */}
      <NotificationPanel
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        notifications={notifications}
        onNotificationRead={(id) => {
          setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
          );
        }}
      />

      <AddDeviceModal
        isOpen={showAddDevice}
        onClose={() => setShowAddDevice(false)}
        onAddDevice={handleAddDevice}
      />

      <MaintenanceModal
        isOpen={showMaintenance}
        onClose={() => setShowMaintenance(false)}
        device={selectedDevice}
      />
    </div>
  );
};

export default Index;
