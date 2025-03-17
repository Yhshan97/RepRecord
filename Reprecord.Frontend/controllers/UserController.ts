import ApiClient from "../services/ApiClient";

type User = {
	id: string;
	name: string;
};

const endpoint = `${process.env.EXPO_PUBLIC_API_BASE_URL}/users`;

export const getUserSelf = async () => {
	return await ApiClient.get<User>(`${endpoint}/me`).catch((err) => console.error(err));
};

export const putUser = async (user: User) => {
	return await ApiClient.put<User>(`${endpoint}/${user.id}`, JSON.stringify(user)).catch((err) => console.error(err));
};
