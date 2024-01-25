export interface CirclesRepositoryMembersResponse {
  members: CirclesRepositoryMembersResponseMember[];
}

export interface CirclesRepositoryMembersResponseMember {
  id: string;
  firstName: string;
  lastName: string;
  loginEmail: string;
  loginPhone: string;
  createdAt: string;
  isAdmin: boolean;
}
