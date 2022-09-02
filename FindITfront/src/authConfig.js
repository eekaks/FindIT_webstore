export const msalConfig = {
	auth: {
		clientId: "b60eb00c-eab8-47c0-a7cb-8b584bbe9700",
		authority: "https://login.microsoftonline.com/aa26dc99-35aa-47ee-b1f5-d892b9d8f2e2", // This is a URL (e.g. https://login.microsoftonline.com/{your tenant ID})
		redirectUri: "https://finditfront.azurewebsites.net/",
	},
	cache: {
		cacheLocation: "sessionStorage", // This configures where your cache will be stored
		storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
	}
};

// Add scopes here for ID token to be used at Microsoft identity platform endpoints.
export const loginRequest = {
 scopes: ["User.Read"]
};

// Add the endpoints here for Microsoft Graph API services you'd like to use.
export const finditConfig = {
		findITEndpoint: "https://findit3.azurewebsites.net/"
};