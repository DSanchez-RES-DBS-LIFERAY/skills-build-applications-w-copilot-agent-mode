import React, { useEffect, useState } from 'react';

function normalizeApiList(payload) {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.results)) return payload.results;
  return [];
}

function getEndpoint() {
  const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
  if (!codespaceName) {
    console.log('[Teams] Missing REACT_APP_CODESPACE_NAME env var');
  }
  return `https://${codespaceName}-8000.app.github.dev/api/teams/`;
}

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const endpoint = getEndpoint();
    console.log('[Teams] REST endpoint:', endpoint);

    let isMounted = true;
    setLoading(true);
    setError(null);

    fetch(endpoint)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log('[Teams] Fetched data:', data);
        if (!isMounted) return;
        setTeams(normalizeApiList(data));
      })
      .catch((e) => {
        console.log('[Teams] Fetch error:', e);
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
      <h2 className="mb-3">Teams</h2>

      {loading && <div className="alert alert-info">Loading teams…</div>}
      {error && (
        <div className="alert alert-danger">
          Failed to load teams: {String(error.message || error)}
        </div>
      )}

      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((t) => (
              <tr key={t.id || t.name}>
                <td className="text-nowrap">{t.id}</td>
                <td>{t.name}</td>
              </tr>
            ))}
            {!loading && teams.length === 0 && (
              <tr>
                <td colSpan={2} className="text-muted">
                  No teams found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
