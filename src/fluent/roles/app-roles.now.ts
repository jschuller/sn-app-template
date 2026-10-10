import '@servicenow/sdk/global'
import { Role } from '@servicenow/sdk/core'

// Role sys_ids are derived from `name`, so roles take no $id.
export const exampleUserRole = Role({
    name: 'x_snc_example.user',
    description: 'View and create Example Items',
})

export const exampleAdminRole = Role({
    name: 'x_snc_example.admin',
    description: 'Full access to all Example App features',
    containsRoles: [exampleUserRole],
})
