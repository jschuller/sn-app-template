import React from 'react';
import { ApiService, PAGE_SIZE } from '../services/ApiService.js';
import { loadPages, mergeById } from '../services/pagination.js';
import { ItemForm } from './ItemForm.jsx';
import { ItemTable } from './ItemTable.jsx';
import './App.css';

export function App() {
    const [items, setItems] = React.useState([]);
    const [hasMore, setHasMore] = React.useState(false);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState('');
    const [version, setVersion] = React.useState(0);
    // Pages the user has loaded with "Load more"; a reload after a change keeps all of them.
    const pageCount = React.useRef(1);
    // Bumped by every reload: a "Load more" answer that a reload overtook is dropped.
    const generation = React.useRef(0);
    const reloading = React.useRef(false);
    const loadingMore = React.useRef(false);

    // (Re)load every loaded page whenever `version` changes (first render, and after each create, update or delete).
    React.useEffect(() => {
        let cancelled = false;
        const run = (generation.current += 1);
        reloading.current = true;
        loadPages(ApiService.listItems, pageCount.current, PAGE_SIZE)
            .then(({ rows, hasMore: more }) => {
                if (cancelled) return;
                setItems(rows);
                setHasMore(more);
                setError('');
            })
            .catch((err) => !cancelled && setError(err.message))
            .finally(() => {
                if (generation.current === run) reloading.current = false;
                if (!cancelled) setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [version]);

    async function loadMore() {
        // One request at a time, and none while a reload is replacing the list.
        if (reloading.current || loadingMore.current) return;
        loadingMore.current = true;
        const startedIn = generation.current;
        try {
            const page = await ApiService.listItems(items.length);
            if (generation.current !== startedIn) return;
            pageCount.current += 1;
            // Rows created since the last request shift the offsets: merge by sys_id so none is listed twice.
            setItems((current) => mergeById(current, page));
            setHasMore(page.length === PAGE_SIZE);
        } catch (err) {
            setError(err.message);
        } finally {
            loadingMore.current = false;
        }
    }

    // Runs an API call, shows its error, and reloads the loaded pages. Returns true on success.
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
