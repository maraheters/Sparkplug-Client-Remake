const API_BASE_URL = import.meta.env.VITE_API_URL;

export async function apiFetch<T>(
	endpoint: string,
	options: RequestInit = {},
	includeAuth: boolean = false
): Promise<T> {

	const user = localStorage.getItem("userAuth");
	const token = user ? JSON.parse(user).token : null;

	const res = await fetch(`${API_BASE_URL}${endpoint}`, {
		...options,
		headers: {
			"Content-Type": "application/json",
			...(includeAuth && token ? { Authorization: `Bearer ${token}` } : {}),
			...options.headers,
		},
	});

	if (!res.ok) {
		const errorText = await res.text();
		throw new Error(`API Error ${res.status}: ${errorText}`);
	}

    // Check if the response has a body and is valid JSON
    const contentType = res.headers.get("Content-Type");
    if (contentType?.includes("application/json")) {
        const text = await res.text();
        if (text) {
            try {
                return JSON.parse(text) as T;
            } catch (error) {
                throw new Error(`Invalid JSON response: ${error}`);
            }
        }
    }

    // If no body or not JSON, return null
    return null as T;
}
