'use server'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

export async function handleUserAction(userId: string) {
  try {
    const payload = await getPayload({ config: configPromise })
    const result = await payload.find({
      collection: 'app-users',
      where: {
        id: { equals: userId },
      },
    })
    return result
  } catch (error) {
    console.error('Error in handleUserAction:', error)
  }
}