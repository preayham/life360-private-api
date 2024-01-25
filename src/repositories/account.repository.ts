import { Repository } from '../core/repository';
import {
  AccountRepositoryLoginResponseRootObject,
  AccountRepositoryLoginResponseUser,
  AccountRepositoryRequestOTPResponse,
} from '../responses';
import {
  AccountRepositoryDefaultOptions,
  AccountRepositoryLoginOptions,
} from '../types';

export class AccountRepository extends Repository {
  /**
   *
   * When the account has an unverified phone number we can login with the account password,
   * however if the account is verified Life360 requires you to login with a OTP.
   * Provide either an email address or phone number.
   *
   * @param {Object} options The options for login.
   * @param {string} [options.username] Account email address.
   * @param {string} options.password Account password.
   * @param {string} [options.phone] Account phone number.
   * @param {string} [options.countryCode] Required if your provide a phone number.
   * @param {boolean} logoutMulti Logout all other devices.
   *
   * @returns {Promise<AccountRepositoryLoginResponseUser>} Account access token.
   */
  public async login(
    { username, phone, password, countryCode }: AccountRepositoryLoginOptions,
    logoutMulti?: boolean,
  ): Promise<string> {
    let accessToken: string;
    let data: AccountRepositoryLoginOptions = {
      password,
    };

    switch (true) {
      case username !== undefined && phone !== undefined: {
        throw new Error(
          'Only provide an email address or phone number, not both.',
        );
      }
      case username === undefined && phone === undefined: {
        throw new Error('Must provide an email address or phone number.');
      }
      case username !== undefined: {
        data = { ...data, username };

        break;
      }
      case phone !== undefined && countryCode !== undefined: {
        data = { ...data, phone, countryCode };

        break;
      }
      case phone !== undefined && countryCode === undefined: {
        throw new Error('Country code required when using a phone number.');
      }
      default:
        break;
    }

    this.client.state.generateDevice();

    const check2fa = await this.requestOTP(username);
    if (check2fa) {
      accessToken = await this.loginOTP(data, check2fa);
    } else {
      accessToken = await this.loginPassword(data);
    }

    if (logoutMulti) {
      this.logoutMulti();
    }

    await this.client.simulate.postLoginFlow();
    return accessToken;
  }

  private async loginPassword(
    data: AccountRepositoryLoginOptions,
  ): Promise<string> {
    const response =
      await this.client.request.send<AccountRepositoryLoginResponseUser>(
        'https://api-cloudfront.life360.com/v3/oauth2/token',
        {
          method: 'POST',
          body: JSON.stringify({ ...data, grant_type: 'password' }),
        },
      );

    return response.data.access_token;
  }

  private async loginOTP(
    { username, phone, countryCode }: AccountRepositoryDefaultOptions,
    transactionId?: string,
  ): Promise<string> {
    let requestOTPData = {};

    switch (true) {
      case phone !== undefined: {
        requestOTPData = { ...requestOTPData, phone, countryCode };
      }
      case username !== undefined: {
        requestOTPData = { ...requestOTPData, username };
      }
    }

    if (!transactionId) {
      transactionId = await this.requestOTP(username);
    }
    const code = await this.client.simulate.getOTP();

    if (!code) {
      throw new Error(
        'This account has 2FA and the getOTP function needs to be set. Look at the 2FA login example.',
      );
    }

    const response =
      await this.client.request.send<AccountRepositoryLoginResponseRootObject>(
        'https://api-cloudfront.life360.com/v5/users/signin/otp/token',
        {
          method: 'POST',
          body: JSON.stringify({
            transactionId,
            code,
          }),
          headers: {
            'Ce-Type': 'com.life360.device.signin-token-otp.v1',
            ...this.client.state.ceHeaders,
          },
        },
      );

    return response.data.access_token;
  }

  private async requestOTP(email: string): Promise<string> {
    const response =
      await this.client.request.send<AccountRepositoryRequestOTPResponse>(
        'https://api-cloudfront.life360.com/v5/users/signin/otp/send',
        {
          method: 'POST',
          body: JSON.stringify({
            email,
          }),
          headers: {
            'Ce-Type': 'com.life360.device.signin-otp.v1',
            ...this.client.state.ceHeaders,
          },
        },
      );

    if (response.data.error.code === 'unverified-phone') {
      return;
    }

    return response.data.data.transactionId;
  }

  private async logoutMulti() {
    const response = await this.client.request.send(
      'https://api-cloudfront.life360.com/v3/oauth2/logout/multidevice',
      {
        method: 'DELETE',
      },
    );

    return response.status;
  }
}
