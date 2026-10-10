import '@servicenow/sdk/global'
import { BusinessRule } from '@servicenow/sdk/core'

// Fills in a priority from the category when the caller leaves it empty.
// The ATF test asserts the derived value, which proves the rule ran.
BusinessRule({
    $id: Now.ID['default_priority_rule'],
    name: 'Derive default priority from category',
    table: 'x_snc_example_item',
    when: 'before',
    action: ['insert'],
    active: true,
    order: 100,
    script: `
    (function executeRule(current, previous) {
        if (!current.x_snc_example_priority.nil()) {
            return;
        }
        var byCategory = { urgent: 1, important: 2, general: 3 };
        var category = current.getValue('x_snc_example_category') || 'general';
        current.setValue('x_snc_example_priority', byCategory[category] || 3);
    })(current, previous);
    `,
})
