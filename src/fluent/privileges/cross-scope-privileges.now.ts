import '@servicenow/sdk/global'
import { CrossScopePrivilege } from '@servicenow/sdk/core'

// Required for REST Table API access to scoped app tables from global scope.
// Without these, the REST Table API returns 403 even with valid credentials.
// Pattern: 1 table × 4 operations = 4 privileges.

CrossScopePrivilege({ $id: Now.ID['csp_item_read'], operation: 'read', status: 'allowed', targetName: 'x_snc_example_item', targetScope: 'x_snc_example', targetType: 'sys_db_object' })
CrossScopePrivilege({ $id: Now.ID['csp_item_create'], operation: 'create', status: 'allowed', targetName: 'x_snc_example_item', targetScope: 'x_snc_example', targetType: 'sys_db_object' })
CrossScopePrivilege({ $id: Now.ID['csp_item_write'], operation: 'write', status: 'allowed', targetName: 'x_snc_example_item', targetScope: 'x_snc_example', targetType: 'sys_db_object' })
CrossScopePrivilege({ $id: Now.ID['csp_item_delete'], operation: 'delete', status: 'allowed', targetName: 'x_snc_example_item', targetScope: 'x_snc_example', targetType: 'sys_db_object' })
