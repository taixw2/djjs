// 内部用的工具类函数

import { SCFContext } from '.'

export const ufunc = (handler: (event: any, context: SCFContext) => Promise<any>) => {
  return async (eventBuf: Buffer, context: SCFContext, callback: (errorMessage?: string, data?: any) => void) => {
    let event = null
    try {
      event = JSON.parse(eventBuf.toString())
    } catch (error) {
      callback('参数解析工具异常')
      return
    }
    try {
      const result = await handler(event, context)
      callback(null, result)
    } catch (error) {
      callback(error, null)
    }
  }
}
