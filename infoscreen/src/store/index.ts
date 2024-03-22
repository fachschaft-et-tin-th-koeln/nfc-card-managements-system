import { createStore } from 'vuex'
import { RootState } from '@/store/root.store';

/**
 * createStore - Function to create the Vuex store.
 *
 * This function initializes the Vuex store for the application. It defines
 * the root state structure, along with getters, mutations, actions, and modules.
 * The store manages the state of the entire application and serves as the central
 * hub for state management.
 *
 */
export default createStore<RootState>({
	state: {
		version: '1.0.0',
		displayMode: 'dashboard'
	},
	getters: {
		GET_DISPLAY_MODE: (state: RootState) => {
			return state.displayMode;
		},
	},
	mutations: {
		SET_DISPLAY_MODE(state: RootState, value: string) {
			state.displayMode = value;
		},
	},
	actions: {
		// Define your actions here
	},
	modules: {
		// Define your modules here
	},
})
