import { Module } from 'vuex';
import { RootState } from '@/store/root.store';

import { SpotifyState } from './state.store';

import { actions } from './actions.store';
import { mutations } from './mutations.store';
import { getters } from './getters.store';

/**
 * Initial state of the Authentication module in Vuex Store.
 *
 * This state object defines the initial state for the authentication module of the Vuex store.
 */
export const state: SpotifyState = {
	access_token: '',
	token_type: '',
};

/**
 * Vuex 'authentication' module.
 *
 * This module contains the state, getters, actions, and mutations for authentication-level
 * state management. It is namespaced for modular organization within the Vuex store.
 *
 * @Author: Simon Marcel Linden
 * @Version: 1.0.0
 * @since: 1.0.0
 */
export const SpotifyModul: Module<SpotifyState, RootState> = {
	namespaced: true,
	state,
	actions,
	mutations,
	getters,
};

