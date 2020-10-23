import crypto from 'crypto'
import jwt from 'jsonwebtoken'

export class Crypto {
  private constructor() {}

  static md5(context: string) {
    const md5 = crypto.createHash('md5')
    return md5.update(context).digest('hex')
  }

  static jwt(params: any, privateKey?: string) {
    return jwt.sign(params, privateKey, { algorithm: 'RS256' })
  }

  static unjwt(token: string, privateKey?: string) {
    return jwt.verify(token, privateKey)
  }
}
