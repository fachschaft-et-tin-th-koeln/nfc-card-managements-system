import axios from 'axios';

const TOKEN_URL = `https://accounts.spotify.com/api/token`;


class SpotifyService {
	private clientID = process.env.VUE_APP_SPOTIFY_CLIENT_ID;
	private clientSecret = process.env.VUE_APP_SPOTIFY_CLIENT_SECRET;
	private refreshToken = process.env.VUE_APP_SPOTIFY_REFRESH_TOKEN;
	// private basicAuth = Buffer.from(`${this.clientID}:${this.clientSecret}`).toString('base64');

	async getAccessToken() {
		// const response = await axios.post(TOKEN_URL, querystring.stringify({
		// 	grant_type: 'refresh_token',
		// 	refresh_token: this.refreshToken,
		// }), {
		// 	headers: {
		// 		Authorization: `Basic ${this.basicAuth}`,
		// 		'Content-Type': 'application/x-www-form-urlencoded',
		// 	},
		// });

		// return response.data;
	}
}

class SpotifyService_old {
	private static instance: SpotifyService_old;

	private readonly TOKEN_URL = 'https://accounts.spotify.com/api/token';
	public readonly BASE_URL = 'https://api.spotify.com/v1';

	private clientID = process.env.VUE_APP_SPOTIFY_CLIENT_ID;
	private clientSecret = process.env.VUE_APP_SPOTIFY_CLIENT_SECRET;

	private accessToken: string | null = null;

	private constructor() {
		this.initializeToken();
	}

	public static getInstance(): SpotifyService_old {
		if (!SpotifyService_old.instance) {
			SpotifyService_old.instance = new SpotifyService_old();
		}
		return SpotifyService_old.instance;
	}

	private async initializeToken() {
		const params = new URLSearchParams();

		params.append('grant_type', 'client_credentials');
		const headers = {
			'Content-Type': 'application/x-www-form-urlencoded',
			Authorization: `Basic ${btoa(`${this.clientID}:${this.clientSecret}`)}`,
		};

		try {
			const response = await axios.post(this.TOKEN_URL, params, { headers });
			this.accessToken = response.data.access_token;
		} catch (error) {
			console.error('Error fetching access token', error);
			throw error;
		}
	}

	private async ensureTokenInitialized() {
		if (this.accessToken === null) {
			await this.initializeToken();
		}
	}

	public async getAccessToken() {
		if (!this.accessToken)
			await this.ensureTokenInitialized();
		return this.accessToken;
	}

	async getCurrentPlayingTrack() {
		try {
			// curl--request GET \
			// --url https://api.spotify.com/v1/me/player/currently-playing \
			// --header 'Authorization: Bearer 1POdFZRZbvb...qqillRxMr2z'

			const response = await axios.get(`https://api.spotify.com/v1/me/player/currently-playing`, {
				headers: {
					Authorization: `Bearer  ${this.accessToken}`,
				},
			});

			return response.data;
		} catch (error) {
			console.error('Error fetching currently playing track', error);
			throw error;
		}
	}
}

export default SpotifyService;
