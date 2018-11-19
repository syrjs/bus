import { Status, MessageTypes } from './enums';
import { guid, serialize } from './utils';

class Server {
  constructor() {
    this.apps = {};
    this.endPoints = {};
    this.callbacks = {};
    window.addEventListener(
      'message',
      event => this.receiveMessage(event),
      false
    );
  }
  loadApp(path, opts, params) {
    let bridge = document.createElement('iframe');
    this.apps[path] = {
      bridge: bridge,
      path: path,
      status: Status.UNREGISTERED,
      methods: {},
    };

    params.isSyrMultiplex = true;
    let queryString = serialize(params);

    // add params to source here
    bridge.src = `${path}?${queryString}`;

    if(!opts || opts && (opts.hidden || opts.hidden == undefined)) {
      // style bridges hidden for web use
      bridge.style.visibility = 'hidden';
      bridge.style.height = '0px';
      bridge.style.width = '0px';
      bridge.style.position = 'absolute';
      bridge.frameborder = 0;
    }

    document.body.appendChild(bridge);
  }
  receiveMessage(event) {
    if (event.data && event.data.type) {
      switch (event.data.type) {
        case MessageTypes.REGISTER:
          this.registerApp(event);
          break;
        case MessageTypes.REGISTER_METHOD:
          this.registerMethod(event);
          break;
        case MessageTypes.SEND_MESSAGE:
          this.appSendMessage(event);
          break;
        case MessageTypes.CALLBACK:
          this.handleCallback(event);
          break;
        case MessageTypes.MULTIPLEX_MESSAGE:
          this.handleMultiplex(event);
          break;
      }
    }
  }
  handleMultiplex(event) {}
  handleCallback(event) {
    let { callbackId, returnValue } = event.data;
    let owner = this.callbacks[callbackId];
    this.sendMessage(owner, {
      type: MessageTypes.RETURN,
      callbackId: callbackId,
      returnValue: JSON.stringify(returnValue),
    });
    delete this.callbacks[callbackId];
  }
  appSendMessage(event) {
    let data = event.data;
    if (data.callback) {
      // the callback needs to return to the appropriate app
      this.callbacks[data.callbackId] = event.origin;
    }
    this.sendMessage(data.owner, {
      type: MessageTypes.RECEIVE_MESSAGE,
      name: data.name,
      message: data.message || {},
      callback: data.callback,
      callbackId: data.callbackId ? data.callbackId : null,
    });
  }
  registerApp(event) {
    let app = this.apps && this.apps[event.origin];
    // ignore messages not from a registered app
    if (app) {
      let data = event.data;
      if (this.endPoints[data.name]) {
        console.warn('application already registered!');
        return;
      } else {
        this.endPoints[data.name] = {
          app: event.origin,
        };
      }
      app.status = Status.REGISTERED;
    }
  }
  registerMethod(event) {
    let data = event.data;
    let appName = this.endPoints[data.owner].app;
    let app = this.apps[appName];
    let methods = app.methods;
    methods[data.name] = data.name;
    this.broadcast({
      type: MessageTypes.REGISTER_METHOD,
      name: data.name,
      owner: data.owner,
    });
  }
  broadcast(message) {
    for (let appName in this.apps) {
      if (this.apps.hasOwnProperty(appName)) {
        this.sendMessage(appName, message);
      }
    }
  }
  sendMessage(target, message) {
    let appName = this.endPoints[target] && this.endPoints[target].app;
    let app = this.apps[appName] || this.apps[target];
    if (app && app.bridge) app.bridge.contentWindow.postMessage(message, '*');
  }
}

export { Server };