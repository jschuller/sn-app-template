import '@servicenow/sdk/global'
import { Test, TestSuite } from '@servicenow/sdk/core'

/**
 * ATF tests run on the instance after deploy: `npm run test:instance`.
 * Server-side steps only, so no REST auth profile is needed. ATF rolls back the
 * records and users each test creates.
 */

// Business rule + AppService, as an admin.
export const itemServiceTest = Test(
    {
        $id: Now.ID['example_item_test'],
        active: true,
        name: 'Example Item: business rule and AppService',
        description:
            'Inserts an urgent item without a priority, checks the business rule derived priority 1, then checks AppService validation and listing.',
    },
    (atf) => {
        const inserted = atf.server.recordInsert({
            $id: Now.ID['test_step_insert'],
            table: 'x_snc_example_item',
            fieldValues: {
                x_snc_example_name: 'ATF item',
                x_snc_example_category: 'urgent',
            },
            assert: 'record_successfully_inserted',
            enforceSecurity: false,
        })

        atf.server.recordValidation({
            $id: Now.ID['test_step_validate'],
            table: 'x_snc_example_item',
            recordId: inserted.record_id,
            fieldValues: 'x_snc_example_priority=1^EQ',
            assert: 'record_validated',
        })

        atf.server.runServerSideScript({
            $id: Now.ID['test_step_service'],
            script: `
                (function(outputs, steps, params, stepResult, assertEqual) {
                    var svc = new x_snc_example.AppService();

                    var bad = svc.createItem({ name: 'x', category: 'nope' });
                    assertEqual({ name: 'invalid category is rejected', shouldbe: 400, value: bad.status });

                    var missing = svc.createItem({ description: 'no name' });
                    assertEqual({ name: 'missing name is rejected', shouldbe: 400, value: missing.status });

                    var notInteger = svc.createItem({ name: 'x', priority: true });
                    assertEqual({ name: 'boolean priority is rejected', shouldbe: 400, value: notInteger.status });
                    var hexString = svc.createItem({ name: 'x', priority: '0x3' });
                    assertEqual({ name: 'hex priority is rejected', shouldbe: 400, value: hexString.status });

                    var list = svc.listItems({ limit: ['100'] });
                    assertEqual({ name: 'list succeeds', shouldbe: 200, value: list.status });
                    var found = list.body.filter(function(item) { return item.name === 'ATF item'; })[0];
                    assertEqual({ name: 'inserted item is listed', shouldbe: true, value: !!found });
                    assertEqual({ name: 'listed priority', shouldbe: 1, value: found ? found.priority : null });
                    assertEqual({ name: 'admin may edit', shouldbe: true, value: found ? found.can_write : null });

                    var farPage = svc.listItems({ offset: ['99999999999'] });
                    assertEqual({ name: 'huge offset is capped, not an error', shouldbe: 200, value: farPage.status });
                })(outputs, steps, params, stepResult, assertEqual);
            `,
        })
    }
)

// ACL enforcement: a user with no app role can neither insert directly nor through AppService.
export const itemSecurityTest = Test(
    {
        $id: Now.ID['example_item_security_test'],
        active: true,
        name: 'Example Item: ACLs deny a user without app roles',
        description:
            'Creates and impersonates a user with no roles, then checks that the create ACL blocks a secured insert and that AppService (GlideRecordSecure) returns 403.',
    },
    (atf) => {
        atf.server.createUser({
            $id: Now.ID['test_step_create_user'],
            firstName: 'ATF',
            lastName: 'No Role',
            fieldValues: {},
            groups: [],
            roles: [],
            impersonate: true,
        })

        atf.server.recordInsert({
            $id: Now.ID['test_step_denied_insert'],
            table: 'x_snc_example_item',
            fieldValues: { x_snc_example_name: 'Should not exist' },
            assert: 'record_not_inserted',
            enforceSecurity: true,
        })

        atf.server.runServerSideScript({
            $id: Now.ID['test_step_denied_service'],
            script: `
                (function(outputs, steps, params, stepResult, assertEqual) {
                    var result = new x_snc_example.AppService().createItem({ name: 'Should not exist' });
                    assertEqual({ name: 'AppService denies create', shouldbe: 403, value: result.status });
                })(outputs, steps, params, stepResult, assertEqual);
            `,
        })
    }
)

export const exampleAppSuite = TestSuite({
    $id: Now.ID['example_app_suite'],
    name: 'Example App',
    description: 'All Example App tests. Run with: npm run test:instance',
    tests: [itemServiceTest, itemSecurityTest],
})
