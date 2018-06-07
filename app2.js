import { Client } from './index.js';

// create a new hypervisor client, with an endpoint
let client = new Client('com.derek.otherApp');

// send the client a message
setTimeout(() => {
  client.message('syr://com.derek.testApp/fooMethod', {
    foo: 'bar',
  });
}, 500);
