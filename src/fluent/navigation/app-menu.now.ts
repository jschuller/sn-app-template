import '@servicenow/sdk/global'
import { ApplicationMenu, Record } from '@servicenow/sdk/core'
import { exampleUserRole } from '../roles/app-roles.now'

export const exampleAppMenu = ApplicationMenu({
    $id: Now.ID['example_app_menu'],
    title: 'Example App',
    description: 'Example App built with now-sdk',
    roles: [exampleUserRole],
    active: true,
    order: 200,
})

Record({
    $id: Now.ID['example_app_page_module'],
    table: 'sys_app_module',
    data: {
        title: 'Example App',
        application: exampleAppMenu,
        link_type: 'DIRECT',
        query: 'x_snc_example_app.do',
        roles: ['x_snc_example.user'],
        active: true,
        order: 100,
    },
})

Record({
    $id: Now.ID['example_items_module'],
    table: 'sys_app_module',
    data: {
        title: 'Example Items',
        application: exampleAppMenu,
        link_type: 'LIST',
        name: 'x_snc_example_item',
        roles: ['x_snc_example.user'],
        active: true,
        order: 200,
    },
})
