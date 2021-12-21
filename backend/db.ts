import mysql from "mysql2/promise.js";
import { DatabaseInfo } from "./interfaces";

export class Database {
  private db: mysql.Pool;

  constructor(dbInfo: DatabaseInfo) {
    this.db = mysql.createPool({
      host    : dbInfo.host,
      user    : dbInfo.user,
      password: dbInfo.password,
      database: dbInfo.database,
      multipleStatements: true
    });
  }

  async Query(sql: string, args?: any): Promise<any[]> { // eslint-disable-line
    const rows = await this.db.query(sql, args);
    return [rows];
  }

  // ==================== SELECT ====================
  async SampleSelect(): Promise<string[]|null> {
    const [results] = await this.Query(`SELECT * FROM users LIMIT 1`);
    console.log(results[0]);
    if (results.length) return results[0];
    else                return null;
  }

  // ==================== INSERT ====================
  async SampleInsert(username: string, password: string): Promise<void> {
    await this.Query(`
      INSERT INTO users (username, password)
      VALUES (?,?)
      ON DUPLICATE KEY UPDATE
      username=VALUES(username), password=VALUES(password)
    `, [username, password]);
  }

  // ==================== UPDATE ====================

  // ==================== DELETE ====================
}
