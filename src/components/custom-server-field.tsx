'use server'

import { UIFieldServerComponent, UIFieldServerProps } from 'payload'
import { AButton } from './action-button'

const CustomServerButton: UIFieldServerComponent = async (props: UIFieldServerProps) => {
  const { siblingData } = props
  return (
    <div>
      <h3>Custom Server Button Wrapper</h3>
    </div>
  )
}

export default CustomServerButton
