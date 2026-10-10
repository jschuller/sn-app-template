import React from 'react';
import { ApiService, PAGE_SIZE } from '../services/ApiService.js';
import { ItemForm } from './ItemForm.jsx';
import { ItemTable } from './ItemTable.jsx';
import './App.css';

export function App() {
    const [items, setItems] = React.useState([]);
    const [hasMore, setHasMore] = React.useState(false);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState('');
    const [version, setVersion] = React.useState(0);

    // (Re)load the first page whenever `version` changes.
    React.useEffect(() => {
        let cancelled = false;
        ApiService.listItems(0)
            .then((page) => {
                if (cancelled) return;
                setItems(page);
                setHasMore(page.length === PAGE_SIZE);
                setError('');
            })
            .catch((err) => !cancelled && setError(err.message))
            .finally(() => !cancelled && setLoading(false));
        return () => {
            cancelled = true;
        };
    }, [version]);

    async function loadMore() {
        try {
            const page = await ApiService.listItems(items.length);
            setItems((current) => [...current, ...page]);
            setHasMore(page.length === PAGE_SIZE);
        } catch (err) {
            setError(err.message);
        }
    }

    // Runs an API call, shows its error, and reloads the list. Returns true on success.
    async function run(action) {
        try {
            await action();
            setVersion((v) => v + 1);
            return true;
        } catch (err) {
            setError(err.message);
            return false;
        }
    }

    return (
        <main className="app">
            <header className="app-header">
                <h1>Example App</h1>
                <p>Built with now-sdk</p>
            </header>
            {error && (
                <div className="app-alert" role="alert">
                    {error}
                    <button className="app-button app-button--bare" type="button" onClick={() => setError('')}>
                        Dismiss
                    </button>
                </div>
            )}
            <ItemForm onCreate={(draft) => run(() => ApiService.createItem(draft))} />
            <ItemTable
                items={items}
                loading={loading}
                hasMore={hasMore}
                onLoadMore={loadMore}
                onUpdate={(sysId, changes) => run(() => ApiService.updateItem(sysId, changes))}
                onDelete={(sysId) => run(() => ApiService.deleteItem(sysId))}
            />
        </main>
    );
}
