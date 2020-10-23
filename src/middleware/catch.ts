import { Next } from '../index'
import DJContext from '../context'

export default async (context: DJContext, next: Next) => {
  try {
    await next()
  } catch (error) {
    context.log(error)
    context.setResponse(100006, error.message || '服务器错误')
  }
}
