import DJContext from './context'

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

function func(func: (context: DJContext) => Promise<void>) {
  return async (scfEvent: SCFAPIGatewayEvent, scfContext: SCFContext) => {
    const context = new DJContext(scfEvent, scfContext)
    await func(context)
    return context.response
  }
}

export default func
export { func }
