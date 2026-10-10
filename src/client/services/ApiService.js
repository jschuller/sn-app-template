/**
 * Client for the app's Scripted REST API (/api/x_snc_example/example_api).
 *
 * BYOUI pages call REST with fetch(); GlideAjax does not work here. Every request
 * sends the session's CSRF token (window.g_ck) as X-UserToken.
 */
const BASE_URL = '/api/x_snc_example/example_api';
export const PAGE_SIZE = 50;

async function request(path, { method = 'GET', body } = {}) {
    if (!window.g_ck) {
        throw new Error('Missing session token (g_ck). Open this page from the instance.');
    }
    const headers = { Accept: 'application/json', 'X-UserToken': window.g_ck };
    if (body !== undefined) headers['Content-Type'] = 'application/json';

    const response = await fetch(`${BASE_URL}${path}`, {
        method,
        headers,
        body: body === undefined ? undefined : JSON.stringify(body),
    });
    if (response.status === 204) return null;

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
        // Scripted REST wraps bodies in `result`; platform errors (401/403) use top-level `error`.
        const message = payload.result?.error?.message || payload.error?.message;
        throw new Error(message || `Request failed (HTTP ${response.status})`);
    }
    return payload.result;
}

export const ApiService = {
    listItems: (offset = 0) => request(`/items?limit=${PAGE_SIZE}&offset=${offset}`),
    createItem: (item) => request('/items', { method: 'POST', body: item }),
    updateItem: (sysId, changes) =>
        request(`/items/${encodeURIComponent(sysId)}`, { method: 'PATCH', body: changes }),
    deleteItem: (sysId) => request(`/items/${encodeURIComponent(sysId)}`, { method: 'DELETE' }),
};
