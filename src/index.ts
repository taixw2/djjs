import DJContext from './context'
import compose from 'koa-compose'
import _catch from './middleware/catch'

export interface SCFContext {
  requestId: string
  credentials: {
    accessKeyId: string
    accessKeySecret: string
    securityToken: string
  }
  function: {
    name: string
    handler: string
    memory: number
    timeout: number
    initializer: string
    initializationTimeout: number
  }
  service: {
    name: string
    logProject: string
    logStore: string
    qualifier: string
    versionId: string
  }
  region: string
  accountId: string
}

export interface SCFAPIGatewayEvent {
  path: string
  httpMethod: string
  headers: Record<string, string>
  queryParameters: Record<string, string>
  pathParameters: Record<string, string>
  body: string
  isBase64Encoded: boolean
}

export type Next = () => Promise<any>
export type Middlewares = (context: DJContext, next?: Next) => Promise<void>

function func(...middlewares: Middlewares[]) {
  return async (eventbuf: Buffer, scfContext: SCFContext, callback: any) => {
    const context = new DJContext(eventbuf, scfContext)
    await compose(middlewares)(context)
    return callback(null, context.response)
  }
}

const middlewares = func.bind(null, _catch) as typeof func
export default middlewares
export { middlewares as func }
