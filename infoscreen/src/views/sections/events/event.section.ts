import { Options, Vue } from 'vue-class-component'

// Interfaces

// Layouts

// Sections

// Components
import MenuWidget from '@/widgets/menu/menu.widget.vue';
import ClockWidget from '@/widgets/clock/clock.widget.vue';
import SpotifyWidget from '@/widgets/spotify/spotify.widget.vue';

@Options({
	name: 'EventSection',
	components: {
		MenuWidget,
		ClockWidget,
		SpotifyWidget
	}
})
export default class EventSection extends Vue {

}
