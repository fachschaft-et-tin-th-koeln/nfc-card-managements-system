import { Options, Vue } from 'vue-class-component'
import store from './store';

import { ApiService } from '@/services/ApiService';

const element = document.getElementsByTagName('html')[0];

// Layouts
import VueLayout from '@/layouts/index.layout.vue';

// Interfaces
interface Setting {
	id: number;
	key: string;
	value: string;
	type: string;
	description: string;
}

// Components

@Options({
	components: {
		VueLayout
	}
})
export default class App extends Vue {
	private displayMode!: string;

	public created(): void {
		this.getDisplayMode();
	}

	private async getDisplayMode() {
		const service = new ApiService<Setting>('api/settings/mode');
		await service.initialize();

		if (service.code == 200) {
			const data = service.data as Setting[];
			if (data) {
				this.displayMode = (data as any).value;
				store.commit('SET_DISPLAY_MODE', this.displayMode);
				// element.className = (this.displayMode == 'party') ? 'dark' : 'light';
				element.className = 'dark';
			} else {
				// element.className = 'light';
				element.className = 'dark';
			}
		} else {
			console.log(service);
			console.log(service.message);
			// element.className = 'light';
			element.className = 'dark';
		}

		return service;
	}
}
