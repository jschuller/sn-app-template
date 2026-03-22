import '@servicenow/sdk/global'
import { UiPage } from '@servicenow/sdk/core'
import indexPage from '../../client/index.html'

export const example_app_page = UiPage({
    $id: Now.ID['example_app_page'],
    endpoint: 'x_snc_example_app.do',
    description: 'Example App - Main Page',
    category: 'general',
    html: indexPage,
    direct: true,
})
