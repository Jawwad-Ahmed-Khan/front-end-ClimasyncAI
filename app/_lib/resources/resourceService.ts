/**
 * ClimaSync.AI — Resources API Service Layer
 */
import { apiClient } from "../apiClient";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface ResourceData {
  ngo_id: string;
  ambulances: number;
  rescue_boats: number;
  trucks: number;
  four_wheel_vehicles: number;
  cranes: number;
  doctors: number;
  paramedics: number;
  rescue_divers: number;
  volunteers_available: number;
  food_packets_capacity: number;
  shelter_capacity: number;
}

export interface AreaData {
  id: string;
  province: string;
  district: string;
  is_active: boolean;
}

export interface SpecializationData {
  id: string;
  specialization: string;
}

export interface NGOFullProfile {
  ngo_id: string;
  capabilities: ResourceData | Record<string, never>;
  areas: AreaData[];
  specializations: SpecializationData[];
}

export interface ResourcePatch {
  ambulances?: number;
  rescue_boats?: number;
  trucks?: number;
  four_wheel_vehicles?: number;
  cranes?: number;
  doctors?: number;
  paramedics?: number;
  rescue_divers?: number;
  volunteers_available?: number;
  food_packets_capacity?: number;
  shelter_capacity?: number;
}

// ---------------------------------------------------------------------------
// API Functions
// ---------------------------------------------------------------------------

export async function getMyResources(): Promise<NGOFullProfile> {
  const response = await apiClient.get<NGOFullProfile>("/resources/me");
  return response.data;
}

export async function updateResourceCapacity(
  payload: ResourcePatch
): Promise<ResourceData> {
  const response = await apiClient.patch<ResourceData>(
    "/resources/me/capacity",
    payload
  );
  return response.data;
}

export async function addOperationalArea(
  province: string,
  district: string
): Promise<AreaData> {
  const response = await apiClient.post<AreaData>("/resources/me/areas", {
    province,
    district,
  });
  return response.data;
}

export async function removeOperationalArea(
  areaId: string
): Promise<void> {
  await apiClient.delete(`/resources/me/areas/${areaId}`);
}

export async function addSpecialization(
  specialization: string
): Promise<SpecializationData> {
  const response = await apiClient.post<SpecializationData>(
    "/resources/me/specializations",
    { specialization }
  );
  return response.data;
}

export async function removeSpecialization(
  specId: string
): Promise<void> {
  await apiClient.delete(`/resources/me/specializations/${specId}`);
}
