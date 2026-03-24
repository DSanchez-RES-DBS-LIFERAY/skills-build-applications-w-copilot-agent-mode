import React, { useEffect, useState } from 'react';

function normalizeApiList(payload) {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.results)) return payload.results;
  return [];
}

function getEndpoint() {
  const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
  if (!codespaceName) {
    console.log('[Activities] Missing REACT_APP_CODESPACE_NAME env var');
  }
  return `https://${codespaceName}-8000.app.github.dev/api/activities/`;
}

export default function Activities() {
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const endpoint = getEndpoint();
    console.log('[Activities] REST endpoint:', endpoint);

    let isMounted = true;
    setLoading(true);
    setError(null);

    fetch(endpoint)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log('[Activities] Fetched data:', data);
        if (!isMounted) return;
        setActivities(normalizeApiList(data));
      })
      .catch((e) => {
        console.log('[Activities] Fetch error:', e);
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
      <h2 className="mb-3">Activities</h2>

      {loading && <div className="alert alert-info">Loading activities…</div>}
      {error && (
        <div className="alert alert-danger">
          Failed to load activities: {String(error.message || error)}
        </div>
      )}

      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Type</th>
              <th className="text-end">Duration</th>
              <th className="text-end">Calories</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((a) => (
              <tr key={a.id || `${a.type}-${a.duration}-${a.calories}`}
              >
                <td className="text-nowrap">{a.id}</td>
                <td>{a.user?.username || ''}</td>
                <td>{a.type}</td>
                <td className="text-end">{a.duration}</td>
                <td className="text-end">{a.calories}</td>
              </tr>
            ))}
            {!loading && activities.length === 0 && (
              <tr>
                <td colSpan={5} className="text-muted">
                  No activities found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
