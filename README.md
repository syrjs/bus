## dragons

this node module is fresh poc.

## description

used for multi-tenant environments in syr core

## usage

A `hypervisor` or server is needed. Our example the server is the main webpage host, it's job is to host iFrames.

A simple example is like so :

```javascript
import { Server } from '@syr/bus';

// this file loaded in a webpage
let server = new Server();

// load app1 when served from other webpack server
// npm run serve-app
server.loadApp('http://localhost:8888');

// load app2
// np run serve-app-two
server.loadApp('http://localhost:8889');
```

Clients can then interact with each other.

A client registers itself on the `bus` first.

```javascript
import { Client } from '@syr/bus';

// create a new client, with an endpoint
let client = new Client('com.derek.mathApp');
```

A client can then register endPoint names

```javascript
// register a method for this app
client.fn('square', ({ num }) => {
  return num * num;
});
```

That's it!

Another client can now digest those exported methods across the bus.

callback pattern

```javascript
// message another client's endpoint, pass arguments
// recieve a return value
client.message(
  'syr://com.derek.mathApp/square',
  {
    num: 2,
  },
  result => {
    console.log(`Squared Valued Is: ${result}`);
  }
);
```
promise pattern

```javascript
client.message('syr://com.derek.mathApp/square', {
  num: 4,
}).then(result => {
  console.log(`Squared Valued Is: ${result}`);
});
```
