import type {
  Input,
  InputWrapper,
} from '@/types/input.type'
import type { BaseFileUploadProps } from '@/ui/base-file-upload/baseFileUpload.props'

export interface FormFileUploadProps
  extends Input,
  InputWrapper,
  Pick<BaseFileUploadProps, 'accept' | 'isPublic' | 'isValidFile' | 'preprocess'> {
  description: string
}
