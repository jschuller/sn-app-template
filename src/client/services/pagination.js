/**
 * Offset pagination helpers for the item list (newest first).
 *
 * Offsets shift when rows are created or deleted between two page requests, so a page can repeat rows that are
 * already shown. Pages are therefore merged by sys_id: a repeated row replaces the shown one in place (it is the
 * newer copy) and is never listed twice. A row deleted by someone else between two requests can shift a row past
 * the window until the next reload; reloading the loaded window after every change keeps that gap short.
 */

/**
 * @param {Array<{sys_id: string}>} current rows already shown, in display order
 * @param {Array<{sys_id: string}>} page rows from the next request
 * @returns {Array<{sys_id: string}>} current followed by the page's new rows, one entry per sys_id
 */
export function mergeById(current, page) {
    const merged = current.slice();
    const index = new Map(merged.map((item, position) => [item.sys_id, position]));
    for (const item of page) {
        if (index.has(item.sys_id)) {
            merged[index.get(item.sys_id)] = item;
        } else {
            index.set(item.sys_id, merged.length);
            merged.push(item);
        }
    }
    return merged;
}

/**
 * Loads `pageCount` pages from the top of the list, merged by sys_id. Stops early at a short page.
 *
 * @param {(offset: number) => Promise<Array<{sys_id: string}>>} fetchPage returns up to pageSize rows from offset
 * @param {number} pageCount pages to load (at least 1)
 * @param {number} pageSize rows per full page
 * @returns {Promise<{rows: Array<{sys_id: string}>, hasMore: boolean}>} hasMore is true when the last page was full
 */
export async function loadPages(fetchPage, pageCount, pageSize) {
    let rows = [];
    let hasMore = false;
    for (let page = 0; page < Math.max(1, pageCount); page += 1) {
        const batch = await fetchPage(page * pageSize);
        rows = mergeById(rows, batch);
        hasMore = batch.length === pageSize;
        if (!hasMore) break;
    }
    return { rows, hasMore };
}
