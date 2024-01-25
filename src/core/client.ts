import { State } from './state';
import { Request } from './request';

import { AccountRepository } from '../repositories/account.repository';
import { LocationRepository } from '../repositories/location.repository';
import { CirclesRepository } from '../repositories/circles.repository';

import { SimulateService } from '../services/simulate.service';

export class Life360Client {
  public state = new State();
  public request = new Request(this);

  public account = new AccountRepository(this);
  public location = new LocationRepository(this);
  public circles = new CirclesRepository(this);
  public simulate = new SimulateService(this);
}
