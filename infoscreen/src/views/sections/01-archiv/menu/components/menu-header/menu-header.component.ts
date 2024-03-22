import { Options, Vue } from 'vue-class-component'

// Interfaces

// Layouts

// Sections

// Components
import OrganizerName from '../organizer-name/organizer-name.component.vue'
import EventTitle from '../event-title/event-title.component.vue'
import OpeningTime from '../opening-time/opening-time.component.vue'

@Options({
	components: {
		OrganizerName,
		EventTitle,
		OpeningTime
	}
})
export default class MenuHeader extends Vue {

}
