import { ItemRow } from './ItemRow.jsx';

export function ItemTable({ items, loading, onUpdate, onDelete }) {
    let content;
    if (loading) {
        content = <p className="app-muted">Loading…</p>;
    } else if (items.length === 0) {
        content = <p className="app-muted">No items yet. Create one above.</p>;
    } else {
        content = (
            <table className="item-table">
                <thead>
                    <tr>
                        <th scope="col">Name</th>
                        <th scope="col">Description</th>
                        <th scope="col">Category</th>
                        <th scope="col">Priority</th>
                        <th scope="col"><span className="app-visually-hidden">Actions</span></th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => (
                        <ItemRow key={item.sys_id} item={item} onUpdate={onUpdate} onDelete={onDelete} />
                    ))}
                </tbody>
            </table>
        );
    }

    return (
        <section className="app-card" aria-labelledby="items-heading">
            <h2 id="items-heading">Items ({items.length})</h2>
            {content}
        </section>
    );
}
