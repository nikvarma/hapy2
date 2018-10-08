import { Injectable, OnInit, NgZone } from "@angular/core";
import { SQLite, SQLiteObject } from "@ionic-native/sqlite";

@Injectable()
export class SqlStorageProvider {
  constructor(private sqlLite: SQLite) {}
  public hapyDB: SQLiteObject;
  // constructor(private zone: NgZone) {
  //   if (window["openDatabase"]) {
  //     this.hapyDB = window["openDatabase"](
  //       "Hapy_db",
  //       "0.1",
  //       "Hapy Database",
  //       1024 * 1024
  //     );
  //   }
  // }

  createSQLLiteDB(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.sqlLite
        .create({
          name: "__HapySQLDB.db",
          location: "default",
          key: "_h@pydb-123"
        })
        .then((res: SQLiteObject) => {
          this.createTables(res).then(res => {
            res = this.hapyDB;
            resolve(true);
          });
        });
    });
  }

  createTables(sqlObject: SQLiteObject): Promise<any> {
    return new Promise((resolve, reject) => {
      this.hapyDB
        .open()
        .then(res => {
          this.hapyDB
            .transaction(t => {
              t.executeSql(
                "create table chat (id int identity, status bit default 0, name nvarchar(50), sendby nvarchar(50), sdate bigint, dtime bigint, rtime bigint, ismediacontent bit default 0, mediatype nvarchar(20), message nvarchar(max), profileimage nvarchar(max))"
              );
              t.executeSql(
                "create table call (id int identity, status bit default 0, name nvarchar(50), sendby nvarchar(50), callstatus nvarchar(20), sdate bigint, profileimage nvarchar(max), calltype nvarchar(50))"
              );
              resolve(true);
            })
            .catch(err => {
              console.log(err);
              resolve(true);
            });
          this.closeConn();
        })
        .catch(err => {
          console.log(err);
          resolve(true);
        });
    });
  }

  closeConn(): void {
    this.hapyDB.close();
  }
}
