import { MutationTree } from 'vuex';

import { SpotifyState } from './state.store';

/**
 * Mutations for AuthenticationState in Vuex Store.
 *
 * These mutations are part of the Vuex store's authentication module. They provide
 * methods to directly modify the state properties of the AuthenticationState.
 *
 * @Author: Simon Marcel Linden
 * @Version: 1.0.0
 * @since: 1.0.0
 */
export const mutations: MutationTree<SpotifyState> = {
	/**
	 * Set the authenticated state of the application.
	 *
	 * This mutation sets the access token and token type in the AuthenticationState.
	 *
	 * @param {AuthenticationState} state - The current state of the authentication module.
	 * @param {Object} payload - The payload containing the access token and token type.
	 */
	SET_AUTHENTICATED(state: SpotifyState, payload: { access_token: string, token_type: string }) {
		state.access_token = payload.access_token;
		state.token_type = payload.token_type;
	},

	/**
	 * Set the access token of the application.
	 *
	 * This mutation updates the access token in the AuthenticationState.
	 *
	 * @param {SpotifyState} state - The current state of the authentication module.
	 * @param {string} access_token - The access token to be set.
	 */
	SET_TOKEN(state, access_token) {
		state.access_token = access_token;
	},

	/**
	 * Set the error state of the authentication.
	 *
	 * This mutation resets the authentication state properties to their initial state
	 * in case of an error or when logging out.
	 *
	 * @param {AuthenticationState} state - The current state of the authentication module.
	 */
	SET_ERROR(state: SpotifyState) {
		state.access_token = '';
		state.token_type = '';
		state.expires_in = 0;
	},
};
