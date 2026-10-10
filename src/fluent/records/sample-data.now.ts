import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

// Demo data (unload.demo): `now-sdk install` loads it by default; pass `--demoData false` to skip it.
Record({
    $id: Now.ID['sample_item_1'],
    $meta: { installMethod: 'demo' },
    table: 'x_snc_example_item',
    data: {
        x_snc_example_name: 'Set up the development environment',
        x_snc_example_description: 'Install Node.js, run npm run setup, add now-sdk auth, and deploy once',
        x_snc_example_category: 'important',
        x_snc_example_priority: 2,
    },
})

Record({
    $id: Now.ID['sample_item_2'],
    $meta: { installMethod: 'demo' },
    table: 'x_snc_example_item',
    data: {
        x_snc_example_name: 'Add a table',
        x_snc_example_description: 'Define the schema with Table(), then add ACLs, service methods, routes and an ATF test',
        x_snc_example_category: 'general',
        x_snc_example_priority: 3,
    },
})

Record({
    $id: Now.ID['sample_item_3'],
    $meta: { installMethod: 'demo' },
    table: 'x_snc_example_item',
    data: {
        x_snc_example_name: 'Ship a UI page',
        x_snc_example_description: 'Call the Scripted REST API with fetch() and the X-UserToken header',
        x_snc_example_category: 'urgent',
        x_snc_example_priority: 1,
    },
})
