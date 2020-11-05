import mysql from 'mysql2/promise'

export default class Database {
  pool: mysql.Pool

  connection: mysql.PoolConnection

  async init() {
    this.pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    })
  }

  async initConnection() {
    this.connection = await this.pool.getConnection()
  }

  releaseConnection() {
    this.connection.release()
  }

  async query(...args: any[]) {
    const [rows] = await this.connection.query.apply(this.connection, args)
    return rows
  }
}
