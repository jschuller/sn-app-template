import '@servicenow/sdk/global'
import { ScriptInclude } from '@servicenow/sdk/core'

ScriptInclude({
    $id: Now.ID['app_service_si'],
    name: 'AppService',
    description: 'Example Item service: validated, ACL-enforced CRUD used by the REST API',
    active: true,
    // Only this application calls AppService; widen to 'public' if another scope needs it.
    accessibleFrom: 'package_private',
    clientCallable: false,
    script: Now.include('../../server/AppService.server.js'),
    apiName: 'x_snc_example.AppService',
})
