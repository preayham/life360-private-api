import 'dotenv/config';
import * as fs from 'fs';
import { Life360Client } from '../src';

/**
 *
 * Save session data to a json file.
 *
 * @param {object} data Session data
 */
const saveSession = (data: object) => {
  fs.writeFileSync('./saved-session.json', JSON.stringify(data));
};

/**
 *
 * Load session data from a json file.
 *
 * @returns {object} Session data
 */
const loadSession = (): object => {
  let serializedSession: object;

  // Try to load session data, if none create a file.
  try {
    serializedSession = JSON.parse(
      fs.readFileSync('./saved-session.json', 'utf-8'),
    );
  } catch {
    fs.writeFileSync('./saved-session.json', '');
  }

  return serializedSession;
};

(async () => {
  // Initalize Life360 client.
  const client = new Life360Client();

  // This executes after every request, and saves session data.
  client.request.end$.subscribe(async () => {
    const serialized = await client.state.serialize();

    saveSession(serialized);
  });

  // Load and set session state. If there is a session this will log you in.
  const loadedSession = loadSession();
  if (loadedSession) {
    await client.state.deserialize(loadedSession);
  }

  /* If no loaded session state, login to account. 
   This call will provoke the request.end$ stream and save the session. */
  if (!loadedSession) {
    await client.account.login({
      username: process.env.L360_USERNAME,
      password: process.env.L360_PASSWORD,
    });
  }
})();
