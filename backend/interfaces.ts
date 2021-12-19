/**
 * @example
 * {
 *   host    : string; "mysql"
 *   user    : string; "root"
 *   password: string; "MySecretPassword"
 *   database: string; "fizz_club"
 * }
 */
export interface DatabaseInfo {
  host    : string;
  user    : string;
  password: string;
  database: string;
}

/**
 * @example
 * {
 *   ENVIRONMENT: string; "local | dev | prod"
 *   mysql: DatabaseInfo;
 * }
 */
export interface Config {
  ENVIRONMENT: string;
  mysql: DatabaseInfo;
}
