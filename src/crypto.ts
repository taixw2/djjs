import crypto from 'crypto'
import jwt from 'jsonwebtoken'

export class Crypto {
  private constructor() {}

  static md5(context: string) {
    const md5 = crypto.createHash('md5')
    return md5.update(context).digest('hex')
  }

  static jwt(params: any, privateKey?: string, options?: jwt.SignOptions) {
    return jwt.sign(params, privateKey, options ?? { algorithm: 'RS256' })
  }

  static unjwt(token: string, privateKey?: string, options?: jwt.VerifyOptions) {
    return jwt.verify(token, privateKey, options)
  }
}
