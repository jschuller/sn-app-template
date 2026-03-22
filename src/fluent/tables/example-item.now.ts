import '@servicenow/sdk/global'
import { Table, StringColumn, ChoiceColumn, IntegerColumn, DateTimeColumn } from '@servicenow/sdk/core'

export const x_snc_example_item = Table({
    name: 'x_snc_example_item',
    label: 'Example Item',
    accessibleFrom: 'public',
    allowWebServiceAccess: true,
    actions: ['read', 'update', 'delete', 'create'],
    callerAccess: 'none',
    schema: {
        x_snc_example_name: StringColumn({ label: 'Name', maxLength: 200, mandatory: true }),
        x_snc_example_description: StringColumn({ label: 'Description', maxLength: 4000 }),
        x_snc_example_category: ChoiceColumn({
            label: 'Category',
            choices: {
                general: { label: 'General' },
                important: { label: 'Important' },
                urgent: { label: 'Urgent' },
            },
            defaultValue: 'general',
        }),
        x_snc_example_priority: IntegerColumn({ label: 'Priority' }),
        x_snc_example_created_date: DateTimeColumn({ label: 'Created Date' }),
    },
})
