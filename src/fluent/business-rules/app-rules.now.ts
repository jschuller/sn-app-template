import '@servicenow/sdk/global'
import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['default_category_rule'],
    name: 'Default Category to General',
    table: 'x_snc_example_item',
    when: 'before',
    action: ['insert'],
    active: true,
    order: 100,
    script: `
    (function executeRule(current, previous) {
        if (!current.x_snc_example_category || current.x_snc_example_category == '') {
            current.x_snc_example_category = 'general';
        }
    })(current, previous);
    `,
})
