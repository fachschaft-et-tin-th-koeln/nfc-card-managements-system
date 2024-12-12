import { Options, Vue } from "vue-class-component";

// Interfaces

// Layouts

// Sections

// Components
import NewsFeedWidget from "@/widgets/news-feed/news-feed.widget.vue";
import MenuWidget from "@/widgets/menu/menu.widget.vue";
import ClockWidget from "@/widgets/clock/clock.widget.vue";
import THF07IcalWidget from "@/widgets/th-f07-ical/th-f07-ical.widget.vue";
import FsrInformation from "@/widgets/fsr-information/fsr-information.widget.vue";

@Options({
  name: "DashboardSection",
  components: {
    NewsFeedWidget,
    MenuWidget,
    ClockWidget,
    THF07IcalWidget,
    FsrInformation,
  },
})
export default class DashboardSection extends Vue {}
