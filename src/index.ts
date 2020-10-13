import DJContext from './context'

export interface SCFContext {
  getRemainingTimeInMillis: () => void
  memory_limit_in_mb: number
  time_limit_in_ms: number
  request_id: string
  environment: string
  environ: string
  function_version: string
  function_name: string
  namespace: string
  tencentcloud_region: string
  tencentcloud_appid: string
  tencentcloud_uin: string
}

export interface SCFAPIGatewayEvent {
  requestContext: {
    serviceId: string
    path: string
    httpMethod: string
    requestId: string
    identity: {
      secretId: string
    }
    sourceIp: string
    stage: string
  }
  headers: Record<string, string>
  body: string
  pathParameters: Record<string, string>
  queryStringParameters: Record<string, string>
  headerParameters: Record<string, string>
  stageVariables: Record<string, string>
  path: string
  queryString: Record<string, string>
  httpMethod: string
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
