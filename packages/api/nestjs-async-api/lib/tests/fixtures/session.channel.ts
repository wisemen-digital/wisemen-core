import { ApiProperty } from '@nestjs/swagger'
import { createChannel } from '../../create-channel.js'

class SessionState {
  @ApiProperty({ type: String, format: 'uuid', nullable: true, description: 'Current exercise' })
  currentTestExerciseUuid: string | null

  @ApiProperty({ type: Boolean })
  acceptInput: boolean

  @ApiProperty({ type: String, required: false })
  label?: string

  @ApiProperty({ enum: ['passed', 'failed'], enumName: 'Grade', nullable: true })
  grade: string | null

  @ApiProperty({ type: 'array', items: { type: 'string', nullable: true }, nullable: true })
  answers: Array<string | null> | null
}

export const SessionStateChannel = createChannel('session.state', {
  parameters: {},
  operations: { setState: { action: 'send', messages: [SessionState] } }
})
