import '@servicenow/sdk/global'
import { RestApi } from '@servicenow/sdk/core'
import { exampleApiAcl } from '../acls/app-acls.now'

// Routes are thin: AppService validates input, enforces record ACLs (GlideRecordSecure)
// and returns { status, body }. Base path: /api/x_snc_example/example_api
//
// Set enforceAcl on every route: a route without it gets the platform default
// ("Scripted REST External Default"), which overrides the API-level setting.
RestApi({
    $id: Now.ID['example_api'],
    name: 'Example API',
    serviceId: 'example_api',
    shortDescription: 'CRUD for Example Items',
    consumes: 'application/json',
    produces: 'application/json',
    enforceAcl: [exampleApiAcl],
    routes: [
        {
            $id: Now.ID['example_api_list'],
            name: 'List Items',
            method: 'GET',
            path: '/items',
            enforceAcl: [exampleApiAcl],
            shortDescription: 'List items, newest first. Query: limit (1-100, default 50), offset',
            parameters: [
                { $id: Now.ID['example_api_list_limit'], name: 'limit', shortDescription: 'Page size, 1-100' },
                { $id: Now.ID['example_api_list_offset'], name: 'offset', shortDescription: 'Rows to skip' },
            ],
            script: `(function process(request, response) {
                var svc = new x_snc_example.AppService();
                svc.send(response, svc.listItems(request.queryParams));
            })(request, response);`,
        },
        {
            $id: Now.ID['example_api_create'],
            name: 'Create Item',
            method: 'POST',
            path: '/items',
            enforceAcl: [exampleApiAcl],
            script: `(function process(request, response) {
                var svc = new x_snc_example.AppService();
                svc.send(response, svc.createItem(svc.readBody(request)));
            })(request, response);`,
        },
        {
            $id: Now.ID['example_api_update'],
            name: 'Update Item',
            method: 'PATCH',
            path: '/items/{sys_id}',
            enforceAcl: [exampleApiAcl],
            script: `(function process(request, response) {
                var svc = new x_snc_example.AppService();
                svc.send(response, svc.updateItem(request.pathParams.sys_id, svc.readBody(request)));
            })(request, response);`,
        },
        {
            $id: Now.ID['example_api_delete'],
            name: 'Delete Item',
            method: 'DELETE',
            path: '/items/{sys_id}',
            enforceAcl: [exampleApiAcl],
            script: `(function process(request, response) {
                var svc = new x_snc_example.AppService();
                svc.send(response, svc.deleteItem(request.pathParams.sys_id));
            })(request, response);`,
        },
    ],
})
