/**
 * Centralized fetcher for SWR with credentials included
 * This ensures Clerk session cookies are sent with all API requests
 */
export const fetcher = (url: string) => 
  fetch(url, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    }
  }).then((res) => {
    if (!res.ok) {
      throw new Error(`API request failed: ${res.status}`);
    }
    return res.json();
  });