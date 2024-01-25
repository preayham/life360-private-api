import { Life360Client } from './client';

export abstract class Repository {
  protected client: Life360Client;

  constructor(client: Life360Client) {
    this.client = client;
  }
}
