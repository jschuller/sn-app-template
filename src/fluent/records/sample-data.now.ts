import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

Record({
    $id: Now.ID['sample_item_1'],
    table: 'x_snc_example_item',
    data: {
        x_snc_example_name: 'Setup development environment',
        x_snc_example_description: 'Install Node.js, configure now-sdk auth, and verify deployment pipeline',
        x_snc_example_category: 'important',
        x_snc_example_priority: 1,
    },
})

Record({
    $id: Now.ID['sample_item_2'],
    table: 'x_snc_example_item',
    data: {
        x_snc_example_name: 'Create additional tables',
        x_snc_example_description: 'Define table schemas using Table() Fluent API with appropriate column types',
        x_snc_example_category: 'general',
        x_snc_example_priority: 2,
    },
})

Record({
    $id: Now.ID['sample_item_3'],
    table: 'x_snc_example_item',
    data: {
        x_snc_example_name: 'Build custom UI page',
        x_snc_example_description: 'Create a React BYOUI page using fetch() with X-UserToken for CSRF protection',
        x_snc_example_category: 'urgent',
        x_snc_example_priority: 3,
    },
})
