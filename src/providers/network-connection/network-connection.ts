import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Network } from "@ionic-native/network";
import { Events } from "ionic-angular";

export enum ConnectionStatus {
  Online,
  Offline
}

@Injectable()
export class NetworkConnectionProvider {
  status: ConnectionStatus;
  private _status: BehaviorSubject<ConnectionStatus> = new BehaviorSubject(
    null
  );

  constructor(private network: Network, private event: Events) {
    this.status = ConnectionStatus.Online;
  }

  initializeNetworkEvent(): void {
    this.network.onConnect().subscribe(res => {
      if (this.status == ConnectionStatus.Offline) {
        this.setStatus(ConnectionStatus.Online);
      }
    });

    this.network.onDisconnect().subscribe(res => {
      if (this.status == ConnectionStatus.Online) {
        this.setStatus(ConnectionStatus.Offline);
      }
    });
  }

  getNetworkType(): string {
    return this.network.type;
  }

  getNetworkStatus(): Observable<ConnectionStatus> {
    return this._status.asObservable();
  }

  private setStatus(status: ConnectionStatus): void {
    this.status = status;
    this.event.publish("network:status", status);
    this._status.next(this.status);
  }
}
