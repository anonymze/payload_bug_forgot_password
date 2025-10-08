"use client"

import { useDocumentInfo, Button, usePayloadAPI } from '@payloadcms/ui'
import { UIFieldClientComponent, UIFieldClientProps } from 'payload'
const CustomClientField: UIFieldClientComponent = (props: UIFieldClientProps) => {
  console.log('CustomButton props:', props)
  const allUsers = usePayloadAPI('/api/admins')
  const { id, initialData } = useDocumentInfo()

  return (
    <div>
      <h3>Custom Client Button</h3>
      <Button
        onClick={() => {
          console.log('Custom action for user:', id, initialData, allUsers)
          alert('Custom action for user ' + JSON.stringify(initialData, null, 2))
        }}
      >
        Custom Action
      </Button>
    </div>
  )
}

export default CustomClientField
