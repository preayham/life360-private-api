# NodeJS Life360 Private API Client

![logo](https://cdn-1.webcatalog.io/catalog/life360/life360-icon-filled-128.png?v=1675597708926)

[![npm](https://img.shields.io/npm/l/life360-private-api.svg?maxAge=600)](https://github.com/preayham/life360-private-api/blob/main/LICENSE)

This private api client is far from finished, but it still comes with some cool features like:

- Mocking your location to a set of coordinates.

# Table of Contents

- [Install](#install)
- [Examples](#examples)

# Install

From npm

```
npm install life360-private-api
```

From github

```
npm install github:preayham/life360-private-api
```

# Examples

You can find all usage examples [here](examples).

Here is how to login and set the account's location:

```typescript
import 'dotenv/config';
import { Life360Client } from 'life360-private-api';

(async () => {
  // Initalize Life360 client.
  const client = new Life360Client();

  /* If set to true, this will logout other devices and notify other users of new device.
   However, I don't think this is necessary as the API still works. The default is false. */
  const logoutMulti = false;

  // Login to account.
  await client.account.login(
    {
      username: process.env.L360_USERNAME,
      password: process.env.L360_PASSWORD,
    },
    logoutMulti,
  );

  // Latitude and longitude of golden state bridge.
  const latitude = 37.82049994957982;
  const longitude = -122.47872192865992;

  /* Set the location to the coordinates. 
   If you want the account to be stationary you only need to call this once. */
  await client.location.setLocation(latitude, longitude);

  // The program no longer needs to run as Life360 will say you've been at this position since X time.
})();
```
