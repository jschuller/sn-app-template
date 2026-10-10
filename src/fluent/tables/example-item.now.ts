import '@servicenow/sdk/global'
import { Table, StringColumn, ChoiceColumn, IntegerColumn } from '@servicenow/sdk/core'

export const x_snc_example_item = Table({
    name: 'x_snc_example_item',
    label: 'Example Item',
    display: 'x_snc_example_name',
    // Web service access is what the REST Table API (/api/now/table) checks.
    allowWebServiceAccess: true,
    // Cross-scope access: other application scopes may read these records but not change them.
    // Widen `actions` only when another scope must write here; use 'package_private' to hide the
    // table from other scopes entirely.
    accessibleFrom: 'public',
    actions: { read: true },
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
    },
})
