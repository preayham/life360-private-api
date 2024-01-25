export interface CirclesRepositoryCirclesResponse {
  circles: CirclesRepositoryCircleResponseCircle[];
}

export interface CirclesRepositoryCircleResponseCircle {
  id: string;
  name: string;
  createdAt: string;
}
