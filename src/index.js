/**
 * Impliments a simple server / client
 * Apps are all clients on the bus
 * The container is the server
 */
import { Client } from './client';
import { Server } from './server';
import { Status, MessageTypes } from './enums';
export { Server, Client, MessageTypes, Status };
