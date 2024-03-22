import { GetterTree } from 'vuex';

import { RootState } from '@/store/root.store';
import { SpotifyState } from './state.store';

/**
 * Getters for SpotifyState in Vuex Store.
 *
 * These getters provide access to authentication state properties,
 * such as the authentication status and user information.
 *
 * @Author: Simon Marcel Linden
 * @Version: 1.0.0
 * @since: 1.0.0
 */
export const getters: GetterTree<SpotifyState, RootState> = {
	/**
	 * GET_AUTHENTICATED - Determines if the user is authenticated.
	 *
	 * This getter checks if an access token exists and is not expired.
	 *
	 * @param {AuthenticationState} state - The current state of the authentication module.
	 * @returns {boolean} True if the user is authenticated, false otherwise.
	 */
	GET_AUTHENTICATED: (state: SpotifyState) => {
		return state.access_token;
	},

	GET_ACCCESS_TOKEN: (state: SpotifyState) => {
		return state.access_token;
	},
};
