/**
 * AuthenticationState - Interface for the state of the authentication module in the Vuex store.
 *
 * This interface defines the structure of the state used in the Vuex authentication module.
 * It contains the access token, token type, user information, and expiration details of the authentication.
 *
 * @Author: Simon Marcel Linden
 * @Version: 1.0.0
 * @since: 1.0.0
 */
export interface SpotifyState {
	access_token: string;
	token_type: string;
	expires_in?: number;
}
