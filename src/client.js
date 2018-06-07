import { Status, MessageTypes } from './enums';
import { guid } from './utils';

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
    this.messageQueue = {};
    this.callbacks = {};
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
        case MessageTypes.RETURN:
          this.handleReturn(event);
          break;
      }
    }
  }
  handleReturn(event) {
    let { callbackId } = event.data;
    let callback = this.callbacks[callbackId];
    let returnValue = JSON.parse(event.data.returnValue);
    callback.call(this, returnValue);
    delete this.callbacks[callbackId];
  }
  handleRegisterMethod(event) {
    let { name, owner } = event.data;
    let app = this.apps[owner] || {};
    let methods = app.methods || {};
    methods[name] = name;
    app.methods = methods;
    this.apps[owner] = app;
    let messageQueue = this.messageQueue[owner];
    if (messageQueue && messageQueue.length > 0) {
      let processQueue = messageQueue;
      this.messageQueue[owner] = [];
      processQueue.forEach(item => {
        let { owner, name, message, cb } = item;
        this.enqueueMessage(owner, name, message, cb);
      });
    }
  }
  handleRecieveMessage(event) {
    let method = this.methods[event.data.name];
    let args = event.data.message || {};
    let returnValue = method.call(this, args);
    if (event.data.callback) {
      sendMessageToParent({
        type: MessageTypes.CALLBACK,
        callbackId: event.data.callbackId,
        returnValue: returnValue,
      });
    }
  }
  message(endPoint, message, cb) {
    let a = document.createElement('a');
    a.href = endPoint;
    let [owner, methodName] = a.pathname.replace('//', '').split('/');

    if (a.protocol == 'syr:') {
      if (!cb) {
        return new Promise(resolve => {
          cb = returnValue => {
            resolve(returnValue);
          };
          this.enqueueMessage(owner, methodName, message, cb);
        });
      }
      this.enqueueMessage(owner, methodName, message, cb);
    }
  }
  enqueueMessage(owner, name, message, cb) {
    if (this.apps[owner] && this.apps[owner].methods[name]) {
      this.sendImmediate(owner, name, message, cb);
    } else {
      let messageQueue = this.messageQueue[owner] || [];
      messageQueue.push({ owner, name, message, cb });
      this.messageQueue[owner] = messageQueue;
    }
  }
  sendImmediate(owner, name, message, cb) {
    // if there is a callback register it
    let _guid;
    if (cb) {
      _guid = guid();
      this.callbacks[_guid] = cb;
    }

    // send the message
    sendMessageToParent({
      type: MessageTypes.SEND_MESSAGE,
      name: name,
      owner: owner,
      message: message,
      callback: cb ? true : false,
      callbackId: _guid,
    });
  }
}

export { Client };

function sendMessageToParent(message) {
  parent.postMessage(message, '*');
}
