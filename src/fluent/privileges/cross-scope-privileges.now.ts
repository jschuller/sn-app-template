import '@servicenow/sdk/global'
import { CrossScopePrivilege } from '@servicenow/sdk/core'

// Cross-scope privileges declare what this app may use from OTHER scopes — here, platform
// script APIs owned by the global scope. The app's own tables need none, and REST Table API
// access is governed by the table's `allowWebServiceAccess` and ACLs.
//
// now.config.json sets runtime access tracking to "enforcing", so an API missing from this
// list is refused at runtime ("Access to <API> from scope <scope> not allowed"). This list is
// complete for the template's code: verified on Brazil Patch 0 by running every REST route
// and the ATF suite under enforcing with no denials. When you call a new platform API, add it
// here — see TROUBLESHOOTING.md ("Access to … not allowed").

// Scripted REST routes read the request
CrossScopePrivilege({
    $id: Now.ID['csp_restapirequest'],
    status: 'allowed',
    operation: 'execute',
    targetName: 'RESTAPIRequest',
    targetScope: 'global',
    targetType: 'scriptable',
})

// AppService.readBody reads request.body.data
CrossScopePrivilege({
    $id: Now.ID['csp_restapirequestbody'],
    status: 'allowed',
    operation: 'execute',
    targetName: 'RESTAPIRequestBody',
    targetScope: 'global',
    targetType: 'scriptable',
})

// AppService.send sets the HTTP status
CrossScopePrivilege({
    $id: Now.ID['csp_scriptableserviceresultbuilder_setstatus'],
    status: 'allowed',
    operation: 'execute',
    targetName: 'ScriptableServiceResultBuilder.setStatus',
    targetScope: 'global',
    targetType: 'scriptable',
})

// AppService.send writes the JSON body
CrossScopePrivilege({
    $id: Now.ID['csp_scriptableserviceresultbuilder_setbody'],
    status: 'allowed',
    operation: 'execute',
    targetName: 'ScriptableServiceResultBuilder.setBody',
    targetScope: 'global',
    targetType: 'scriptable',
})

// AppService and the business rule read field values
CrossScopePrivilege({
    $id: Now.ID['csp_glide_record_secure_get_value'],
    status: 'allowed',
    operation: 'execute',
    targetName: 'GlideRecordSecure.getValue',
    targetScope: 'global',
    targetType: 'scriptable',
})

// AppService and the business rule set field values
CrossScopePrivilege({
    $id: Now.ID['csp_gliderecord_setvalue'],
    status: 'allowed',
    operation: 'execute',
    targetName: 'GlideRecord.setValue',
    targetScope: 'global',
    targetType: 'scriptable',
})

// createItem
CrossScopePrivilege({
    $id: Now.ID['csp_gliderecord_insert'],
    status: 'allowed',
    operation: 'execute',
    targetName: 'GlideRecord.insert',
    targetScope: 'global',
    targetType: 'scriptable',
})

// updateItem
CrossScopePrivilege({
    $id: Now.ID['csp_gliderecord_update'],
    status: 'allowed',
    operation: 'execute',
    targetName: 'GlideRecord.update',
    targetScope: 'global',
    targetType: 'scriptable',
})

// deleteItem
CrossScopePrivilege({
    $id: Now.ID['csp_gliderecord_deleterecord'],
    status: 'allowed',
    operation: 'execute',
    targetName: 'GlideRecord.deleteRecord',
    targetScope: 'global',
    targetType: 'scriptable',
})
