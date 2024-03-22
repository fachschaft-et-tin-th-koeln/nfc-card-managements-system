import { ActionTree, Commit } from 'vuex';

import { RootState } from '@/store/root.store';
import { SpotifyState } from './state.store';

/**
 * Actions for AuthenticationState in Vuex Store.
 *
 * These actions handle authentication-related tasks such as logging in and restoring state.
 * They interact with the AuthenticationService and commit changes to the AuthenticationState.
 *
 * @Author: Simon Marcel Linden
 * @Version: 1.0.0
 * @since: 1.0.0
 */
export const actions: ActionTree<SpotifyState, RootState> = {
	/**
	 * LOGIN action to authenticate a user.
	 *
	 * It attempts to log in a user using the provided credentials. On success,
	 * it commits the authentication data to the state. On failure, it commits
	 * an error and rejects the promise.
	 *
	 * @param {Commit} commit - Vuex Commit method for committing mutations.
	 * @param {Object} payload - The payload containing username and password.
	 * @returns {Promise<TokenResponse|Response<User>>} A promise that resolves with the token response or rejects with an error response.
	 */
	async LOGIN({ commit }: { commit: Commit }, { username, password }: { username: string, password: string }) {
		console.log("Test Login")
	},

	/**
	 * RESTORE_STATE action to restore authentication state from local storage.
	 *
	 * It checks for the presence of an access token in local storage and, if found,
	 * commits it to the state.
	 *
	 * @param {Commit} commit - Vuex Commit method for committing mutations.
	 */
	RESTORE_STATE({ commit }) {
		const access_token = localStorage.getItem('access_token');
		if (access_token) {
			const token_type = localStorage.getItem('token_type');

			commit('SET_AUTHENTICATED', { access_token: access_token, token_type: token_type });
		}
	},

}
