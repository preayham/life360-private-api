import { randomUUID } from 'crypto';
import { CookieJar, MemoryCookieStore } from 'tough-cookie';

import * as Constants from './constants';

export class State {
  public get appVersion(): string {
    return this.constants.APP_VERSION;
  }

  public get locationData(): object {
    return this.constants.LOCATION_DATA;
  }

  public get locationModes(): string[] {
    return this.constants.LOCATION_MODES;
  }

  constants = Constants;
  authorization?: string;
  uuid: string;

  deviceModel: string;
  deviceVersion: string;
  deviceCarrier: string;
  batteryLevel: number;

  cookieStore = new MemoryCookieStore();
  cookieJar = new CookieJar(this.cookieStore);

  public setCookie(cookie: string) {
    this.cookieJar.setCookieSync(cookie, this.constants.HOST);
  }

  public get extractCookies() {
    return this.cookieJar.getCookieStringSync(this.constants.HOST);
  }

  public get userAgent() {
    return `SafetyMapKoko/${this.appVersion}/${this.uuid}`;
  }

  get ceSource() {
    return `/iOS/${this.appVersion}/${this.deviceModel}/${this.uuid}`;
  }

  public get ceHeaders() {
    return {
      'Ce-Specversion': '1.0',
      'Ce-Id': randomUUID(),
      'Ce-Time': new Date().toISOString(),
      'Ce-Source': this.ceSource,
    };
  }

  public get deviceToken() {
    const characters = '0123456789abcdef';
    let deviceToken = '';

    for (let index = 0; index < 64; index++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      deviceToken += characters.charAt(randomIndex);
    }

    return deviceToken;
  }

  public async serialize(): Promise<{ cookies: string } & any> {
    const state = {
      cookies: JSON.stringify(await this.cookieJar.serialize()),
      authorization: this.authorization,
      uuid: this.uuid,
      deviceModel: this.deviceModel,
      deviceVersion: this.deviceVersion,
      deviceCarrier: this.deviceCarrier,
      batteryLevel: this.batteryLevel,
    };

    return state;
  }

  public async deserialize(state: any): Promise<void> {
    if (typeof state !== 'object') {
      throw new TypeError('State must be an object.');
    }

    this.cookieJar = await CookieJar.deserialize(
      state.cookies,
      this.cookieStore,
    );
    delete state.cookies;

    for (const [key, value] of Object.entries(state)) {
      this[key] = value;
    }
  }

  public generateDevice(): void {
    this.uuid = randomUUID();
    this.deviceModel = 'iPhone6s';
    this.deviceVersion = '15.7';
    this.deviceCarrier = 'T-Mobile';
    this.batteryLevel = Math.floor(Math.random() * 100) + 1;
  }
}
