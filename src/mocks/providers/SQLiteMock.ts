import { SQLiteDatabaseConfig } from "@ionic-native/sqlite";

class SQLiteObject {
  db: any;

  constructor(db: any) {
    this.db = db;
  }

  executeSql(queryStatement: string, params: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.transaction(tx => {
        tx.executeSql(
          queryStatement,
          params,
          (tx, result) => {
            resolve(result);
          },
          error => reject(error)
        );
      });
    });
  }
}

export class SQLiteMock {
  constructor() {}

  public create(config: SQLiteDatabaseConfig): Promise<SQLiteObject> {
    var db = (<any>window).openDatabase(
      "mydb",
      "",
      "my first database",
      2 * 1024 * 1024
    );

    return new Promise((resolve, reject) => {
      resolve(new SQLiteObject(db));
    });
  }
}
