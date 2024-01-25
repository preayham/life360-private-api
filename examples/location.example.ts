import 'dotenv/config';
import { Life360Client } from '../src';

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
