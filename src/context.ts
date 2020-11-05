import { SCFAPIGatewayEvent, SCFContext } from './index'
const FCClient = require('@alicloud/fc2')
import Database from './database'

export default class DJContext {
  constructor(private event: SCFAPIGatewayEvent, private context: SCFContext) {}

  #response = {}

  #headers = {}

  #status = 200

  public readonly db = new Database()

  /**
   * 是否穿透模式
   */
  public strike = false

  public get query() {
    return this.event.queryParameters
  }

  public get body() {
    return JSON.parse(this.event.body)
  }

  /**
   * 获取最终响应值
   */
  public get response() {
    if (this.strike) return this.#response
    return {
      isBase64Encoded: false,
      statusCode: this.#status,
      headers: this.#headers,
      body: JSON.stringify(this.#response),
    }
  }

  /**
   * 非穿透模式下设置状态码
   * @param statusCode
   */
  public setStatus(statusCode: number) {
    if (this.strike) {
      console.warn('穿透模式下设置 status 无效: ')
      return
    }
    this.#status = statusCode
  }

  /**
   * 非穿透模式下设置请求头
   * @param headers
   */
  public setHeaders(headers: Record<string, string>) {
    if (this.strike) {
      console.warn('穿透模式下设置 headers 无效: ')
      return
    }
    Object.assign(this.#headers, headers)
  }

  /**
   * 非穿透模式下设置请求头
   * @param headers
   */
  public setHeader(key: string, value: string) {
    this.#headers[key] = value
  }

  /**
   * 设置响应
   * @param response 正常响应
   */
  public setResponse(data: Record<string, string>, ec: number, em: string): void
  public setResponse(ec: number, em: string): void
  public setResponse(data: Record<string, string> | number, ec: number | string, em?: string) {
    let [_data, _ec, _em] = arguments
    if (typeof data === 'number') {
      _em = _ec
      _ec = _data
      _data = null
    }
    this.#response = {
      ec: _ec ?? 0,
      data: _data,
      errMsg: _em ?? '',
    }
  }

  /**
   * 调用其它的云函数
   */
  public async invoke(
    serviceName: string,
    functionName: string,
    data?: Record<string, any>,
    option?: Record<string, string>,
  ) {
    const client = new FCClient(this.context.accountId, {
      accessKeyID: this.context.credentials.accessKeyId,
      accessKeySecret: this.context.credentials.accessKeySecret,
      securityToken: this.context.credentials.securityToken,
      region: 'cn-shenzhen',
      ...option,
    })
    return await client.invokeFunction(serviceName, functionName, JSON.stringify(data))
  }
}
