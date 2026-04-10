/**
 * ClimaSync.AI — Disaster Types
 */

export type AlertSeverity = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
export type AlertStatus = 'NEW' | 'VERIFIED' | 'DISMISSED';

export interface AlertData {
  alert_id: string;
  source: string;
  severity: AlertSeverity;
  description: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  status: AlertStatus;
}

export type EventSeverity = 'MODERATE' | 'HIGH' | 'CRITICAL';
export type EventStatus = 'ACTIVE' | 'CONTAINED' | 'RESOLVED';

export interface DisasterEventData {
  event_id: string;
  title: string;
  description: string;
  severity: EventSeverity;
  status: EventStatus;
  latitude: number;
  longitude: number;
  affected_radius_km: number;
  start_time: string;
  end_time?: string;
  is_active: boolean;
}

export interface AlertUpdateData {
  status: AlertStatus;
}
