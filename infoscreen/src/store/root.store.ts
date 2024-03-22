/**
 * RootState - Interface for the root state of the Vuex store.
 *
 * This interface defines the shape of the root state object in the Vuex store.
 * It currently only contains a version property, which can be used to track
 * the version of the state structure.
 *
 */
export interface RootState {
	version: string;
	displayMode: string;
}
