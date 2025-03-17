import { storage, STORAGE_KEYS } from "@/helpers/Storage";

interface RequestOptions extends RequestInit {
	requireAuth?: boolean;
}

class ApiClient {
	private static instance: ApiClient;
	private baseUrl: string;

	private constructor() {
		this.baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL!;
	}

	static getInstance(): ApiClient {
		if (!ApiClient.instance) {
			ApiClient.instance = new ApiClient();
		}
		return ApiClient.instance;
	}

	async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
		const { requireAuth = true, ...fetchOptions } = options;
		const url = endpoint.startsWith("http") ? endpoint : `${this.baseUrl}${endpoint}`;

		let headers: Record<string, string> = {
			"Content-Type": "application/json",
			...(fetchOptions.headers as Record<string, string>),
		};

		if (requireAuth) {
			const token = await storage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

			if (!token) {
				throw new Error("no access token found");
			}
			headers = { ...headers, Authorization: `Bearer ${token}` };
		}

		const config = {
			...fetchOptions,
			headers,
		};

		try {
			const res = await fetch(url, config);

			if (!res.ok) {
				throw new Error(`ApiClient error (${res.status}): ${res.statusText}`);
			}
			return await res.json();
		} catch (err) {
			console.error("ApiClient request failed:", err);
			throw err;
		}
	}

	async get<T>(endpoint: string, extraOptions: RequestOptions = {}): Promise<T> {
		return this.request<T>(endpoint, { ...extraOptions, method: "GET" });
	}

	async post<T>(endpoint: string, data: any, extraOptions: RequestOptions = {}): Promise<T> {
		return this.request<T>(endpoint, {
			...extraOptions,
			method: "POST",
			body: data,
		});
	}

	async put<T>(endpoint: string, data: any, extraOptions: RequestOptions = {}): Promise<T> {
		return this.request<T>(endpoint, {
			...extraOptions,
			method: "PUT",
			body: data,
		});
	}

	async delete<T>(endpoint: string, extraOptions: RequestOptions = {}): Promise<T> {
		return this.request<T>(endpoint, { ...extraOptions, method: "DELETE" });
	}
}

export default ApiClient.getInstance();
