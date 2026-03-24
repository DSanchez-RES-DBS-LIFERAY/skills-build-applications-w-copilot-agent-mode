import React, { useEffect, useState } from 'react';

function normalizeApiList(payload) {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.results)) return payload.results;
  return [];
}

function getEndpoint() {
  const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
  if (!codespaceName) {
    console.log('[Workouts] Missing REACT_APP_CODESPACE_NAME env var');
  }
  return `https://${codespaceName}-8000.app.github.dev/api/workouts/`;
}

export default function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const endpoint = getEndpoint();
    console.log('[Workouts] REST endpoint:', endpoint);

    let isMounted = true;
    setLoading(true);
    setError(null);

    fetch(endpoint)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log('[Workouts] Fetched data:', data);
        if (!isMounted) return;
        setWorkouts(normalizeApiList(data));
      })
      .catch((e) => {
        console.log('[Workouts] Fetch error:', e);
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
      <h2 className="mb-3">Workouts</h2>

      {loading && <div className="alert alert-info">Loading workouts…</div>}
      {error && (
        <div className="alert alert-danger">
          Failed to load workouts: {String(error.message || error)}
        </div>
      )}

      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th className="text-end">Duration</th>
            </tr>
          </thead>
          <tbody>
            {workouts.map((w) => (
              <tr key={w.id || w.name}>
                <td className="text-nowrap">{w.id}</td>
                <td>{w.name}</td>
                <td className="text-break">{w.description}</td>
                <td className="text-end">{w.duration}</td>
              </tr>
            ))}
            {!loading && workouts.length === 0 && (
              <tr>
                <td colSpan={4} className="text-muted">
                  No workouts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
