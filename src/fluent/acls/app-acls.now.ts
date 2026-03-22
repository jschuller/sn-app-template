import '@servicenow/sdk/global'
import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['example_item_read_acl'],
    type: 'record',
    table: 'x_snc_example_item',
    operation: 'read',
    roles: ['x_snc_example.user', 'x_snc_example.admin'],
    active: true,
})

Acl({
    $id: Now.ID['example_item_write_acl'],
    type: 'record',
    table: 'x_snc_example_item',
    operation: 'write',
    roles: ['x_snc_example.admin'],
    active: true,
})

Acl({
    $id: Now.ID['example_item_create_acl'],
    type: 'record',
    table: 'x_snc_example_item',
    operation: 'create',
    roles: ['x_snc_example.user', 'x_snc_example.admin'],
    active: true,
})

Acl({
    $id: Now.ID['example_item_delete_acl'],
    type: 'record',
    table: 'x_snc_example_item',
    operation: 'delete',
    roles: ['x_snc_example.admin'],
    active: true,
})
