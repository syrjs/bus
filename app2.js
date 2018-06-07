import { Client } from '@syr/bus';

// create a new client for this app client, with an endpoint
let client = new Client('com.derek.mathApp');

// register a method for this app
client.fn('double', ({ num }) => {
  document.body.innerHTML = `double ${num} => ${num * 2}<br>${document.body.innerHTML}`
  return num * 2;
});

// register a method for this app
client.fn('halve', ({ num }) => {
  document.body.innerHTML = `halve ${num} => ${num / 2}<br>${document.body.innerHTML}`
  return num / 2;
});
