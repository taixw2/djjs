import serverlessDB from 'scf-nodejs-serverlessdb-sdk'

export default class Database {
  #pool: any

  async init(db: string) {
    this.#pool = await serverlessDB.database(db).pool()
  }

  query(...args: any[]) {
    return this.#pool.queryAsync(...args)
  }

  queryOne(...args: any[]) {
    return this.query(...args).then((res: any) => res[0])
  }
}
