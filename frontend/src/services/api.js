const API_BASE = import.meta.env.VITE_API_BASE || '/api';

async function parseResponse(response) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `Request failed: ${response.status}`);
  }

  return data;
}

function buildHeaders(headers = {}, token) {
  const nextHeaders = { ...headers };

  if (token) {
    nextHeaders.Authorization = `Bearer ${token}`;
  }

  return nextHeaders;
}

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, options);
  return parseResponse(response);
}

export async function apiGet(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: buildHeaders(options.headers, options.token)
  });
  return parseResponse(response);
}

export async function apiPost(path, payload, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    ...options,
    headers: buildHeaders(
      {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
      options.token
    ),
    body: JSON.stringify(payload)
  });

  return parseResponse(response);
}

export async function apiPatch(path, payload, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    method: 'PATCH',
    ...options,
    headers: buildHeaders(
      {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
      options.token
    ),
    body: JSON.stringify(payload)
  });

  return parseResponse(response);
}

export async function apiPut(path, payload, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    method: 'PUT',
    ...options,
    headers: buildHeaders(
      {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
      options.token
    ),
    body: JSON.stringify(payload)
  });

  return parseResponse(response);
}

export async function apiDelete(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    method: 'DELETE',
    ...options,
    headers: buildHeaders(options.headers, options.token)
  });

  return parseResponse(response);
}

export async function apiUploadFile(file, options = {}) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE}/uploads`, {
    method: 'POST',
    ...options,
    headers: buildHeaders(options.headers, options.token),
    body: formData
  });

  return parseResponse(response);
}
