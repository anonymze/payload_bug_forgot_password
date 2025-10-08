'use client'

import { Button } from '@payloadcms/ui'
import { handleUserAction } from './actions'

export function AButton({ userId }: { userId: string }) {
  return (
    <div>
      <Button
        onClick={async () => {
          const result = await handleUserAction(userId)
          alert(JSON.stringify(result, null, 2))
        }}
      >
        Server Action
      </Button>
    </div>
  )
}