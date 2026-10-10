import { useState } from 'react';
import { CATEGORIES } from './categories.js';

// Editing and deleting are offered only when the server says the caller may (record ACLs).
export function ItemRow({ item, onUpdate, onDelete }) {
    const [busy, setBusy] = useState(false);

    async function act(action) {
        setBusy(true);
        await action();
        setBusy(false);
    }

    const changeCategory = (event) => act(() => onUpdate(item.sys_id, { category: event.target.value }));
    const changePriority = (event) => act(() => onUpdate(item.sys_id, { priority: Number(event.target.value) }));
    const readOnly = !item.can_write || busy;

    return (
        <tr aria-busy={busy}>
            <td className="item-table__name">{item.name}</td>
            <td className="item-table__description">{item.description}</td>
            <td>
                <select aria-label={`Category of ${item.name}`} value={item.category} onChange={changeCategory} disabled={readOnly}>
                    {CATEGORIES.map((c) => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                </select>
            </td>
            <td>
                <select aria-label={`Priority of ${item.name}`} value={item.priority ?? ''} onChange={changePriority} disabled={readOnly}>
                    {item.priority == null && <option value="">–</option>}
                    {[1, 2, 3, 4, 5].map((p) => (
                        <option key={p} value={p}>{p}</option>
                    ))}
                </select>
            </td>
            <td>
                {item.can_delete && (
                    <button className="app-button app-button--danger" type="button" disabled={busy} onClick={() => act(() => onDelete(item.sys_id))}>
                        Delete
                    </button>
                )}
            </td>
        </tr>
    );
}
