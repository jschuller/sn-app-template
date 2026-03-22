import '@servicenow/sdk/global'

// Tables (exported for downstream consumption)
export * from './tables/example-item.now'

// Roles
import './roles/app-roles.now'

// ACLs
import './acls/app-acls.now'

// Business Rules
import './business-rules/app-rules.now'

// Script Includes
import './script-includes/app-script-includes.now'

// REST API
import './rest-api/app-api.now'

// Cross-Scope Privileges (prevents REST Table API 403)
import './privileges/cross-scope-privileges.now'

// Navigation
import './navigation/app-menu.now'

// UI Pages (BYOUI)
import './ui-pages/app-page.now'

// Seed Data
import './records/sample-data.now'
