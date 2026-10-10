import '@servicenow/sdk/global'
import { CrossScopePrivilege } from '@servicenow/sdk/core'

// Cross-scope privileges declare what this app may use from OTHER scopes. Access to the
// app's own tables needs none, and REST Table API access is governed by the table's
// `allowWebServiceAccess` and ACLs, not by privileges.
//
// AppService calls GlideRecordSecure.getValue (global). On Brazil Patch 0 the platform
// logged "Security restricted: Execute operation on API 'GlideRecordSecure.getValue'"
// and auto-granted it because the app's runtime access tracking was permissive. Declare
// it so the app also works where runtime access is enforced.
CrossScopePrivilege({
    $id: Now.ID['csp_glide_record_secure_get_value'],
    status: 'allowed',
    operation: 'execute',
    targetName: 'GlideRecordSecure.getValue',
    targetScope: 'global',
    targetType: 'scriptable',
})
