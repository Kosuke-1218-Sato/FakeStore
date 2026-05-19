// Base URL of backend server
const BASE_URL = "http://172.20.10.7:3000";

// Generic API request function used across the app
export async function apiRequest(
  endpoint,
  method = "GET",
  body = null,
  token = null
) {
  // Send HTTP request to backend
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",

      // Attach token for authenticated requests
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : null,
  });

  // Read raw response as text
  const text = await res.text();

  // Debug logs for status and response
  console.log("STATUS:", res.status);
  console.log("RESPONSE:", text);

  let data = {};

  // Try to parse response as JSON
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    // Handle cases where server does not return valid JSON
    throw new Error("Server did not return JSON: " + text.slice(0, 100));
  }

  // Handle HTTP errors (e.g. 404, 500)
  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  // Handle API-level errors returned in JSON
  if (data.status === "error") {
    throw new Error(data.message || "Error");
  }

  // Return parsed response data
  return data;
}