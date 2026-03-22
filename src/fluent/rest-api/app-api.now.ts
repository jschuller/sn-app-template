import '@servicenow/sdk/global'
import { RestApi } from '@servicenow/sdk/core'

RestApi({
    $id: Now.ID['example_api'],
    name: 'Example API',
    serviceId: 'example_api',
    routes: [
        {
            $id: Now.ID['example_api_list'],
            name: 'List Items',
            method: 'GET',
            path: '/items',
            script: `(function process(request, response) {
                var svc = new x_snc_example.AppService();
                var items = svc.getAllItems();
                response.setBody(items);
            })(request, response);`,
            produces: 'application/json',
        },
        {
            $id: Now.ID['example_api_create'],
            name: 'Create Item',
            method: 'POST',
            path: '/items',
            script: `(function process(request, response) {
                var body = request.body.data;
                var gr = new GlideRecord('x_snc_example_item');
                gr.initialize();
                if (body.name) gr.setValue('x_snc_example_name', body.name);
                if (body.description) gr.setValue('x_snc_example_description', body.description);
                if (body.category) gr.setValue('x_snc_example_category', body.category);
                if (body.priority) gr.setValue('x_snc_example_priority', body.priority);
                var sysId = gr.insert();
                response.setBody({ sys_id: sysId });
            })(request, response);`,
            consumes: 'application/json',
            produces: 'application/json',
        },
        {
            $id: Now.ID['example_api_update'],
            name: 'Update Item',
            method: 'PATCH',
            path: '/items/{sys_id}',
            parameters: [
                { $id: Now.ID['update_param_sys_id'], name: 'sys_id', required: true, shortDescription: 'Record sys_id' },
            ],
            script: `(function process(request, response) {
                var sysId = request.pathParams.sys_id;
                var body = request.body.data;
                var gr = new GlideRecord('x_snc_example_item');
                if (gr.get(sysId)) {
                    if (body.name) gr.setValue('x_snc_example_name', body.name);
                    if (body.description) gr.setValue('x_snc_example_description', body.description);
                    if (body.category) gr.setValue('x_snc_example_category', body.category);
                    if (body.priority) gr.setValue('x_snc_example_priority', body.priority);
                    gr.update();
                    response.setBody({ sys_id: sysId, updated: true });
                } else {
                    response.setStatus(404);
                    response.setBody({ error: { message: 'Record not found' } });
                }
            })(request, response);`,
            consumes: 'application/json',
            produces: 'application/json',
        },
        {
            $id: Now.ID['example_api_delete'],
            name: 'Delete Item',
            method: 'DELETE',
            path: '/items/{sys_id}',
            parameters: [
                { $id: Now.ID['delete_param_sys_id'], name: 'sys_id', required: true, shortDescription: 'Record sys_id' },
            ],
            script: `(function process(request, response) {
                var sysId = request.pathParams.sys_id;
                var gr = new GlideRecord('x_snc_example_item');
                if (gr.get(sysId)) {
                    gr.deleteRecord();
                    response.setBody({ deleted: true });
                } else {
                    response.setStatus(404);
                    response.setBody({ error: { message: 'Record not found' } });
                }
            })(request, response);`,
            produces: 'application/json',
        },
    ],
})
