export interface Channel {
  id: number;
  name: string;
  server: number;
  topic: string;
  owner: number;
}

// Server interface using Channel
export interface Server {
  id: number;
  name: string;
  owner: number;
  category: string;
  description: string;
  icon: string;
  banner: string;
  channel_server: Channel[];
}
