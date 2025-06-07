
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Phone, X, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Device {
  id: number;
  name: string;
  type: string;
  status: string;
  location: string;
}

interface MaintenanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  device: Device | null;
}

const MaintenanceModal: React.FC<MaintenanceModalProps> = ({
  isOpen,
  onClose,
  device
}) => {
  const [selectedSlot, setSelectedSlot] = useState('');
  const [isScheduling, setIsScheduling] = useState(false);
  const [isScheduled, setIsScheduled] = useState(false);
  const { toast } = useToast();

  if (!isOpen) return null;

  const timeSlots = [
    { id: '1', date: 'Today', time: '2:00 PM - 4:00 PM', available: false },
    { id: '2', date: 'Today', time: '4:00 PM - 6:00 PM', available: true },
    { id: '3', date: 'Tomorrow', time: '9:00 AM - 11:00 AM', available: true },
    { id: '4', date: 'Tomorrow', time: '11:00 AM - 1:00 PM', available: true },
    { id: '5', date: 'Tomorrow', time: '2:00 PM - 4:00 PM', available: false },
    { id: '6', date: 'Dec 10', time: '9:00 AM - 11:00 AM', available: true },
    { id: '7', date: 'Dec 10', time: '1:00 PM - 3:00 PM', available: true },
    { id: '8', date: 'Dec 11', time: '10:00 AM - 12:00 PM', available: true }
  ];

  const technicians = [
    {
      id: 1,
      name: 'Mike Rodriguez',
      rating: 4.9,
      specialties: ['HVAC', 'Washers', 'Dryers'],
      distance: '2.3 miles',
      phone: '(555) 123-4567'
    },
    {
      id: 2,
      name: 'Sarah Chen',
      rating: 4.8,
      specialties: ['Dishwashers', 'Refrigerators', 'Water Heaters'],
      distance: '3.1 miles',
      phone: '(555) 987-6543'
    },
    {
      id: 3,
      name: 'David Thompson',
      rating: 4.7,
      specialties: ['All Appliances', 'Emergency Service'],
      distance: '4.2 miles',
      phone: '(555) 456-7890'
    }
  ];

  const handleSchedule = () => {
    if (!selectedSlot) return;
    
    setIsScheduling(true);
    setTimeout(() => {
      setIsScheduling(false);
      setIsScheduled(true);
      toast({
        title: "Maintenance Scheduled",
        description: `Your ${device?.name} service has been scheduled successfully`,
      });
    }, 2000);
  };

  const handleClose = () => {
    setSelectedSlot('');
    setIsScheduling(false);
    setIsScheduled(false);
    onClose();
  };

  const getUrgencyLevel = (status: string) => {
    switch (status) {
      case 'Fault': return { level: 'Emergency', color: 'bg-red-100 text-red-800 border-red-200' };
      case 'Alert': return { level: 'High Priority', color: 'bg-amber-100 text-amber-800 border-amber-200' };
      default: return { level: 'Routine', color: 'bg-green-100 text-green-800 border-green-200' };
    }
  };

  if (isScheduled) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center space-y-4">
            <CheckCircle className="h-16 w-16 mx-auto text-green-500" />
            <h3 className="text-xl font-semibold text-green-600">Service Scheduled!</h3>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Your appointment for <strong>{device?.name}</strong> has been confirmed
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-center space-x-2 text-green-800">
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">Tomorrow, 9:00 AM - 11:00 AM</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-green-800 mt-1">
                  <Phone className="h-4 w-4" />
                  <span>Mike Rodriguez - (555) 123-4567</span>
                </div>
              </div>
            </div>
            <Button onClick={handleClose} className="w-full">
              Done
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const urgency = device ? getUrgencyLevel(device.status) : { level: 'Routine', color: 'bg-gray-100' };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
      <div className="bg-background w-full max-w-md mx-auto rounded-t-xl max-h-[90vh] overflow-hidden">
        <Card className="rounded-t-xl border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg">Schedule Maintenance</CardTitle>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          
          <CardContent className="max-h-[80vh] overflow-y-auto space-y-4">
            {device && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{device.name}</h3>
                  <Badge variant="outline" className={urgency.color}>
                    {urgency.level}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{device.location}</span>
                </div>
              </div>
            )}

            <div>
              <h4 className="font-medium mb-3">Available Time Slots</h4>
              <div className="space-y-2">
                {timeSlots.map((slot) => (
                  <button
                    key={slot.id}
                    disabled={!slot.available}
                    onClick={() => setSelectedSlot(slot.id)}
                    className={`w-full p-3 rounded-lg border text-left transition-colors ${
                      slot.available
                        ? selectedSlot === slot.id
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border bg-background hover:bg-gray-50'
                        : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">{slot.date}</div>
                        <div className="text-sm opacity-90">{slot.time}</div>
                      </div>
                      {!slot.available && (
                        <Badge variant="secondary" className="text-xs">
                          Unavailable
                        </Badge>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Recommended Technicians</h4>
              <div className="space-y-3">
                {technicians.slice(0, 2).map((tech) => (
                  <div key={tech.id} className="border rounded-lg p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h5 className="font-medium">{tech.name}</h5>
                        <div className="flex items-center space-x-1">
                          <div className="flex text-yellow-400">
                            {'★'.repeat(Math.floor(tech.rating))}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {tech.rating}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{tech.distance}</div>
                        <div className="text-xs text-muted-foreground">away</div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {tech.specialties.map((specialty) => (
                        <Badge key={specialty} variant="secondary" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t">
              <Button
                onClick={handleSchedule}
                disabled={!selectedSlot || isScheduling}
                className="w-full bg-primary text-primary-foreground"
              >
                {isScheduling ? (
                  <div className="flex items-center space-x-2">
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Scheduling...</span>
                  </div>
                ) : (
                  <>
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Service
                  </>
                )}
              </Button>
              
              {device?.status === 'Fault' && (
                <Button variant="outline" className="w-full mt-2 text-red-600 border-red-600">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Emergency Service
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MaintenanceModal;
