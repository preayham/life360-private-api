import { Repository } from '../core/repository';

export class SimulateService extends Repository {
  private async lpse() {
    const response = await this.client.request.send(
      'https://api-cloudfront.life360.com/v3/users/lpse',
      {
        method: 'POST',
        body: JSON.stringify({
          adLimit: '1',
          appId: 'safetymap_lpse',
          deviceName: this.client.state.deviceModel,
          deviceUdid: this.client.state.uuid,
          deviceModel: 'iPhone',
          adUdid: '',
          deviceType: 'iphone',
          deviceVersion: this.client.state.deviceVersion,
          deviceToken: this.client.state.deviceToken,
          appVersion: this.client.state.appVersion,
        }),
      },
    );

    return response.data;
  }

  private async devices() {
    const response = await this.client.request.send(
      'https://api-cloudfront.life360.com/v3/users/devices',
      {
        method: 'POST',
        body: JSON.stringify({
          deviceName: this.client.state.deviceModel,
          adLimit: '1',
          deviceUdid: this.client.state.uuid,
          deviceModel: this.client.state.deviceModel,
          deviceType: 'iphone',
          adUdid: '',
          deviceToken: this.client.state.deviceToken,
          deviceVersion: this.client.state.deviceVersion,
          appId: 'safetymap',
          carrier: this.client.state.deviceCarrier,
          appVersion: this.client.state.appVersion,
        }),
      },
    );

    return response.data;
  }

  public async postLoginFlow() {
    await this.lpse();
    await this.devices();
  }

  /**
   *
   * You must reinitialize this function to get the OTP depending on your project setup.
   * A simple way is by waiting for user input.
   *
   * @returns {Promise<string>} Returns empty string by default.
   */
  public async getOTP(): Promise<string> {
    return '';
  }
}
