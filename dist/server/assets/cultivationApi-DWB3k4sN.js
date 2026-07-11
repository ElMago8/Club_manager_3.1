const API_BASE_URL = "http://localhost:4000/api";
class ApiRequestError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
    this.name = "ApiRequestError";
  }
  status;
}
async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers
    }
  });
  if (!response.ok) {
    let message = `Error HTTP ${response.status}`;
    try {
      const body = await response.json();
      message = body.message ?? body.error ?? message;
    } catch {
    }
    throw new ApiRequestError(message, response.status);
  }
  return response.json();
}
async function withMockFallback(apiCall, mockCall) {
  try {
    return await apiCall();
  } catch (error) {
    return mockCall();
  }
}
export {
  apiRequest as a,
  withMockFallback as w
};
