import { Server } from './index.js';

let server = new Server();

//load app 1
server.loadApp('http://localhost:8888');
server.loadApp('http://localhost:8889');
