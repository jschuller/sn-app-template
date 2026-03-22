import '@servicenow/sdk/global'
import { Role } from '@servicenow/sdk/core'

Role({
    $id: Now.ID['example_admin_role'],
    name: 'x_snc_example.admin',
    description: 'Full access to all Example App features',
})

Role({
    $id: Now.ID['example_user_role'],
    name: 'x_snc_example.user',
    description: 'View and create records',
})
