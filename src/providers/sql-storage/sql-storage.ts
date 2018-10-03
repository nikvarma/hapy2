import { Injectable, OnInit, NgZone } from "@angular/core";
import { SQLite, SQLiteObject } from "@ionic-native/sqlite";

@Injectable()
export class SqlStorageProvider {
  //constructor(private sqlLite: SQLite) {}
  public hapyDB: any;
  constructor(private zone: NgZone) {
    if (window["openDatabase"]) {
      this.hapyDB = window["openDatabase"](
        "Hapy_db",
        "0.1",
        "Hapy Database",
        1024 * 1024
      );
    }
  }

  createSQLLiteDB(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.zone.run(res => {
        this.createTables().then(res => {
          resolve(true);
        });
      });
    });
  }

  createTables(): Promise<any> {
    return new Promise((resolve, reject) => {
      console.log(this.hapyDB);

      this.hapyDB.transaction(t => {
        t.executeSql(
          "create table chat (id int identity, status bit default 0, name nvarchar(50), sendby nvarchar(50), sdate bigint, dtime bigint, rtime bigint, ismediacontent bit default 0, mediatype nvarchar(20), message nvarchar(max), profileimage nvarchar(max))"
        );
        resolve(true);
      });
    });
  }
}
