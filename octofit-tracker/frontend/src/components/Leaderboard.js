import React, { useEffect, useState } from 'react';

function normalizeApiList(payload) {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.results)) return payload.results;
  return [];
}

function getEndpoint() {
  const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
  if (!codespaceName) {
    console.log('[Leaderboard] Missing REACT_APP_CODESPACE_NAME env var');
  }
  return `https://${codespaceName}-8000.app.github.dev/api/leaderboards/`;
}

export default function Leaderboard() {
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const endpoint = getEndpoint();
    console.log('[Leaderboard] REST endpoint:', endpoint);

    let isMounted = true;
    setLoading(true);
    setError(null);

    fetch(endpoint)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log('[Leaderboard] Fetched data:', data);
        if (!isMounted) return;
        setEntries(normalizeApiList(data));
      })
      .catch((e) => {
        console.log('[Leaderboard] Fetch error:', e);
        if (!isMounted) return;
        setError(e);
      })
      .finally(() => {
        if (!isMounted) return;
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section>
      <h2 className="mb-3">Leaderboard</h2>

      {loading && <div className="alert alert-info">Loading leaderboard…</div>}
      {error && (
        <div className="alert alert-danger">
          Failed to load leaderboard: {String(error.message || error)}
        </div>
      )}

      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th className="text-end">Score</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e) => (
              <tr key={e.id || `${e.user?.username}-${e.score}`}
              >
                <td className="text-nowrap">{e.id}</td>
                <td>{e.user?.username || ''}</td>
                <td className="text-end">{e.score}</td>
              </tr>
            ))}
            {!loading && entries.length === 0 && (
              <tr>
                <td colSpan={3} className="text-muted">
                  No leaderboard entries found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
