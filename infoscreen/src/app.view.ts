import { Options, Vue } from "vue-class-component";
import { ref } from "vue";
import store from "./store";

import { ApiService } from "@/services/ApiService";

const element = document.getElementsByTagName("html")[0];

// Layouts
import VueLayout from "@/layouts/index.layout.vue";
import ChristmasLayout from "@/layouts/christmas.layout.vue";
import PartyLayout from "./layouts/party.layout.vue";

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
		VueLayout,
		ChristmasLayout,
		PartyLayout,
	},
})
export default class App extends Vue {
	// Reaktive Property
	// public displayMode: string = "";
	// public displayMode!: string;
	public displayMode = ref<string>("");

	public created(): void {
		this.getDisplayMode();
	}

	private async getDisplayMode() {
		const service = new ApiService<Setting>("api/settings/mode");
		await service.initialize();

		if (service.code == 200) {
			const data = service.data as Setting[];
			console.log(data);
			if (data) {
				this.displayMode = (data as any).value;
				store.commit("SET_DISPLAY_MODE", this.displayMode);
				element.className = this.displayMode.value; // == "party" ? "dark" : "dark";
			} else {
				element.className = "dark";
			}
		} else {
			console.log(service);
			console.log(service.message);
			element.className = "dark";
		}

		return service;
	}
}
