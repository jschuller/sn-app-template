import '@servicenow/sdk/global'
import { Acl } from '@servicenow/sdk/core'
import { exampleAdminRole, exampleUserRole } from '../roles/app-roles.now'

// One ACL per operation. The admin role contains the user role, so `exampleUserRole` grants both.

Acl({
    $id: Now.ID['example_item_read_acl'],
    type: 'record',
    table: 'x_snc_example_item',
    operation: 'read',
    roles: [exampleUserRole],
})

Acl({
    $id: Now.ID['example_item_create_acl'],
    type: 'record',
    table: 'x_snc_example_item',
    operation: 'create',
    roles: [exampleUserRole],
})

Acl({
    $id: Now.ID['example_item_write_acl'],
    type: 'record',
    table: 'x_snc_example_item',
    operation: 'write',
    roles: [exampleAdminRole],
})

Acl({
    $id: Now.ID['example_item_delete_acl'],
    type: 'record',
    table: 'x_snc_example_item',
    operation: 'delete',
    roles: [exampleAdminRole],
})

// Gate the Scripted REST API itself. Record ACLs still apply inside it because
// AppService uses GlideRecordSecure.
export const exampleApiAcl = Acl({
    $id: Now.ID['example_api_acl'],
    type: 'rest_endpoint',
    name: 'x_snc_example.example_api',
    operation: 'execute',
    roles: [exampleUserRole],
})
