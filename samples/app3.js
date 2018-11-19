import { Client } from '@syr/bus';

// create a new client for this app client, with an endpoint
let client = new Client('com.derek.scientificMathApp');

// register a method for this app
client.fn('square', ({ num }) => {
  document.body.innerHTML = `square ${num} => ${num * num}<br>${document.body.innerHTML}`
  return num * num;
});

// register a method for this app
client.fn('root', ({ num }) => {
  document.body.innerHTML = `sqrt ${num} => ${Math.sqrt(num)}<br>${document.body.innerHTML}`
  return Math.sqrt(num);
});
