import React from 'react';
import { ApiService } from '../services/ApiService.js';
import './App.css';

const service = new ApiService();

export function App() {
    const [items, setItems] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [newName, setNewName] = React.useState('');
    const [newDesc, setNewDesc] = React.useState('');
    const [newCategory, setNewCategory] = React.useState('general');

    React.useEffect(() => {
        loadItems();
    }, []);

    async function loadItems() {
        try {
            setLoading(true);
            const data = await service.listItems();
            setItems(data);
        } catch (err) {
            console.error('Failed to load items:', err);
        } finally {
            setLoading(false);
        }
    }

    async function handleCreate(e) {
        e.preventDefault();
        if (!newName.trim()) return;
        try {
            await service.createItem({
                name: newName,
                description: newDesc,
                category: newCategory,
            });
            setNewName('');
            setNewDesc('');
            setNewCategory('general');
            loadItems();
        } catch (err) {
            console.error('Failed to create item:', err);
        }
    }

    async function handleDelete(sysId) {
        try {
            await service.deleteItem(sysId);
            loadItems();
        } catch (err) {
            console.error('Failed to delete item:', err);
        }
    }

    const categoryBadge = (cat) => {
        const colors = { general: '#6b7280', important: '#f59e0b', urgent: '#ef4444' };
        return (
            <span style={{
                background: colors[cat] || '#6b7280',
                color: 'white',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '0.8em',
                fontWeight: '600',
            }}>{cat?.toUpperCase()}</span>
        );
    };

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px', fontFamily: "'Segoe UI', sans-serif" }}>
            <header style={{
                background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                color: 'white',
                padding: '32px',
                borderRadius: '12px',
                marginBottom: '24px',
                textAlign: 'center',
            }}>
                <h1 style={{ margin: 0, fontSize: '2em' }}>Example App</h1>
                <p style={{ margin: '8px 0 0', opacity: 0.9 }}>Built with now-sdk + Claude Code</p>
            </header>

            <div style={{
                background: 'white',
                borderRadius: '8px',
                padding: '20px',
                marginBottom: '24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}>
                <h2 style={{ marginTop: 0 }}>Create New Item</h2>
                <form onSubmit={handleCreate} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <input
                        type="text"
                        placeholder="Item name"
                        value={newName}
                        onChange={e => setNewName(e.target.value)}
                        style={{ flex: 2, padding: '8px 12px', borderRadius: '6px', border: '1px solid #d1d5db', minWidth: '200px' }}
                    />
                    <input
                        type="text"
                        placeholder="Description"
                        value={newDesc}
                        onChange={e => setNewDesc(e.target.value)}
                        style={{ flex: 3, padding: '8px 12px', borderRadius: '6px', border: '1px solid #d1d5db', minWidth: '200px' }}
                    />
                    <select
                        value={newCategory}
                        onChange={e => setNewCategory(e.target.value)}
                        style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #d1d5db' }}
                    >
                        <option value="general">General</option>
                        <option value="important">Important</option>
                        <option value="urgent">Urgent</option>
                    </select>
                    <button type="submit" style={{
                        background: '#2563eb',
                        color: 'white',
                        border: 'none',
                        padding: '8px 20px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: '600',
                    }}>Add</button>
                </form>
            </div>

            <div style={{
                background: 'white',
                borderRadius: '8px',
                padding: '20px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}>
                <h2 style={{ marginTop: 0 }}>Items ({items.length})</h2>
                {loading ? (
                    <p style={{ color: '#6b7280' }}>Loading...</p>
                ) : items.length === 0 ? (
                    <p style={{ color: '#6b7280' }}>No items yet. Create one above!</p>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                                <th style={{ textAlign: 'left', padding: '10px' }}>Name</th>
                                <th style={{ textAlign: 'left', padding: '10px' }}>Description</th>
                                <th style={{ textAlign: 'left', padding: '10px' }}>Category</th>
                                <th style={{ textAlign: 'center', padding: '10px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map(item => (
                                <tr key={item.sys_id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                    <td style={{ padding: '10px', fontWeight: '500' }}>{item.name}</td>
                                    <td style={{ padding: '10px', color: '#6b7280', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.description}</td>
                                    <td style={{ padding: '10px' }}>{categoryBadge(item.category)}</td>
                                    <td style={{ padding: '10px', textAlign: 'center' }}>
                                        <button
                                            onClick={() => handleDelete(item.sys_id)}
                                            style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '4px 12px', borderRadius: '4px', cursor: 'pointer' }}
                                        >Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
