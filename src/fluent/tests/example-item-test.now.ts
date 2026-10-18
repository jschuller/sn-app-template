import '@servicenow/sdk/global'
import { Test, TestSuite } from '@servicenow/sdk/core'
import { exampleAdminRole, exampleUserRole } from '../roles/app-roles.now'

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

// The read/create vs update/delete split: a user with only the app's user role.
export const itemUserRoleTest = Test(
    {
        $id: Now.ID['example_item_user_role_test'],
        active: true,
        name: 'Example Item: user role may read and create, not update or delete',
        description:
            'Seeds an item as admin, then impersonates a user with only the user role and checks that the write and delete ACLs block secured updates and deletes, and that AppService returns 403 for them and 201 for create.',
    },
    (atf) => {
        const seeded = atf.server.recordInsert({
            $id: Now.ID['test_step_seed_insert'],
            table: 'x_snc_example_item',
            fieldValues: { x_snc_example_name: 'ATF seeded item' },
            assert: 'record_successfully_inserted',
            enforceSecurity: false,
        })

        atf.server.createUser({
            $id: Now.ID['test_step_create_app_user'],
            firstName: 'ATF',
            lastName: 'App User',
            fieldValues: {},
            groups: [],
            roles: [exampleUserRole],
            impersonate: true,
        })

        atf.server.recordUpdate({
            $id: Now.ID['test_step_user_denied_update'],
            table: 'x_snc_example_item',
            recordId: seeded.record_id,
            fieldValues: { x_snc_example_name: 'Should not change' },
            assert: 'record_not_updated',
            enforceSecurity: true,
        })

        atf.server.recordDelete({
            $id: Now.ID['test_step_user_denied_delete'],
            table: 'x_snc_example_item',
            recordId: seeded.record_id,
            assert: 'record_not_deleted',
            enforceSecurity: true,
        })

        atf.server.recordValidation({
            $id: Now.ID['test_step_user_seed_unchanged'],
            table: 'x_snc_example_item',
            recordId: seeded.record_id,
            fieldValues: 'x_snc_example_name=ATF seeded item^EQ',
            assert: 'record_validated',
        })

        atf.server.runServerSideScript({
            $id: Now.ID['test_step_user_service'],
            script: `
                (function(outputs, steps, params, stepResult, assertEqual) {
                    var svc = new x_snc_example.AppService();

                    var list = svc.listItems({ limit: ['100'] });
                    assertEqual({ name: 'user may list', shouldbe: 200, value: list.status });
                    var seeded = list.body.filter(function(item) { return item.name === 'ATF seeded item'; })[0];
                    assertEqual({ name: 'seeded item is listed', shouldbe: true, value: !!seeded });
                    assertEqual({ name: 'user may not edit', shouldbe: false, value: seeded ? seeded.can_write : null });
                    assertEqual({ name: 'user may not delete', shouldbe: false, value: seeded ? seeded.can_delete : null });

                    var id = seeded ? seeded.sys_id : '';
                    var updated = svc.updateItem(id, { name: 'Should not change' });
                    assertEqual({ name: 'AppService denies update', shouldbe: 403, value: updated.status });
                    var deleted = svc.deleteItem(id);
                    assertEqual({ name: 'AppService denies delete', shouldbe: 403, value: deleted.status });

                    var created = svc.createItem({ name: 'ATF user item' });
                    assertEqual({ name: 'user may create', shouldbe: 201, value: created.status });
                    assertEqual({ name: 'created item is not editable by user', shouldbe: false, value: created.body.can_write });
                    assertEqual({ name: 'created item is not deletable by user', shouldbe: false, value: created.body.can_delete });
                })(outputs, steps, params, stepResult, assertEqual);
            `,
        })
    }
)

// The app's admin role grants update and delete. Runs as a user holding only that
// role, because a sysadmin passes every ACL and would not prove the grant.
export const itemAdminRoleTest = Test(
    {
        $id: Now.ID['example_item_admin_role_test'],
        active: true,
        name: 'Example Item: admin role may update and delete',
        description:
            'Seeds an item, then impersonates a user with only the app admin role and checks that AppService reports the item editable and deletable, updates it (200), deletes it (204) and then reports it missing (404).',
    },
    (atf) => {
        atf.server.recordInsert({
            $id: Now.ID['test_step_admin_seed_insert'],
            table: 'x_snc_example_item',
            fieldValues: {
                x_snc_example_name: 'ATF admin item',
                x_snc_example_category: 'general',
            },
            assert: 'record_successfully_inserted',
            enforceSecurity: false,
        })

        atf.server.createUser({
            $id: Now.ID['test_step_create_app_admin'],
            firstName: 'ATF',
            lastName: 'App Admin',
            fieldValues: {},
            groups: [],
            roles: [exampleAdminRole],
            impersonate: true,
        })

        atf.server.runServerSideScript({
            $id: Now.ID['test_step_admin_service'],
            script: `
                (function(outputs, steps, params, stepResult, assertEqual) {
                    var svc = new x_snc_example.AppService();

                    var list = svc.listItems({ limit: ['100'] });
                    assertEqual({ name: 'app admin may list', shouldbe: 200, value: list.status });
                    var seeded = list.body.filter(function(item) { return item.name === 'ATF admin item'; })[0];
                    assertEqual({ name: 'seeded item is listed', shouldbe: true, value: !!seeded });
                    assertEqual({ name: 'app admin may edit', shouldbe: true, value: seeded ? seeded.can_write : null });
                    assertEqual({ name: 'app admin may delete', shouldbe: true, value: seeded ? seeded.can_delete : null });

                    var id = seeded ? seeded.sys_id : '';
                    var updated = svc.updateItem(id, { priority: 5 });
                    assertEqual({ name: 'app admin update succeeds', shouldbe: 200, value: updated.status });
                    assertEqual({ name: 'update changes the given field', shouldbe: 5, value: updated.body.priority });
                    assertEqual({ name: 'update keeps other fields', shouldbe: 'ATF admin item', value: updated.body.name });

                    var deleted = svc.deleteItem(id);
                    assertEqual({ name: 'app admin delete succeeds', shouldbe: 204, value: deleted.status });
                    var afterDelete = svc.updateItem(id, { priority: 2 });
                    assertEqual({ name: 'deleted item is gone', shouldbe: 404, value: afterDelete.status });
                })(outputs, steps, params, stepResult, assertEqual);
            `,
        })
    }
)

export const exampleAppSuite = TestSuite({
    $id: Now.ID['example_app_suite'],
    name: 'Example App',
    description: 'All Example App tests. Run with: npm run test:instance',
    tests: [itemServiceTest, itemSecurityTest, itemUserRoleTest, itemAdminRoleTest],
})
