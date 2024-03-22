import { Options, Vue } from 'vue-class-component'

import { ApiService } from '@/services/ApiService';

// Interfaces

// Layouts

// Sections

// Components

@Options({
	components: {

	}
})
export default class OrganizerName extends Vue {
	private organizerName = "";

	public created(): void {
		this.getOrganizerName();
	}

	private async getOrganizerName() {
		const service = new ApiService<string>('api/settings/organizer-name');
		await service.initialize();

		if (service.code == 200) {
			const data = service.data as string[];
			if (data) {
				this.organizerName = (data as any).value;
			}
		} else {
			console.log(service);
			console.log(service.message);
		}
	}
}
