/**
 * ApiService — REST API client for Example App.
 *
 * Uses fetch() with X-UserToken (g_ck) for CSRF protection.
 * IMPORTANT: GlideAjax does NOT work in BYOUI pages — always use fetch().
 */
export class ApiService {
    constructor() {
        this.baseUrl = '/api/x_snc_example/example_api';
    }

    async listItems() {
        const response = await fetch(`${this.baseUrl}/items`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'X-UserToken': window.g_ck,
            },
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        return data.result;
    }

    async createItem(item) {
        const response = await fetch(`${this.baseUrl}/items`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-UserToken': window.g_ck,
            },
            body: JSON.stringify(item),
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return (await response.json()).result;
    }

    async updateItem(sysId, updates) {
        const response = await fetch(`${this.baseUrl}/items/${sysId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-UserToken': window.g_ck,
            },
            body: JSON.stringify(updates),
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return (await response.json()).result;
    }

    async deleteItem(sysId) {
        const response = await fetch(`${this.baseUrl}/items/${sysId}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'X-UserToken': window.g_ck,
            },
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return (await response.json()).result;
    }
}
