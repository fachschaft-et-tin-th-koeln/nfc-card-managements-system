import { Options, Vue } from 'vue-class-component'

import { ApiService } from '@/services/ApiService';

// Layouts

// Components

// Sections

// Interfaces

@Options({
	name: "OpeningTime",
	components: {

	}
})
export default class OpeningTime extends Vue {
	private eventTitle = "";

	public created(): void {
		this.getEventTitle();
	}

	private async getEventTitle() {
		const service = new ApiService<string>('api/settings/event-title');
		await service.initialize();

		if (service.code == 200) {
			const data = service.data as string[];
			if (data) {
				this.eventTitle = (data as any).value;
			}
		} else {
			console.log(service);
			console.log(service.message);
		}
	}
}
