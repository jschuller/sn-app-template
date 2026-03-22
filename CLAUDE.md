# ServiceNow App Development with Claude Code + now-sdk

## Architecture

Three source layers, one deploy command:
- **`src/fluent/*.now.ts`** — Metadata-as-code (tables, ACLs, roles, REST API, UI pages)
- **`src/server/*.server.js`** — Script Includes (server-side business logic)
- **`src/client/*.jsx`** — BYOUI React pages (client-side UI)

```bash
npm run build        # Compiles JSX → .jsdbx, validates Fluent
now-sdk install      # Deploys everything to ServiceNow instance
```

## Scope Convention

Every table, field, and API name uses the scope prefix: `x_snc_example_`

- Table: `x_snc_example_item`
- Field: `x_snc_example_name`
- REST API: `/api/x_snc_example/example_api/items`
- UI Page: `x_snc_example_app.do`

To change scope: edit `now.config.json` and run `set-scope.sh {new_prefix}`

## Adding a Table

Create `src/fluent/tables/my-table.now.ts`:
```typescript
import '@servicenow/sdk/global'
import { Table, StringColumn, IntegerColumn, ChoiceColumn, BooleanColumn, DateTimeColumn, ReferenceColumn, DecimalColumn } from '@servicenow/sdk/core'

export const x_snc_example_my_table = Table({
    name: 'x_snc_example_my_table',
    label: 'My Table',
    accessibleFrom: 'public',
    allowWebServiceAccess: true,  // REQUIRED for REST Table API access
    actions: ['read', 'update', 'delete', 'create'],
    schema: {
        x_snc_example_field_name: StringColumn({ label: 'Field Name', maxLength: 200 }),
    },
})
```

Then add to `src/fluent/index.now.ts`: `export * from './tables/my-table.now'`

Also create:
- 4 ACLs in `src/fluent/acls/` (read, write, create, delete)
- 4 CrossScopePrivileges in `src/fluent/privileges/` (prevents REST 403)

## Adding a Script Include

Create `src/server/MyService.server.js`:
```javascript
var APP_FIELD_PREFIX = 'x_snc_example_';
var FP = APP_FIELD_PREFIX;

var MyService = Class.create();
MyService.prototype = {
    initialize: function() {},
    myMethod: function() {
        var gr = new GlideRecord('x_snc_example_my_table');
        gr.query();
        // ... business logic
    },
    type: 'MyService'
};
```

Register in `src/fluent/script-includes/`:
```typescript
ScriptInclude({
    $id: Now.ID['my_service_si'],
    name: 'MyService',
    script: Now.include('../../server/MyService.server.js'),
    apiName: 'x_snc_example.MyService',
    active: true, clientCallable: false,
})
```

**Critical**: Script Includes load independently — globals from one SI are NOT visible in others. Define prefix constants in EVERY file.

## Adding a BYOUI Page

1. Create `src/client/mypage.html`:
```html
<html>
<head>
  <title>My Page</title>
  <sdk:now-ux-globals></sdk:now-ux-globals>
  <script src="mypage.jsx" type="module"></script>
</head>
<body><div id="root"></div></body>
</html>
```

2. Create `src/client/mypage.jsx` (React entry point)
3. Register in `src/fluent/ui-pages/`:
```typescript
import myPage from '../../client/mypage.html'
UiPage({ $id: Now.ID['my_page'], endpoint: 'x_snc_example_mypage.do', html: myPage, direct: true })
```

**CRITICAL**: BYOUI pages CANNOT use GlideAjax — it fails silently. Use `fetch()` to Scripted REST API with `X-UserToken: window.g_ck` for CSRF.

## Adding REST API Routes

Add routes to the existing `RestApi()` in `src/fluent/rest-api/app-api.now.ts`. Scripts can instantiate Script Includes: `var svc = new x_snc_example.AppService();`

## Adding ATF Tests

Create `src/fluent/tests/my-test.now.ts`:
```typescript
import '@servicenow/sdk/global'
import { Test } from '@servicenow/sdk/core'

Test({
    $id: Now.ID['my_test'],
    active: true,
    name: 'My Test Name',
    description: 'What this test validates',
}, (atf) => {
    const record = atf.server.recordInsert({
        table: 'x_snc_example_my_table',
        fieldValues: { x_snc_example_field: 'test value' },
        assert: 'record_successfully_inserted',
        enforceSecurity: false,
    })
    atf.server.recordValidation({
        table: 'x_snc_example_my_table',
        recordId: record.record_id,
        fieldValues: 'x_snc_example_field=test value^EQ',
        assert: 'record_validated',
    })
    atf.server.recordDelete({
        table: 'x_snc_example_my_table',
        recordId: record.record_id,
        enforceSecurity: false,
    })
})
```

Register in `src/fluent/index.now.ts`: `import './tests/my-test.now'`

Available server steps: `recordInsert`, `recordValidation`, `recordQuery`, `recordDelete`, `runServerSideScript`, `impersonate`, `log`. REST steps (`sendRestRequest`, `assertStatusCode`) require a basic auth profile on the instance. See `src/fluent/tests/example-item-test.now.ts` for a complete example.

## Handling Secrets

- Use `Property()` with `type: 'password2'` — encrypted at rest
- Add `@fluent-disable-sync` comment to prevent IDE from syncing values back to source
- NEVER commit API key values — set post-deploy via MCP or instance UI

## Key Gotchas

1. **GlideAjax fails in BYOUI** — use fetch() to Scripted REST API
2. **403 on REST Table API** — need CrossScopePrivileges + `allowWebServiceAccess: true` on table
3. **Script Include isolation** — each SI loads independently, define prefix constants locally
4. **scopeId must match instance** — update `now.config.json` after creating app on new instance
5. **`src/fluent/generated/`** is auto-generated — gitignore it, don't edit manually
6. **Build Agent: 10 prompts/month on PDI** — use Claude Code for real development

## ServiceNow MCP Server

For AI-assisted instance operations (querying tables, managing CIs, update sets) alongside this template, see [mcp-server-servicenow](https://github.com/jschuller/mcp-server-servicenow) — 18 tools for ServiceNow table, CMDB, system, and update set operations.
