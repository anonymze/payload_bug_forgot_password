/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import config from '@payload-config'
import '@payloadcms/next/css'
import {
  REST_DELETE,
  REST_GET,
  REST_OPTIONS,
  REST_PATCH,
  REST_POST,
  REST_PUT,
} from '@payloadcms/next/routes'
import { NextRequest } from 'next/server'

const wrappedPOST = async (req: NextRequest, context: any) => {
  console.log('POST request received')
  const response = await REST_POST(config)(req, context)
  console.log('Response status:', response.status)
  return response;
}

export const GET = REST_GET(config)
export const POST = wrappedPOST
export const DELETE = REST_DELETE(config)
export const PATCH = REST_PATCH(config)
export const PUT = REST_PUT(config)
export const OPTIONS = REST_OPTIONS(config)
