import type { CollectionConfig } from 'payload'

type SubmissionField = NonNullable<CollectionConfig['fields']>[number]
type SubmissionTab = Extract<SubmissionField, { type: 'tabs' }>['tabs'][number]

export const FORM_SUBMISSION_COLLECTION_SLUGS = [
  'form-submissions',
] as const

export const submissionStateOptions = [
  {
    label: 'New',
    value: 'new',
  },
  {
    label: 'In progress',
    value: 'in_progress',
  },
  {
    label: 'Done',
    value: 'done',
  },
  {
    label: 'Archived',
    value: 'archived',
  },
] as const

export function makeFieldsReadOnly(fields: SubmissionField[]): SubmissionField[] {
  return fields.map((field) => {
    const nextField: any = {
      ...field,
      admin: {
        ...field.admin,
        readOnly: true,
      },
    }

    if ('fields' in (field as any) && Array.isArray((field as any).fields)) {
      nextField.fields = makeFieldsReadOnly((field as any).fields)
    }

    if ((field as any).type === 'tabs' && Array.isArray((field as any).tabs)) {
      nextField.tabs = (field as any).tabs.map((tab: any) => ({
        ...tab,
        fields: makeFieldsReadOnly(tab.fields),
      }))
    }

    return nextField as SubmissionField
  })
}

export function createSubmissionWorkflowTab(): SubmissionTab {
  return {
    fields: [
      {
        name: 'state',
        defaultValue: 'new',
        options: [
          ...submissionStateOptions,
        ],
        type: 'select',
      },
      {
        name: 'internalNotes',
        type: 'textarea',
      },
    ],
    label: 'Follow up',
  }
}
