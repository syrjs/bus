import { Client } from '@syr/bus';

// create a new for this app client, with an endpoint
let client = new Client('com.derek.mathApp');

// register a method for this app
client.fn('square', ({ num }) => {
  return num*num;
});
