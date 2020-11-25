const root = require('../src/index')

async function invokeSCF(func) {
  return await func(
    {
      requestContext: {
        serviceId: 'service-f94sy04v',
        path: '/test/{path}',
        httpMethod: 'POST',
        requestId: 'c6af9ac6-7b61-11e6-9a41-93e8deadbeef',
        identity: {
          secretId: 'abdcdxxxxxxxsdfs',
        },
        sourceIp: '10.0.2.14',
        stage: 'release',
      },
      headers: {
        'Accept-Language': 'en-US,en,cn',
        Accept: 'text/html,application/xml,application/json',
        Host: 'service-3ei3tii4-251000691.ap-guangzhou.apigateway.myqloud.com',
        'User-Agent': 'User Agent String',
      },
      body: '{"test":"body"}',
      pathParameters: {
        path: 'value',
      },
      queryStringParameters: {
        foo: 'bar',
      },
      headerParameters: {
        Refer: '10.0.2.14',
      },
      stageVariables: {
        stage: 'release',
      },
      path: '/test/value',
      queryString: {
        foo: 'bar',
        bob: 'alice',
      },
      httpMethod: 'POST',
    },
    {
      getRemainingTimeInMillis: () => {},
      memory_limit_in_mb: 128,
      time_limit_in_ms: 3000,
      request_id: '4ca7089c-3bb0-48cf-bcdb-26d130fed2ae',
      environment: '{"SCF_NAMESPACE":"default"}',
      environ: 'SCF_NAMESPACE=default;SCF_NAMESPACE=default',
      function_version: '$LATEST',
      function_name: 'test',
      namespace: 'default',
      tencentcloud_region: 'ap-chengdu',
      tencentcloud_appid: '1253970226',
      tencentcloud_uin: '3473058547',
    },
  )
}

test('should return empty object', async () => {})
