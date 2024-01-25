import 'dotenv/config';
import { Life360Client } from '../src';

(async () => {
  // Initialize client.
  const client = new Life360Client();

  // Login to account.
  await client.account.login({
    username: process.env.L360_USERNAME,
    password: process.env.L360_PASSWORD,
  });

  // Get all account circles.
  const circles = await client.circles.getCircles();

  // Loop through all the circles.
  for (const circle of circles) {
    const circleId = circle.id;

    // Get the circle's members and members locations.
    const circleMembers = await client.circles.getCircleMembers(circleId);
    const circleMembersLocations =
      await client.circles.getCircleMembersLocations(circleId);

    console.log(circle, circleMembers, circleMembersLocations);
  }
})();
