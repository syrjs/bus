/**
 * Impliments a simple server / client
 * Apps are all clients on the bus
 * The container is the server
 */
class Server {
  constructor() {
    this.apps = {};
    this.endPoints = {};
    window.addEventListener(
      'message',
      event => this.receiveMessage(event),
      false
    );
  }
  loadApp(path) {
    let bridge = document.createElement('iframe');
    this.apps[path] = {
      bridge: bridge,
      path: path,
      status: Status.UNREGISTERED,
      methods: {},
    };
    bridge.src = path;
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
      }
    }
  }
  appSendMessage(event) {
    let data = event.data;
    this.sendMessage(data.owner, {
      type: MessageTypes.RECEIVE_MESSAGE,
      name: data.name,
      message: data.message || {},
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
      owner: data.owner
    });
  }
  broadcast(message){
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

function sendMessageToParent(message) {
  parent.postMessage(message, '*');
}

class Client {
  constructor(name) {
    sendMessageToParent({
      type: MessageTypes.REGISTER,
      name: name,
    });
    window.addEventListener(
      'message',
      event => this.receiveMessage(event),
      false
    );
    this.name = name;
    this.apps = {};
    this.methods = {};
  }
  fn(name, callback) {
    sendMessageToParent({
      type: MessageTypes.REGISTER_METHOD,
      name: name,
      owner: this.name,
    });
    this.methods[name] = callback;
  }
  receiveMessage(event) {
    if (event.source == parent) {
      switch (event.data.type) {
        case MessageTypes.RECEIVE_MESSAGE:
          this.handleRecieveMessage(event);
          break;
        case MessageTypes.REGISTER_METHOD:
          this.handleRegisterMethod(event);
          break;
      }
    }
  }
  handleRegisterMethod(event) {
    let {name, owner} = event.data;
    let app = this.apps[owner] || {};
    let methods = app.methods || {};
    methods[name] = name;
    app.methods = methods;
    this.apps[owner] = app;
  }
  handleRecieveMessage(event) {
    let method = this.methods[event.data.name];
    let args = event.data.message || {};
    method.call(this, args);
  }
  message(endPoint, message) {
    let a = document.createElement('a');
    a.href = endPoint;
    if (a.protocol == 'syr:') {
      let [owner, methodName] = a.pathname.replace('//', '').split('/');
      this.enqueueMessage(owner, methodName, message);
    }
  }
  enqueueMessage(owner, name, message) {
    if(this.apps[owner] && this.apps[owner].methods[name]) {
      this.sendImmediate(owner, name, message)
    } else {
      // we need to queue the message to try again when
      // the owner and method surfaces
    }
  }
  sendImmediate(owner, name, message) {
    sendMessageToParent({
      type: MessageTypes.SEND_MESSAGE,
      name: name,
      owner: owner,
      message: message,
    });
  }
}

const Status = {
  UNREGISTERED: 'UNREGISTERED',
  REGISTERED: 'REGISTERED',
};

const MessageTypes = {
  REGISTER: 'REGISTER',
  REGISTER_METHOD: 'REGISTER_METHOD',
  RECEIVE_MESSAGE: 'RECEIVE_MESSAGE',
  SEND_MESSAGE: 'SEND_MESSAGE',
};

export { Server, Client, MessageTypes, Status };