import { Client } from './index.js';

// create a new hypervisor client, with an endpoint
let client = new Client('com.derek.testApp');

client.fn('fooMethod', ({ foo }) => {
  console.log(foo);
});
