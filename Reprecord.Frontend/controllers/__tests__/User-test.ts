import { getUserSelf, putUser } from "../UserController";
import ApiClient from "../../services/ApiClient";

jest.mock("../../services/ApiClient");

describe("UserController", () => {
	const mockUser = { id: "1", name: "Test user" };

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("should fetch self info", async () => {
		(ApiClient.get as jest.Mock).mockResolvedValue(mockUser);

		const res = await getUserSelf();

		expect(ApiClient.get).toHaveBeenCalledWith(`${process.env.EXPO_PUBLIC_API_BASE_URL}/users/me`);
		expect(res).toEqual(mockUser);
	});

	it("should throw error for fetch self info", async () => {
		const spy = jest.spyOn(console, "error").mockImplementation(() => {});
		(ApiClient.get as jest.Mock).mockRejectedValue(new Error("test error"));

		const res = await getUserSelf();

		expect(ApiClient.get).toHaveBeenCalledWith(`${process.env.EXPO_PUBLIC_API_BASE_URL}/users/me`);
		expect(spy).toHaveBeenCalledWith(new Error("test error"));
		expect(res).toBeUndefined();

		spy.mockRestore();
	});

	it("should update user", async () => {
		(ApiClient.put as jest.Mock).mockResolvedValue(mockUser);

		const res = await putUser(mockUser);

		expect(ApiClient.put).toHaveBeenCalledWith(
			`${process.env.EXPO_PUBLIC_API_BASE_URL}/users/1`,
			JSON.stringify(mockUser)
		);
		expect(res).toEqual(mockUser);
	});

	it("should throw error when updating user", async () => {
		const spy = jest.spyOn(console, "error").mockImplementation(() => {});
		(ApiClient.put as jest.Mock).mockRejectedValue(new Error("test error"));

		const res = await putUser(mockUser);

		expect(ApiClient.put).toHaveBeenCalledWith(
			`${process.env.EXPO_PUBLIC_API_BASE_URL}/users/1`,
			JSON.stringify(mockUser)
		);
		expect(spy).toHaveBeenCalledWith(new Error("test error"));
		expect(res).toBeUndefined();

		spy.mockRestore();
	});
});
