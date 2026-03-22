import '@servicenow/sdk/global'
import { ApplicationMenu, Record } from '@servicenow/sdk/core'

export const exampleAppMenu = ApplicationMenu({
    $id: Now.ID['example_app_menu'],
    title: 'Example App',
    active: true,
    order: 200,
    description: 'Example App built with now-sdk + Claude Code',
    category: '',
})

Record({
    $id: Now.ID['example_items_module'],
    table: 'sys_app_module',
    data: {
        title: 'Example Items',
        name: 'x_snc_example_item',
        application: exampleAppMenu,
        link_type: 'LIST',
        active: true,
        order: 100,
        override_menu_roles: false,
        require_confirmation: false,
        sys_domain: 'global',
        sys_domain_path: '/',
        uncancelable: false,
    },
})
