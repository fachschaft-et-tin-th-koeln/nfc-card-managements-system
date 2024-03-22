import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

import config from '@/services/_config';

/**
 * ApiService - A generic class for handling API requests and state management for Vue applications.
 *
 * This class provides methods to initialize data fetching from an API, manage response data and errors,
 * and support pagination, searching, and filtering functionalities. It utilizes Axios for HTTP requests and
 * integrates with Vuex for global state management, particularly for loading states and authentication.
 *
 * @template T The type of data being fetched and managed.
 * @Author: Simon Marcel Linden
 * @Version: 1.0.0
 * @since: 1.0.0
 */
export class ApiService<T> {
	private url: string;
	private _data: T[] = []; // Data from API call
	private items: T[] = []; // Data from filtered method

	// Additional fields for API response details
	private _code!: number | string;
	private _status!: number;
	private _message!: string;

	private _pageSize: number;
	private _currentPage: number;

	constructor(url: string, pageSize = 10, currentPage = 1) {
		this.url = url;
		this._pageSize = pageSize;
		this._currentPage = currentPage;
	}

	// Getters for filtered items and API response details
	public get data(): T[] { return this._data; }
	get code(): number | string { return this._code; }
	get status(): number { return this._status; }
	get message(): string { return this._message; }

	/**
	 * Handles the initialization of API calls, setting loading states, and storing the fetched data.
	 * Supports 'get' and 'post' methods, and handles authorization headers automatically.
	 *
	 * @param {string} method - The HTTP method to use for the request ('get' or 'post').
	 * @param {any} params - The parameters for the request. For 'get', these are URL parameters; for 'post', they are included in the request body.
	 * @returns {Promise<void>} A promise that resolves when the request completes.
	 *
	 * @Author: Simon Marcel Linden
	 * @Version: 1.0.0
	 * @since: 1.0.0
	 */
	public async initialize(method = 'get', params?: any): Promise<void> {
		try {
			const headers = {
				// Authorization: `Bearer ${store.getters['AUTH/GET_ACCCESS_TOKEN']}`,
			};

			// Direkt deklarieren ohne Initialisierung auf null
			let response: AxiosResponse;
			if (method == 'get') {
				// Für GET, fügen Sie Parameter als URL-Parameter hinzu
				const requestConfig: AxiosRequestConfig = { headers, params };
				response = await axios.get(`${config.apiUrl}/${this.url}`, requestConfig);
			} else {
				// Für POST, senden Sie Daten im Body der Anfrage
				response = await axios.post(`${config.apiUrl}/${this.url}`, params, { headers });
			}

			this._data = response.data as T[];

			this._code = response.status;
			this._status = response.status;
			this._message = response.statusText;

			// this.updateFilteredItems(); // Aktualisiere gefilterte Items basierend auf aktuellen Parametern
		} catch (error) {
			if (axios.isAxiosError(error)) {
				this._code = error.code || 'Unknown code';
				this._status = error.response?.status || 0;
				this._message = error.message;
			} else if (error instanceof Error) {
				this._message = error.message;
				this._code = 'Generic error';
				this._status = 0;
			} else {
				console.error('Unhandled error type:', error);
				this._message = 'An unexpected error occurred';
				this._code = 'Unknown error';
				this._status = 0;
			}
		}
	}

	/**
	 * Updates the list of items based on the current page and size for pagination.
	 * This method is used internally to manage the paginated display of data.
	 *
	 * @Author: Simon Marcel Linden
	 * @Version: 1.0.0
	 * @since: 1.0.0
	 */
	private updateFilteredItems(): void {
		const start = (this._currentPage - 1) * this._pageSize;
		const end = this._currentPage * this._pageSize;
		this.items = this._data.slice(start, end);
	}

