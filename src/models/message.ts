export interface MessageBox extends MessageConnection {
  rtime?: number;
  dtime?: number;
  sdate: number;
  message: any;
  status: number;
  mediatype?: string;
  mediacontent?: string;
  sendby: MessageSendBy;
  ismediacontent: boolean | false;
}

export interface MessageConnection {
  id: string;
  name: string;
  profileimage: string;
}

export interface MessageSendBy {
  id: string;
}
