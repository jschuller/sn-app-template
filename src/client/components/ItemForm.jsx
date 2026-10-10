import React from 'react';
import { CATEGORIES } from './categories.js';

const EMPTY = { name: '', description: '', category: 'general' };

export function ItemForm({ onCreate }) {
    const [draft, setDraft] = React.useState(EMPTY);
    const [saving, setSaving] = React.useState(false);

    const update = (field) => (event) => setDraft({ ...draft, [field]: event.target.value });

    async function handleSubmit(event) {
        event.preventDefault();
        if (!draft.name.trim()) return;
        setSaving(true);
        const created = await onCreate(draft);
        setSaving(false);
        if (created) setDraft(EMPTY);
    }

    return (
        <section className="app-card" aria-labelledby="create-heading">
            <h2 id="create-heading">Create item</h2>
            <form className="item-form" onSubmit={handleSubmit}>
                <label className="item-form__field">
                    Name
                    <input value={draft.name} onChange={update('name')} maxLength={200} required />
                </label>
                <label className="item-form__field item-form__field--wide">
                    Description
                    <input value={draft.description} onChange={update('description')} maxLength={4000} />
                </label>
                <label className="item-form__field">
                    Category
                    <select value={draft.category} onChange={update('category')}>
                        {CATEGORIES.map((c) => (
                            <option key={c.value} value={c.value}>{c.label}</option>
                        ))}
                    </select>
                </label>
                <button className="app-button" type="submit" disabled={saving}>
                    {saving ? 'Adding…' : 'Add'}
                </button>
            </form>
        </section>
    );
}
