import type {
  CollectionAfterChangeHook,
  CollectionConfig,
} from 'payload'

import { formFieldBlocks } from '#fields.ts'
import type {
  FormBuilderOptions,
  FormDocument,
  FormSubmissionDocument,
  SubmissionValue,
} from '#types.ts'

export function createFormsCollection(options: FormBuilderOptions): CollectionConfig {
  const slug = options.formsSlug ?? 'forms'

  return {
    ...options.formsCollectionOverrides,
    admin: {
      defaultColumns: [
        'title',
        'slug',
        'updatedAt',
      ],
      useAsTitle: 'title',
      ...options.formsCollectionOverrides?.admin,
    },
    fields: [
      {
        tabs: [
          {
            fields: [
              {
                name: 'title',
                localized: true,
                required: true,
                type: 'text',
              },
              {
                name: 'slug',
                index: true,
                required: true,
                type: 'text',
                unique: true,
              },
              {
                name: 'description',
                localized: true,
                type: 'textarea',
              },
            ],
            label: 'General',
          },
          {
            fields: [
              {
                name: 'fields',
                admin: {
                  description: 'Build the fields shown to visitors. Translate this complete field list for each locale.',
                },
                blocks: formFieldBlocks,
                minRows: 1,
                required: true,
                type: 'blocks',
              },
            ],
            label: 'Fields',
          },
          {
            fields: [
              {
                name: 'confirmation',
                fields: [
                  {
                    name: 'submitLabel',
                    defaultValue: 'Send',
                    localized: true,
                    type: 'text',
                  },
                  {
                    name: 'successMessage',
                    defaultValue: 'Thank you. We received your submission.',
                    localized: true,
                    type: 'textarea',
                  },
                ],
                type: 'group',
              },
            ],
            label: 'Confirmation',
          },
        ],
        type: 'tabs',
      },
    ],
    labels: {
      plural: 'Forms',
      singular: 'Form',
    },
    slug,
    versions: {
      drafts: true,
      maxPerDoc: 20,
    },
  }
}

export function createSubmissionsCollection(options: FormBuilderOptions): CollectionConfig {
  const slug = options.submissionsSlug ?? 'form-submissions'
  const onSubmission: CollectionAfterChangeHook = async ({
    doc,
    operation,
    req,
  }) => {
    if (operation !== 'create' || !options.onSubmission) { return doc }

    const formRelation = doc.form as unknown
    const formId = typeof formRelation === 'string'
      ? formRelation
      : (typeof formRelation === 'object' && formRelation !== null && 'id' in formRelation
          ? String(formRelation.id)
          : undefined)

    if (!formId) { return doc }

    const form = await req.payload.findByID({
      id: formId,
      collection: (options.formsSlug ?? 'forms') as never,
      depth: 0,
      overrideAccess: true,
      req,
    }) as FormDocument
    const values = Array.isArray(doc.data) ? doc.data as SubmissionValue[] : []

    await options.onSubmission({
      form,
      payload: req.payload,
      req,
      submission: doc as FormSubmissionDocument,
      values,
    })

    return doc
  }

  return {
    ...options.submissionsCollectionOverrides,
    admin: {
      defaultColumns: [
        'form',
        'submittedAt',
        'updatedAt',
      ],
      useAsTitle: 'id',
      ...options.submissionsCollectionOverrides?.admin,
    },
    defaultSort: '-submittedAt',
    fields: [
      {
        tabs: [
          {
            fields: [
              {
                name: 'form',
                admin: {
                  readOnly: true,
                },
                index: true,
                relationTo: (options.formsSlug ?? 'forms') as never,
                required: true,
                type: 'relationship',
              },
              {
                name: 'submittedAt',
                admin: {
                  date: {
                    pickerAppearance: 'dayAndTime',
                  },
                  readOnly: true,
                },
                index: true,
                required: true,
                type: 'date',
              },
              {
                name: 'data',
                admin: {
                  components: {
                    Field: '@wisemen/payload-core-form-builder/admin#SubmissionDataField',
                  },
                  readOnly: true,
                },
                required: true,
                type: 'json',
              },
            ],
            label: 'Answers',
          },
          {
            fields: [
              {
                name: 'state',
                defaultValue: 'new',
                options: [
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
                ],
                type: 'select',
              },
            ],
            label: 'Processing',
          },
          {
            fields: [
              {
                name: 'internalNotes',
                type: 'textarea',
              },
            ],
            label: 'Internal notes',
          },
        ],
        type: 'tabs',
      },
    ],
    hooks: {
      ...options.submissionsCollectionOverrides?.hooks,
      afterChange: [
        onSubmission,
        ...(options.submissionsCollectionOverrides?.hooks?.afterChange ?? []),
      ],
    },
    labels: {
      plural: 'Form submissions',
      singular: 'Form submission',
    },
    slug,
  }
}
