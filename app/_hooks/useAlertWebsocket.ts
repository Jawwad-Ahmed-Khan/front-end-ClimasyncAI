import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/app/_lib/auth/useAuth';
import type { Alert } from '@/app/admin/_lib/adminTypes'; // Adjust path if necessary

interface WebSocketEnvelope {
    event: string;
    data: {
        breach_id: string;
        disaster_kind: string;
        location_name: string;
        severity: number;
        detected_at?: string;
        description?: string;
        latitude?: number;
        longitude?: number;
        district?: string;
        province?: string;
    }
}

export function useAlertWebsocket(backendUrl: string = 'ws://localhost:8000') {
    const { user } = useAuth();
    const [realtimeAlerts, setRealtimeAlerts] = useState<Alert[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const wsRef = useRef<WebSocket | null>(null);

    const connect = useCallback(() => {
        // Only connect if user is authenticated and token is available
        const token = localStorage.getItem('climasync_access_token');
        if (!token) {
            setError('No access token found');
            return;
        }

        // Check user role here to ensure they are admin before connecting
        if (user && user.role !== 'admin' && user.role !== 'super_admin') {
            setError('Unauthorized: Admin access required for real-time alerts');
            return;
        }

        if (wsRef.current?.readyState === WebSocket.OPEN) {
            return;
        }

        try {
            const ws = new WebSocket(`${backendUrl}/ws/alerts?token=${token}`);

            ws.onopen = () => {
                setIsConnected(true);
                setError(null);
                console.log('WebSocket connected to alert stream');
            };

            ws.onmessage = (event) => {
                try {
                    const envelope: WebSocketEnvelope = JSON.parse(event.data);
                    
                    if (envelope.event === "NEW_DISASTER_ALERT") {
                        const data = envelope.data;
                        console.log("New Alert Received via WebSocket:", data);

                        // Transform incoming WebSocket message to Alert type
                        const newAlert: Alert = {
                            id: data.breach_id || crypto.randomUUID(),
                            type: (data.disaster_kind?.toUpperCase() || 'UNKNOWN') as any,
                            title: `Real-time Alert: ${data.disaster_kind}`,
                            description: data.description || `Severity ${data.severity} detected at ${data.location_name}`,
                            severity: data.severity || 5,
                            source: 'SYSTEM' as any,
                            status: 'NEW',
                            location: { lat: data.latitude || 0, lng: data.longitude || 0 }, 
                            locationName: data.location_name,
                            province: data.province || 'Unknown',
                            rawData: { district: data.district, province: data.province },
                            confidence: 100, 
                            detectedAt: data.detected_at ? new Date(data.detected_at) : new Date()
                        };

                        setRealtimeAlerts((prev) => [newAlert, ...prev]);
                    }

                } catch (parseError) {
                    console.error('Error parsing WebSocket message:', parseError);
                }
            };

            ws.onerror = (event) => {
                console.error('WebSocket error observed:', event);
                setError('WebSocket encountered an error');
                setIsConnected(false);
            };

            ws.onclose = (event) => {
                setIsConnected(false);
                console.log('WebSocket connection closed', event.code, event.reason);
                // Basic reconnection logic (could use exponential backoff in production)
                setTimeout(() => {
                   if(document.visibilityState === 'visible') connect();
                }, 5000);
            };

            wsRef.current = ws;

        } catch (e: any) {
            setError(e.message);
            setIsConnected(false);
        }
    }, [backendUrl]);

    useEffect(() => {
        connect();

        return () => {
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, [connect]);

    const clearAlerts = useCallback(() => {
        setRealtimeAlerts([]);
    }, []);

    return {
        realtimeAlerts,
        isConnected,
        error,
        clearAlerts,
        reconnect: connect
    };
}