	/**
	 * Changes the current page number and updates the list of displayed items accordingly.
	 * This allows for dynamic pagination control.
	 *
	 * @param {number} page - The new page number to set.
	 *
	 * @Author: Simon Marcel Linden
	 * @Version: 1.0.0
	 * @since: 1.0.0
	 */
	public changePage(page: number): void {
		this._currentPage = page;
		this.updateFilteredItems(); // Aktualisiere gefilterte Items für die neue Seite
	}

	/**
	 * Changes the size of pages (number of items per page) and updates the list of displayed items.
	 * This allows for dynamic control over pagination size.
	 *
	 * @param {number} size - The new page size to set.
	 *
	 * @Author: Simon Marcel Linden
	 * @Version: 1.0.0
	 * @since: 1.0.0
	 */
	public changePageSize(size: number): void {
		this._pageSize = size;
		this.updateFilteredItems(); // Aktualisiere gefilterte Items für die neue Seite
	}

	/**
	 * Filters the data based on a search query. The search can be generic or targeted to a specific field.
	 * Updates the list of displayed items based on the search results and current pagination.
	 *
	 * @param {string} searchQuery - The query string for the search, which can be a generic term or formatted as 'field:value'.
	 * @returns {T[]} The filtered list of items based on the search query.
	 *
	 * @Author: Simon Marcel Linden
	 * @Version: 1.0.0
	 * @since: 1.0.0
	 */
	public search(searchQuery: string): T[] {
		let filtered: T[] = this._data;
		if (!searchQuery) {
			return filtered;
		}

		const [key, searchWord] = searchQuery.split(':');

		if (searchWord) {
			filtered = this._data.filter(item => this.matchesSearch(item, key, searchWord));
		} else {
			const search = key.toLowerCase();
			filtered = this._data.filter(item => this.matchesSearchAny(item, search));
		}

		const start = (this._currentPage - 1) * this._pageSize;
		const end = this._currentPage * this._pageSize;
		this.items = filtered.slice(start, end);

		return this.items;
	}

	/**
	 * Checks if the given item is a record (object).
	 *
	 * This utility method is used to safely check if an item is an object before attempting to access its properties.
	 *
	 * @param {unknown} item - The item to check.
	 * @returns {boolean} True if the item is a record, false otherwise.
	 *
	 * @Author: Simon Marcel Linden
	 * @Version: 1.0.0
	 * @since: 1.0.0
	 */
	private isRecord(item: unknown): item is Record<string, unknown> {
		return typeof item === 'object' && item !== null;
	}

	/**
	 * Checks if the given item matches the search criteria based on a specific key.
	 *
	 * This method is used to perform a targeted search on the item's property specified by the key against the search word.
	 *
	 * @param {T} item - The item to check.
	 * @param {string} key - The key of the item's property to search.
	 * @param {string} searchWord - The search word to compare against the item's property.
	 * @returns {boolean} True if the item's specified property matches the search word, false otherwise.
	 *
	 * @Author: Simon Marcel Linden
	 * @Version: 1.0.0
	 * @since: 1.0.0
	 */
	private matchesSearch(item: T, key: string, searchWord: string): boolean {
		if (this.isRecord(item)) {
			const value = item[key];
			return typeof value === 'string' && value.toLowerCase().includes(searchWord.toLowerCase());
		}
		return false;
	}

	/**
	 * Checks if any property of the given item matches the search word.
	 *
	 * This method is used to perform a generic search across all string properties of the item against the search word.
	 *
	 * @param {T} item - The item to check.
	 * @param {string} searchWord - The search word to compare against the item's properties.
	 * @returns {boolean} True if any of the item's string properties match the search word, false otherwise.
	 *
	 * @Author: Simon Marcel Linden
	 * @Version: 1.0.0
	 * @since: 1.0.0
	 */
	private matchesSearchAny(item: T, searchWord: string): boolean {
		if (this.isRecord(item)) {
			return Object.values(item).some(value =>
				typeof value === 'string' && value.toLowerCase().includes(searchWord.toLowerCase())
			);
		}
		return false;
	}
}

