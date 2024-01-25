import { Repository } from '../core/repository';
import {
  CirclesRepositoryCircleResponseCircle,
  CirclesRepositoryCirclesResponse,
  CirclesRepositoryMembersLocationsResponse,
  CirclesRepositoryMembersLocationsResponseItem,
  CirclesRepositoryMembersResponse,
  CirclesRepositoryMembersResponseMember,
} from '../responses';

export class CirclesRepository extends Repository {
  /**
   * @returns {Promise<CirclesRepositoryCircleResponseCircle[]>} All circles that the account is in.
   */
  public async getCircles(): Promise<CirclesRepositoryCircleResponseCircle[]> {
    const response =
      await this.client.request.send<CirclesRepositoryCirclesResponse>(
        'https://api-cloudfront.life360.com/v4/circles',
        {
          method: 'GET',
        },
      );

    return response.data.circles;
  }

  /**
   *
   * @param {string} circleId Circle ID
   *
   * @returns {Promise<CirclesRepositoryMembersResponseMember[]>} All circle's members public account data.
   */
  public async getCircleMembers(
    circleId: string,
  ): Promise<CirclesRepositoryMembersResponseMember[]> {
    const response =
      await this.client.request.send<CirclesRepositoryMembersResponse>(
        `https://api-cloudfront.life360.com/v4/circles/${circleId}/members`,
        {
          method: 'GET',
        },
      );

    return response.data.members;
  }

  /**
   *
   * @param {string} circleId Circle ID
   *
   * @returns {Promise<CirclesRepositoryMemberLocationsResponseItem[]>} All circle's members device data and location.
   */
  public async getCircleMembersLocations(
    circleId: string,
  ): Promise<CirclesRepositoryMembersLocationsResponseItem[]> {
    const response =
      await this.client.request.send<CirclesRepositoryMembersLocationsResponse>(
        'https://api-cloudfront.life360.com/v5/circles/devices/locations?providers[]=life360&providers[]=jiobit&providers[]=tile',
        {
          method: 'GET',
          headers: {
            'Ce-Type': 'com.life360.cloud.platform.devices.locations.v1',
            Circleid: circleId,
            ...this.client.state.ceHeaders,
          },
        },
      );

    return response.data.data.items;
  }
}
