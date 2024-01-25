import { defaultsDeep } from 'lodash';
import { Repository } from '../core/repository';

export class LocationRepository extends Repository {
  private lmode = 'fore';

  /**
   *
   * Set the location of the Life360 account to latitude and longitude coordinates.
   * This function sends 3 requests per call, which is almost the way Life360 does it.
   *
   * @param {number} latitude latitude.
   * @param {number} longitude longitude.
   *
   * @returns {Promise<number>} Status.
   */
  public async setLocation(
    latitude: number,
    longitude: number,
  ): Promise<number> {
    let status: number;

    if (this.lmode === 'fore') {
      for (let index = 0; index < 3; index++) {
        status = await this.updateLocation(
          latitude,
          longitude,
          this.client.state.locationModes[index],
        );
      }
    }

    if (this.lmode === 'srt') {
      for (let index = 0; index < 2; index++) {
        status = await this.updateLocation(
          latitude,
          longitude,
          this.client.state.locationModes[index + 1],
        );
      }
    }

    if (this.lmode === 'fore') this.lmode = 'srt';
    return status;
  }

  private async updateLocation(lat: number, lon: number, lmode: string) {
    const locationData = defaultsDeep(this.client.state.locationData, {
      device: {
        battery: this.client.state.batteryLevel,
        build: this.client.state.appVersion,
      },
      geolocation: {
        timestamp: new Date().getTime() / 1000,
        lon,
        lat,
      },
      geolocation_meta: {
        lmode,
      },
    });

    const encodedData = Buffer.from(JSON.stringify(locationData)).toString(
      'base64',
    );

    const response = await this.client.request.send(
      'https://iphone.life360.com/v4/locations',
      {
        method: 'PUT',
        headers: {
          Host: 'iphone.life360.com',
          'X-usercontext': encodedData,
        },
      },
    );

    return response.status;
  }
}
