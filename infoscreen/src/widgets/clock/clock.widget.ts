import { Options, Vue } from 'vue-class-component'
import { IWidget } from '@/interfaces/widget.interface'

// Interfaces

// Layouts

// Sections

// Components

@Options({
	name: "ClockWidget",
	components: {
	}
})
export default class ClockWidget extends Vue implements IWidget {
	id = 'menu-widget';
	enabled = true;

	private date = new Date();
	private updateTimeInterval!: number;

	private currentTime = this.getFormattedTime(new Date());
	private currentDate = this.getFormattedDate(new Date());
	private currentWeek: number = this.getWeek(new Date);

	public mounted() {
		this.updateTimeInterval = setInterval(this.updateCurrentTime, 1000);
	}

	public beforeUnmount() {
		clearInterval(this.updateTimeInterval);
	}

	private updateCurrentTime = () => {
		const date = new Date();
		this.currentTime = this.getFormattedTime(date);
		this.currentDate = this.getFormattedDate(date);
		this.currentWeek = this.getWeek(date);
	}

	private getWeek(date: Date) {
		const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
		const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
		return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
	}

	private getFormattedTime(date: Date) {
		return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
	}

	private getFormattedDate(date: Date) {
		return date.toLocaleDateString([], { year: 'numeric', month: '2-digit', day: '2-digit' });
	}
















	/****************************/

	// private currentTime = "07. März, 13:38";
	// private intervalId: number | undefined;

	// public created(): void {
	// 	this.updateTime();
	// 	this.intervalId = window.setInterval(() => this.updateTime(), 60000); // Speichert die ID
	// }

	// public beforeUnmount() {
	// 	if (this.intervalId) clearInterval(this.intervalId);
	// }

	// private updateTime() {
	// 	const now = new Date();
	// 	const day = now.getDate().toString().padStart(2, '0');
	// 	const monthIndex = now.getMonth(); // 0-basiert
	// 	const hours = now.getHours().toString().padStart(2, '0');
	// 	const minutes = now.getMinutes().toString().padStart(2, '0');

	// 	const monthName = this.getMonthName(monthIndex);

	// 	this.currentTime = `${day}. ${monthName} - ${hours}:${minutes}`;
	// }

	// private getMonthName(monthIndex: number): string {
	// 	const monthNames = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
	// 	return monthNames[monthIndex];
	// }
}
