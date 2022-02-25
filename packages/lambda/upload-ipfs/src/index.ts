import { APIGatewayProxyHandler } from 'aws-lambda'
import { pinIpfs } from './pinIpfs'

export const handler: APIGatewayProxyHandler = async (event) => {
  console.log(event)
  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: 'Missing body',
      }),
    }
  }
  const data = JSON.parse(event.body)
  if(!data.rawSvg) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: 'Missing rawSvg',
      }),
    }
  }
  if(!data.name) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: 'Missing name',
      }),
    }
  }

  const cid = await pinIpfs(data.rawSvg, data.name)

  const response = {
    statusCode: 201,
    body: JSON.stringify({
      message: 'Success',
      cid,
    }),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    }
  }

  return response
}
