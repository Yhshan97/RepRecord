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
	const pathname = usePathname();

	useEffect(() => {
		const checkToken = async () => {
			await validateUserToken();
			const storedToken = storage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
			setIsLogged(!!storedToken);
			setIsLoading(false);
		};
		checkToken();
	}, []);

	useEffect(() => {
		if (!isLoading && !isLogged && pathname !== "/login") {
			router.replace("/login");
		}
	}, [isLoading, isLogged, pathname]);

	const login = async () => {
		if (await handleLoginPress()) {
			setIsLogged(true);
			router.replace("/");
		}
	};

	const logout = async () => {
		if (await handleLogoutPress()) {
			setIsLogged(false);
			router.replace("/login");
		}
	};

	if (isLoading) {
		return null;
	}

	return <AuthContext.Provider value={{ isLogged, login, logout }}>{children}</AuthContext.Provider>;
};
