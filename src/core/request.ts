import { defaultsDeep } from 'lodash';
import { randomUUID } from 'crypto';
import { Subject } from 'rxjs';

import { Life360Client } from './client';
import { Life360Response } from '../types/common.types';

export class Request {
  constructor(private client: Life360Client) {}
  end$ = new Subject<void>();

  public async send<T = any>(
    url: string,
    userOptions: RequestInit,
  ): Promise<Life360Response<T>> {
    const options = defaultsDeep(userOptions, {
      headers: {
        ...this.getDefaultHeaders(),
        Cookie: this.client.state.extractCookies,
      },
    });

    const response = await fetch(url, options);
    const life360Response: Life360Response<T> = {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    };

    if (life360Response.headers.get('content-type') === 'application/json') {
      life360Response.data = (await response.json()) as T;
    }

    this.updateState(life360Response);
    this.updateCookies(life360Response);

    process.nextTick(() => this.end$.next());

    return life360Response;
  }

  private async updateState(response: Life360Response<any>) {
    if (!response.data) return;
    const { access_token: authorization } = response.data;

    if (authorization && !this.client.state.authorization) {
      this.client.state.authorization = authorization;
    }
  }

  private async updateCookies(response: Life360Response<any>) {
    const cookies = response.headers.getSetCookie();
    if (!cookies) return;

    for (const cookie of cookies) {
      this.client.state.setCookie(cookie);
    }
  }

  private getDefaultHeaders() {
    return {
      Host: 'api-cloudfront.life360.com',
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: this.client.state.authorization
        ? `Bearer ${this.client.state.authorization}`
        : 'Basic YnJ1czR0ZXZhcHV0UmVadWNydUJSVXdVYnJFTUVDN1VYZTJlUEhhYjpSdUt1cHJBQ3JhbWVzV1UydVRyZVF1bXVtYTdhemFtQQ==',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept-Language': 'en-US',
      'X-Request-Id': randomUUID(),
      'X-Ff-Environment': 'production',
      'X-Device-Id': this.client.state.uuid,
      'User-Agent': this.client.state.userAgent,
    };
  }
}
