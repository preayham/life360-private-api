import { input } from '@inquirer/prompts';
import { Life360Client } from '../src';

(async () => {
  // Initialize Lif360 client.
  const client = new Life360Client();

  /* Set the getOTP function to wait for user input with inquirer, or your own method.
   This will run once you login.

   This is only necessary if the account has a verified number, if it doesn't this wont run. */
  client.simulate.getOTP = async () => {
    const code = await input({
      message: 'Enter OTP:',
    });

    return code;
  };

  // Login to account.
  await client.account.login({
    username: process.env.L360_USERNAME,
    password: process.env.L360_PASSWORD,
  });
})();
