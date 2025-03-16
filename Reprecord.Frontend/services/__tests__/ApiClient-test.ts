import ApiClient from "../ApiClient";
import { storage, STORAGE_KEYS } from "@/helpers/Storage";

jest.mock("@/helpers/Storage");

describe("ApiClient", () => {
	const mockToken = "test-token";
	const mockResponse = { data: "test" };

	beforeEach(() => {
		jest.clearAllMocks();
		(storage.getItem as jest.Mock).mockResolvedValue(mockToken);
		(global as any).fetch = jest.fn(() =>
			Promise.resolve({
				ok: true,
				status: 200,
				statusText: "OK",
				json: () => Promise.resolve(mockResponse),
			})
		);
	});

	it("should make a GET request with auth", async () => {
		const endpoint = "/test-endpoint";
		const url = `${process.env.EXPO_PUBLIC_API_BASE_URL}${endpoint}`;
		const res = await ApiClient.get(endpoint);

		expect(storage.getItem).toHaveBeenCalledWith(STORAGE_KEYS.ACCESS_TOKEN);
		expect(fetch).toHaveBeenCalledWith(url, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${mockToken}`,
			},
		});
		expect(res).toEqual(mockResponse);
	});

	it("should make a POST request with auth", async () => {
		const endpoint = "/test-endpoint";
		const url = `${process.env.EXPO_PUBLIC_API_BASE_URL}${endpoint}`;
		const data = { key: "value" };

		const res = await ApiClient.post(endpoint, data);

		expect(storage.getItem).toHaveBeenCalledWith(STORAGE_KEYS.ACCESS_TOKEN);
		expect(fetch).toHaveBeenCalledWith(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${mockToken}`,
			},
			body: JSON.stringify(data),
		});
		expect(res).toEqual(mockResponse);
	});

	it("should make a PUT request with auth", async () => {
		const endpoint = "/test-endpoint";
		const url = `${process.env.EXPO_PUBLIC_API_BASE_URL}${endpoint}`;
		const data = { key: "value" };

		const res = await ApiClient.put(endpoint, data);

		expect(storage.getItem).toHaveBeenCalledWith(STORAGE_KEYS.ACCESS_TOKEN);
		expect(fetch).toHaveBeenCalledWith(url, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${mockToken}`,
			},
			body: JSON.stringify(data),
		});
		expect(res).toEqual(mockResponse);
	});

	it("should make a DELETE request with auth", async () => {
		const endpoint = "/test-endpoint";
		const url = `${process.env.EXPO_PUBLIC_API_BASE_URL}${endpoint}`;

		const res = await ApiClient.delete(endpoint);

		expect(storage.getItem).toHaveBeenCalledWith(STORAGE_KEYS.ACCESS_TOKEN);
		expect(fetch).toHaveBeenCalledWith(url, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${mockToken}`,
			},
		});
		expect(res).toEqual(mockResponse);
	});

	it("should throw an error if no token is found", async () => {
		(storage.getItem as jest.Mock).mockResolvedValue(null);

		await expect(ApiClient.get("/test-endpoint")).rejects.toThrow("no access token found");
	});

	it("should not throw an error if no token is found and requireAuth is false", async () => {
		(storage.getItem as jest.Mock).mockResolvedValue(null);

		await expect(ApiClient.get("/test-endpoint", { requireAuth: false })).resolves.toEqual(mockResponse);
	});

	it("should throw an error if the response is not ok", async () => {
		(global as any).fetch = jest.fn(() =>
			Promise.resolve({
				ok: false,
				status: 500,
				statusText: "Internal Server Error",
				json: () => Promise.resolve({}),
			})
		);

		await expect(ApiClient.get("/test-endpoint")).rejects.toThrow("ApiClient error (500): Internal Server Error");
	});
});
