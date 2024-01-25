export interface CirclesRepositoryMembersLocationsResponse {
  data: {
    items: CirclesRepositoryMembersLocationsResponseItem[];
  };
}

export interface CirclesRepositoryMembersLocationsResponseItem {
  deviceId: string;
  latitude: string;
  longitude: string;
  batteryLevel: number;
  speed: number;
}
