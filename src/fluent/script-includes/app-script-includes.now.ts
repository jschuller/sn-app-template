import '@servicenow/sdk/global'
import { ScriptInclude } from '@servicenow/sdk/core'

ScriptInclude({
    $id: Now.ID['app_service_si'],
    name: 'AppService',
    description: 'Core service — CRUD operations and utility functions for Example Items',
    active: true,
    clientCallable: false,
    script: Now.include('../../server/AppService.server.js'),
    apiName: 'x_snc_example.AppService',
    mobileCallable: false,
    sandboxCallable: false,
})
