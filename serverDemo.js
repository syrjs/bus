import { Server } from '@syr/bus';

// this file loaded in a webpage
let server = new Server();

// load app1 when served from other webpack server
// npm run serve-app
server.loadApp('http://localhost:8888');

// load app2
// np run serve-app-two
server.loadApp('http://localhost:8889');
