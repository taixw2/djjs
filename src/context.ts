import { SCFAPIGatewayEvent, SCFContext } from './index'
import FCClient from '@alicloud/fc2'
import Schema, { Rules } from 'async-validator'
import Database from './database'
import { Crypto } from './crypto'

export default class DJContext {
  event: SCFAPIGatewayEvent

  public body: {}

  constructor(public eventbuf: Buffer, private context: SCFContext) {
    try {
      this.event = JSON.parse(eventbuf.toString())
    } catch (error) {
      this.setResponse(100003, '参数异常')
    }

    try {
      let body = this.event.body
      if (this.event.isBase64Encoded) {
        body = Buffer.from(body, 'base64').toString()
      }

      if (body) {
        this.body = JSON.parse(body)
      }
    } catch (error) {
      // 解析 body 异常
      console.log('解析 body 异常', this.event.body)
    }
  }

  #response = {}

  #headers = {}

  #status = 200

  public readonly db = new Database()

  public readonly crypto = Crypto

  /**
   * 是否穿透模式
   */
  public strike = false

  public get query() {
    return this.event.queryParameters ?? {}
  }

  /**
   * 获取最终响应值
   */
  public get response() {
    if (this.strike) return this.#response
    return {
      isBase64Encoded: false,
      headers: this.#headers,
      statusCode: this.#status,
      body: this.#response,
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
    const response = await client.invokeFunction(serviceName, functionName, JSON.stringify(data))
    console.log('invoke requestid', response.headers['x-fc-request-id'])
    return response.data
  }

  /**
   * 参数校验
   * @param descriptor 校验描述
   * @param body 校验参数
   */
  async validator(descriptor: Rules, body?: Record<string, string>) {
    const validator = new Schema(descriptor)
    try {
      const hasQuery = Object.keys(this.query).length
      await validator.validate(body ? body : hasQuery ? this.query : this.body)
    } catch (validationError) {
      return Promise.reject(validationError.errors[0])
    }
    return Promise.resolve()
  }
}
