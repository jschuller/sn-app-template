import '@servicenow/sdk/global'
import { Test } from '@servicenow/sdk/core'

/**
 * ATF Test: Validates Example Item table, business rules, and AppService Script Include.
 *
 * Steps:
 * 1. Insert a record (no category — triggers Default Category business rule)
 * 2. Validate the business rule set category to "general"
 * 3. Run AppService.getAllItems() and verify the record is returned
 * 4. Clean up the test record
 *
 * This test uses server-side steps only — no basic auth profile required.
 */
Test(
    {
        $id: Now.ID['example_item_test'],
        active: true,
        name: 'Example Item — Table, Business Rule, and Service Validation',
        description:
            'Validates the Example Item table schema, Default Category business rule, and AppService.getAllItems() Script Include. Inserts a record without a category, verifies the business rule defaults it to "general", then confirms AppService returns it correctly. Self-cleaning.',
    },
    (atf) => {
        // Step 1: Insert a test record without a category (triggers Default Category rule)
        const inserted = atf.server.recordInsert({
            $id: Now.ID['test_step_insert'],
            table: 'x_snc_example_item',
            fieldValues: {
                x_snc_example_name: 'ATF Test Item',
                x_snc_example_description: 'Created by ATF — validates table, rules, and service',
                x_snc_example_priority: 2,
            },
            assert: 'record_successfully_inserted',
            enforceSecurity: false,
        })

        // Step 2: Validate the business rule set default category to "general"
        atf.server.recordValidation({
            $id: Now.ID['test_step_validate'],
            table: 'x_snc_example_item',
            recordId: inserted.record_id,
            fieldValues: 'x_snc_example_category=general^EQ',
            assert: 'record_validated',
            enforceSecurity: false,
        })

        // Step 3: Test AppService.getAllItems() returns the inserted record
        atf.server.runServerSideScript({
            $id: Now.ID['test_step_service'],
            script: `
                var svc = new x_snc_example.AppService();
                var items = svc.getAllItems();
                var found = false;
                for (var i = 0; i < items.length; i++) {
                    if (items[i].name === 'ATF Test Item') {
                        if (items[i].category !== 'general') {
                            throw new Error('Expected category "general", got "' + items[i].category + '"');
                        }
                        if (items[i].priority !== 2) {
                            throw new Error('Expected priority 2, got ' + items[i].priority);
                        }
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    throw new Error('AppService.getAllItems() did not return the test record "ATF Test Item"');
                }
            `,
        })

        // Step 4: Clean up — delete the test record
        atf.server.recordDelete({
            $id: Now.ID['test_step_cleanup'],
            table: 'x_snc_example_item',
            recordId: inserted.record_id,
            assert: 'record_successfully_deleted',
            enforceSecurity: false,
        })
    }
)
