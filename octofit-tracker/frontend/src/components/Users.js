import React, { useEffect, useState } from 'react';

function normalizeApiList(payload) {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.results)) return payload.results;
  return [];
}

function getEndpoint() {
  const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
  if (!codespaceName) {
    console.log('[Users] Missing REACT_APP_CODESPACE_NAME env var');
  }
  return `https://${codespaceName}-8000.app.github.dev/api/users/`;
}

export default function Users() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const endpoint = getEndpoint();
    console.log('[Users] REST endpoint:', endpoint);

    let isMounted = true;
    setLoading(true);
    setError(null);

    fetch(endpoint)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log('[Users] Fetched data:', data);
        if (!isMounted) return;
        setUsers(normalizeApiList(data));
      })
      .catch((e) => {
        console.log('[Users] Fetch error:', e);
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
      <h2 className="mb-3">Users</h2>

      {loading && <div className="alert alert-info">Loading users…</div>}
      {error && (
        <div className="alert alert-danger">
          Failed to load users: {String(error.message || error)}
        </div>
      )}

      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Team</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id || `${u.username}-${u.email}`}
              >
                <td className="text-nowrap">{u.id}</td>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td>{u.team?.name || ''}</td>
              </tr>
            ))}
            {!loading && users.length === 0 && (
              <tr>
                <td colSpan={4} className="text-muted">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
