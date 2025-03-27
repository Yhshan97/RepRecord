import React, { createContext, useState, useEffect, ReactNode } from "react";
import { storage, STORAGE_KEYS } from "@/helpers/Storage";
import { validateUserToken, handleLoginPress, handleLogoutPress } from "@/helpers/Auth";
import { router, usePathname } from "expo-router";

interface AuthContextProps {
	isLogged: boolean;
	login: () => void;
	logout: () => void;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [isLogged, setIsLogged] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const currentPath = usePathname();

	useEffect(() => {
		const checkToken = async () => {
			await validateUserToken();
			const storedToken = await storage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
			setIsLogged(!!storedToken);
			setIsLoading(false);
		};
		checkToken();
	}, []);

	useEffect(() => {
		if (isLoading) return;

		if (!isLogged && currentPath !== "/login") {
			router.dismissTo("/login");
		} else if (isLogged && currentPath === "/login") {
			router.dismissTo("/");
		}
	}, [isLogged, isLoading]);

	const login = async () => {
		const status = await handleLoginPress();
		setIsLogged(status);
	};

	const logout = async () => {
		const status = await handleLogoutPress();
		setIsLogged(!status);
	};

	if (isLoading) {
		return null;
	}

	return <AuthContext.Provider value={{ isLogged, login, logout }}>{children}</AuthContext.Provider>;
};
