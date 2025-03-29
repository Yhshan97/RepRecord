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

	it("should call refreshAccessToken if 403 error occurs", async () => {
		(global as any).fetch = jest
			.fn()
			.mockResolvedValueOnce({
				ok: false,
				status: 403,
				statusText: "Forbidden",
				json: () => Promise.resolve({}),
			})
			.mockResolvedValueOnce({
				ok: true,
				status: 200,
				statusText: "OK",
				json: () => Promise.resolve({ data: "test" }),
			});

		const refreshSpy = jest.spyOn(ApiClient, "refreshAccessToken").mockResolvedValueOnce(undefined);
		const response = await ApiClient.get("/test-endpoint");

		expect(refreshSpy).toHaveBeenCalled();
		expect(fetch).toHaveBeenCalledTimes(2);
		expect(response).toEqual({ data: "test" });
	});

	it("should request for refresh Token", async () => {
		(storage.getItem as jest.Mock).mockResolvedValueOnce("test-refresh-token");
		(global as any).fetch = jest.fn(() =>
			Promise.resolve({
				ok: true,
				status: 200,
				statusText: "OK",
				json: () => Promise.resolve({ access_token: mockToken }),
			})
		);

		await ApiClient.refreshAccessToken();

		expect(storage.getItem).toHaveBeenCalledWith(STORAGE_KEYS.REFRESH_TOKEN);
		expect(fetch).toHaveBeenCalledWith(`${process.env.EXPO_PUBLIC_API_BASE_URL}/auth/refresh`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ refreshToken: "test-refresh-token" }),
		});
		expect(storage.setItem).toHaveBeenCalledWith(STORAGE_KEYS.ACCESS_TOKEN, mockToken);
	});

	it("should throw an error if no refresh token is found", async () => {
		(storage.getItem as jest.Mock).mockResolvedValueOnce(null);

		await expect(ApiClient.refreshAccessToken()).rejects.toThrow("No refresh token found");
	});

	it("should throw an error if refresh token request fails", async () => {
		(global as any).fetch = jest.fn(() =>
			Promise.resolve({
				ok: false,
				status: 500,
				statusText: "Internal Server Error",
				json: () => Promise.resolve({}),
			})
		);

		(storage.getItem as jest.Mock).mockResolvedValueOnce("test-refresh-token");
		await expect(ApiClient.refreshAccessToken()).rejects.toThrow("ApiClient error (500): Internal Server Error");
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
			body: data,
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
			body: data,
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
