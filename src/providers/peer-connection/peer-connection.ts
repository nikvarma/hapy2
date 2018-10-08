import { Injectable, EventEmitter } from "@angular/core";
import { PeerConfig } from "../../config/PeerConfig";
import { CallProvider } from "../call/call";
declare var Peer;

@Injectable()
export class PeerConnectionProvider {
  peer: any;
  callingObject: EventEmitter<any> = new EventEmitter<any>();
  constructor(private call: CallProvider) {}
  initilizePeer(isStart: boolean = false): void {
    if (isStart) {
      setTimeout(() => {
        this.peer = new Peer({
          key: PeerConfig.key,
          debug: 3
        });
        console.log(this.peer);
        this.peer.on("open", id => {
          this.call.setValueKey("myCallId", id);
        });
        this.peer.on("error", err => console.log(err));

        this.peer.on("connection", c => {
          // Show connection when it is completely ready
          c.on("open", () => this.peerConnected(c));
        });
        this.callingEvent();
      }, 3000);
    }
  }

  callingEvent(): void {
    this.peer.on("call", calling => {
      this.callingObject.emit(calling);
    });
  }

  peerConnected(c: any): any {
    console.log(c);
  }
}
