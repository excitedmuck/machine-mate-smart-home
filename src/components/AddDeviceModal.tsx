
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Wifi, CheckCircle } from 'lucide-react';

interface AddDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddDevice: (device: any) => void;
}

const AddDeviceModal: React.FC<AddDeviceModalProps> = ({
  isOpen,
  onClose,
  onAddDevice
}) => {
  const [step, setStep] = useState(1);
  const [deviceData, setDeviceData] = useState({
    name: '',
    type: '',
    location: '',
    brand: '',
    model: ''
  });
  const [isConnecting, setIsConnecting] = useState(false);

  if (!isOpen) return null;

  const deviceTypes = [
    { value: 'washer', label: 'Washing Machine', icon: '🧺' },
    { value: 'dryer', label: 'Dryer', icon: '🌪️' },
    { value: 'hvac', label: 'HVAC System', icon: '❄️' },
    { value: 'dishwasher', label: 'Dishwasher', icon: '🍽️' },
    { value: 'refrigerator', label: 'Refrigerator', icon: '🧊' },
    { value: 'water-heater', label: 'Water Heater', icon: '🔥' }
  ];

  const locations = [
    'Kitchen',
    'Laundry Room',
    'Basement',
    'Garage',
    'Utility Room',
    'Bathroom',
    'Attic'
  ];

  const handleNext = () => {
    if (step === 1 && deviceData.name && deviceData.type && deviceData.location) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
      simulateConnection();
    }
  };

  const simulateConnection = () => {
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      setStep(4);
    }, 3000);
  };

  const handleComplete = () => {
    onAddDevice(deviceData);
    handleClose();
  };

  const handleClose = () => {
    setStep(1);
    setDeviceData({
      name: '',
      type: '',
      location: '',
      brand: '',
      model: ''
    });
    setIsConnecting(false);
    onClose();
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="device-name">Device Name</Label>
        <Input
          id="device-name"
          placeholder="e.g., Kitchen Dishwasher"
          value={deviceData.name}
          onChange={(e) => setDeviceData({ ...deviceData, name: e.target.value })}
        />
      </div>

      <div>
        <Label htmlFor="device-type">Device Type</Label>
        <Select
          value={deviceData.type}
          onValueChange={(value) => setDeviceData({ ...deviceData, type: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select device type" />
          </SelectTrigger>
          <SelectContent>
            {deviceTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                <span className="flex items-center space-x-2">
                  <span>{type.icon}</span>
                  <span>{type.label}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="device-location">Location</Label>
        <Select
          value={deviceData.location}
          onValueChange={(value) => setDeviceData({ ...deviceData, location: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select location" />
          </SelectTrigger>
          <SelectContent>
            {locations.map((location) => (
              <SelectItem key={location} value={location}>
                {location}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="device-brand">Brand (Optional)</Label>
        <Input
          id="device-brand"
          placeholder="e.g., Whirlpool, GE, Samsung"
          value={deviceData.brand}
          onChange={(e) => setDeviceData({ ...deviceData, brand: e.target.value })}
        />
      </div>

      <div>
        <Label htmlFor="device-model">Model (Optional)</Label>
        <Input
          id="device-model"
          placeholder="e.g., WTW4816FW"
          value={deviceData.model}
          onChange={(e) => setDeviceData({ ...deviceData, model: e.target.value })}
        />
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Setup Instructions</h4>
        <ol className="text-sm text-blue-800 space-y-1">
          <li>1. Ensure your device is powered on</li>
          <li>2. Place the AI sensor near your device</li>
          <li>3. Make sure your phone is connected to WiFi</li>
          <li>4. Tap "Connect Device" to begin pairing</li>
        </ol>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="text-center space-y-4">
      <Wifi className={`h-16 w-16 mx-auto ${isConnecting ? 'animate-pulse text-blue-500' : 'text-gray-400'}`} />
      <div>
        <h3 className="text-lg font-semibold">
          {isConnecting ? 'Connecting to device...' : 'Ready to connect'}
        </h3>
        <p className="text-sm text-muted-foreground mt-2">
          {isConnecting 
            ? 'Please wait while we establish connection with your device'
            : 'Tap the button below to start the connection process'
          }
        </p>
      </div>
      {isConnecting && (
        <div className="space-y-2">
          <div className="text-sm text-blue-600">Detecting device...</div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
          </div>
        </div>
      )}
    </div>
  );

  const renderStep4 = () => (
    <div className="text-center space-y-4">
      <CheckCircle className="h-16 w-16 mx-auto text-green-500" />
      <div>
        <h3 className="text-lg font-semibold text-green-600">Device Connected!</h3>
        <p className="text-sm text-muted-foreground mt-2">
          {deviceData.name} is now being monitored by MachineMate
        </p>
      </div>
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-medium text-green-900 mb-2">What's Next?</h4>
        <ul className="text-sm text-green-800 space-y-1">
          <li>• Real-time monitoring has started</li>
          <li>• You'll receive alerts for any anomalies</li>
          <li>• AI learning begins to understand your device</li>
        </ul>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-lg">
            Add New Device ({step}/4)
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={handleClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}

          <div className="flex justify-between">
            {step > 1 && step < 4 && (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                Back
              </Button>
            )}
            
            <div className="ml-auto">
              {step < 3 && (
                <Button 
                  onClick={handleNext}
                  disabled={step === 1 && (!deviceData.name || !deviceData.type || !deviceData.location)}
                >
                  {step === 2 ? 'Connect Device' : 'Next'}
                </Button>
              )}
              
              {step === 4 && (
                <Button onClick={handleComplete} className="bg-green-600 hover:bg-green-700">
                  Complete Setup
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddDeviceModal;
