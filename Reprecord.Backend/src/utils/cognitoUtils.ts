const CLIENT_ID = process.env.COGNITO_CLIENT_ID;
const REDIRECT_URI = process.env.COGNITO_REDIRECT_URI;

export const exchangeAuthCode = async (code: string) => {
	const params = new URLSearchParams({
		code,
		client_id: CLIENT_ID!,
		redirect_uri: REDIRECT_URI!,
		grant_type: "authorization_code",
	});

	const response = await fetch(`https://${process.env.COGNITO_DOMAIN}/oauth2/token`, {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: params.toString(),
	});

	if (!response.ok) {
		throw new Error(`Code: ${response.status}, Failed to exchange authorization code for tokens`);
	}

	const tokens = await response.json();
	return tokens;
};

export const getNewAccessToken = async (refreshToken: string) => {
	const params = new URLSearchParams({
		grant_type: "refresh_token",
		client_id: CLIENT_ID!,
		refresh_token: refreshToken,
	});

	const response = await fetch(`https://${process.env.COGNITO_DOMAIN}/oauth2/token`, {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: params.toString(),
	});

	if (!response.ok) {
		throw new Error(`Code: ${response.status}, Failed to refresh access token`);
	}

	const newTokens = await response.json();
	return newTokens;
};
