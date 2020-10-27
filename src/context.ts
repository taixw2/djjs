import { SCFAPIGatewayEvent, SCFContext } from './index'
import { SDK as SCFSDK, LogType as SCFLogType } from 'tencentcloud-serverless-nodejs'
import Schema, { Rules } from 'async-validator'
import Database from './database'
import { Crypto } from './crypto'

export default class DJContext {
  constructor(public event: SCFAPIGatewayEvent, private context: SCFContext) {}

  #response = {}

  #headers = {}

  #status = 200

  public readonly db = new Database()

  public readonly crypto = Crypto

  /**
   * 是否穿透模式
   */
  public strike = true

  public get query() {
    return this.event.queryString
  }

  public get body() {
    try {
      return JSON.parse(this.event.body)
    } catch (error) {
      return {}
    }
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
      console.warn('穿透模式下设置 status 无效: ' + this.context.request_id)
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
      console.warn('穿透模式下设置 headers 无效: ' + this.context.request_id)
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
   * 打印日志，会携带 requestId 信息
   * @param headers
   */
  public log(...msg: any[]) {
    console.log(this.context.request_id, ...msg)
  }

  /**
   * 调用其它的云函数
   */
  public async invoke(functionName: string, data?: Record<string, any>, option?: Record<string, string>) {
    const sdk = new SCFSDK({ region: option?.region || 'ap-guangzhou', ...option })
    if (!process.env.TENCENTCLOUD_SECRETID || !process.env.TENCENTCLOUD_SECRETKEY) {
      return console.warn(this.context.request_id, '缺少环境变量')
    }

    let responseRef = { current: null }
    try {
      responseRef.current = await sdk.invoke({
        LogType: SCFLogType.Tail,
        functionName,
        data: {
          request_id: this.context.request_id,
          queryString: data.query ?? data.queryString ?? {},
          body: data.body ? JSON.stringify(data.body) : '{}',
        },
      })
      // 穿透模式解析
      return JSON.parse(responseRef.current.Result.RetMsg)
    } catch (error) {
      this.log(responseRef.current, error)
    }
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
