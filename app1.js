import { Client } from '@syr/bus';

// create a new client, with an endpoint
let client = new Client('com.derek.testApp');

// message another client's endpoint, pass arguments
// recieve a return value
client.message(
  'syr://com.derek.mathApp/square',
  {
    num: 2,
  },
  returnValue => {
    console.log(`Squared Valued Is: ${returnValue}`);
  }
);
