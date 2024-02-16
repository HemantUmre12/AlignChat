const DEBUG = false;

const localServer = "127.0.0.1:8000";
const productionServer = "djchat.chickenkiller.com";
const httpProtocol = DEBUG ? "http" : "https";
const webSocketProtocol = DEBUG ? "ws" : "wss";
const server = DEBUG ? localServer : productionServer;

export const BASE_URL = `${httpProtocol}://${server}/api`;
export const MEDIA_URL = `${httpProtocol}://${server}`;
export const SOCKET_BASE_URL = `${webSocketProtocol}://${server}`;
