import { Options, Vue } from 'vue-class-component'
import store from '@/store';


const element = document.getElementsByTagName('html')[0];

// Layouts

// Interfaces
interface Setting {
	id: number;
	key: string;
	value: string;
	type: string;
	description: string;
}

// Sections
import DashboardSection from '@/views/sections/dashboard/dashboard.section.vue'
import EventSection from '@/views/sections/events/event.section.vue'

// Components

@Options({
	components: {
		DashboardSection,
		EventSection
	},
	props: {
		displayMode: { type: String, require: false, default: 'dashboard' }
	}
})
export default class Dashboard extends Vue {
	public displayMode!: string;

	created() {
		console.log(store.getters['GET_DISPLAY_MODE'])
	}
}
