import { CATEGORIES } from './categories.js';

export function ItemRow({ item, onUpdate, onDelete }) {
    const changeCategory = (event) => onUpdate(item.sys_id, { category: event.target.value });
    const changePriority = (event) => onUpdate(item.sys_id, { priority: Number(event.target.value) });

    return (
        <tr>
            <td className="item-table__name">{item.name}</td>
            <td className="item-table__description">{item.description}</td>
            <td>
                <select aria-label={`Category of ${item.name}`} value={item.category} onChange={changeCategory}>
                    {CATEGORIES.map((c) => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                </select>
            </td>
            <td>
                <select aria-label={`Priority of ${item.name}`} value={item.priority ?? ''} onChange={changePriority}>
                    {item.priority == null && <option value="">–</option>}
                    {[1, 2, 3, 4, 5].map((p) => (
                        <option key={p} value={p}>{p}</option>
                    ))}
                </select>
            </td>
            <td>
                <button className="app-button app-button--danger" type="button" onClick={() => onDelete(item.sys_id)}>
                    Delete
                </button>
            </td>
        </tr>
    );
}
