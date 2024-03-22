import { Options, Vue } from 'vue-class-component'
import { IWidget } from '@/interfaces/widget.interface'

import axios from 'axios';

import store from '@/store';
import { SpotifyModul } from './store/index.store';

import SpotifyService from './SpotifyService';

@Options({
	'name': 'SpotifyWidget',
	components: {

	}
})
export default class SpotifyWidget extends Vue implements IWidget {
	id = 'spotify-widget';
	enabled = true;

	private currentlyPlaying: any = null;
	private accessToken: string | null = null;

	public created() {
		if (!(store.hasModule('spotify')))
			store.registerModule('spotify', SpotifyModul);
	}

	async mounted() {
		await this.fetchData();
	}

	async fetchData() {
		// const spotifyService = await SpotifyService.getInstance();

		// try {
		// 	// Token abrufen und im lokalen Zustand speichern
		// 	this.accessToken = await spotifyService.getAccessToken();

		// 	// console.log(this.accessToken)
		// 	// Verwendung des Tokens, um das aktuell gespielte Lied abzurufen
		// 	// https://api.spotify.com/v1/me/player/currently-playing
		// 	const response = await spotifyService.getCurrentPlayingTrack();

		// 	this.currentlyPlaying = response.data;
		// } catch (error) {
		// 	console.error('Fehler beim Abrufen des aktuellen Tracks oder Tokens', error);
		// }
	}



}
