import mysql from 'mysql2/promise'
import dbBuilder, { Options } from './db-builder'

export default class Database {
  pool: mysql.Pool

  connection: mysql.PoolConnection

  async init(useLocalIfExist: boolean = true) {
    const env = process.env

    const isLocal = env.local === 'true'
    let host = env.DB_HOST
    let user = env.DB_USER
    let password = env.DB_PASSWORD
    let database = env.DB_DATABASE

    if (useLocalIfExist && isLocal) {
      host = env.DB_LOCAL_HOST ?? host
      user = env.DB_LOCAL_USER ?? user
      password = env.DB_LOCAL_PASSWORD ?? password
      database = env.DB_LOCAL_DATABASE ?? database
    }

    this.pool = mysql.createPool({
      host,
      user,
      password,
      database,
    })
  }

  async initConnection() {
    this.connection = await this.pool.getConnection()
  }

  releaseConnection() {
    this.connection.release()
  }

  async query(...args: any[]) {
    if (!this.connection) {
      await this.initConnection()
    }

    const [rows] = await this.connection.query.apply(this.connection, args)
    return rows
  }

  UNSAFE_builder(options: Options) {
    return dbBuilder.call(this, options)
  }
}
