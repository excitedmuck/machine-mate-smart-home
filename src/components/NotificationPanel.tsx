
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, AlertTriangle, AlertCircle, CheckCircle, Calendar } from 'lucide-react';

interface Notification {
  id: number;
  type: string;
  device: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onNotificationRead: (id: number) => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({
  isOpen,
  onClose,
  notifications,
  onNotificationRead
}) => {
  if (!isOpen) return null;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'alert': return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'fault': return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'maintenance': return <Calendar className="h-5 w-5 text-blue-500" />;
      default: return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'alert': return 'border-l-amber-500 bg-amber-50';
      case 'fault': return 'border-l-red-500 bg-red-50';
      case 'maintenance': return 'border-l-blue-500 bg-blue-50';
      default: return 'border-l-green-500 bg-green-50';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
      <div className="bg-background w-full max-w-md mx-auto rounded-t-xl max-h-[80vh] overflow-hidden">
        <Card className="rounded-t-xl border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg">Notifications</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          
          <CardContent className="max-h-96 overflow-y-auto space-y-3">
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
                <p>All clear! No notifications.</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg border-l-4 cursor-pointer transition-opacity ${
                    getNotificationColor(notification.type)
                  } ${notification.read ? 'opacity-60' : 'opacity-100'}`}
                  onClick={() => onNotificationRead(notification.id)}
                >
                  <div className="flex items-start space-x-3">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-sm text-foreground">
                          {notification.device}
                        </p>
                        <div className="flex items-center space-x-2">
                          {!notification.read && (
                            <div className="h-2 w-2 bg-primary rounded-full" />
                          )}
                          <span className="text-xs text-muted-foreground">
                            {formatTimeAgo(notification.timestamp)}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-foreground">{notification.message}</p>
                      
                      {notification.type === 'fault' && (
                        <Button size="sm" className="mt-2 bg-red-600 hover:bg-red-700 text-white">
                          Schedule Emergency Service
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotificationPanel;
