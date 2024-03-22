import { Options, Vue } from 'vue-class-component'

import * as ical from 'ical.js';
import { startOfWeek, endOfWeek, isWithinInterval, parseISO } from 'date-fns';

// Interfaces
type EventAttribute = [string, object, string, string | object];

// Layouts

// Sections

// Components

@Options({
	components: {

	}
})
export default class CalendarSection extends Vue {
	calendarData: [] = [];

	async mounted() {
		await this.fetchCalendar();
		// Stellen Sie den Intervall ein (z.B. alle 10 Minuten)
		// setInterval(this.fetchCalendar, 1000 * 60 * 10);
		console.log(this.eventsForTwoMonths())
	}

	async fetchCalendar() {
		try {
			// const response = await fetch('https://ilu.th-koeln.de/calendar.php?client_id=thkilu&token=1b18c1ea1f5ab118d3a8596cc746e9ae&limited=0');
			const response = await fetch('/api/calendar.php?client_id=thkilu&token=1b18c1ea1f5ab118d3a8596cc746e9ae&limited=0');
			const text = await response.text();
			const jcalData = ical.parse(text);
			// Anpassen der Datenverarbeitung an Ihre Bedürfnisse
			this.calendarData = jcalData[2]; // Hier müssten Sie die Daten entsprechend anpassen
			console.log(jcalData[2])

		} catch (error) {
			console.error('Fehler beim Abrufen des Kalenders:', error);
		}
	}

	public getCurrentAndNextMonth() {
		const now = new Date();
		const startCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
		const endNextMonth = new Date(now.getFullYear(), now.getMonth() + 2, 0); // Letzter Tag des nächsten Monats

		return { startCurrentMonth, endNextMonth };
	}

	public eventsForTwoMonths() {
		const { startCurrentMonth, endNextMonth } = this.getCurrentAndNextMonth();

		return this.calendarData.filter((event: [string, EventAttribute[], any]) => {
			const dtstartEntry = event[1].find((attr: EventAttribute) => attr[0] === "dtstart");
			if (!dtstartEntry) return false;

			const eventDateStr = typeof dtstartEntry[3] === 'string' ? dtstartEntry[3] : dtstartEntry[2]['3'];
			const eventDate = new Date(eventDateStr);

			return eventDate >= startCurrentMonth && eventDate <= endNextMonth;
		}).map((event: [string, EventAttribute[], any]) => {
			// Extrahieren der relevanten Daten für die Darstellung
			const uidEntry = event[1].find((attr: EventAttribute) => attr[0] === "uid");
			const summaryEntry = event[1].find((attr: EventAttribute) => attr[0] === "summary");
			const locationEntry = event[1].find((attr: EventAttribute) => attr[0] === "location");
			const dtstartEntry = event[1].find((attr: EventAttribute) => attr[0] === "dtstart");
			const dtendEntry = event[1].find((attr: EventAttribute) => attr[0] === "dtend");
			const urlEntry = event[1].find((attr: EventAttribute) => attr[0] === "url");

			// Formatierung des Datums, falls notwendig
			const dtstart = dtstartEntry ? new Date(dtstartEntry[3] instanceof Object ? dtstartEntry[2]['3'] : dtstartEntry[3]).toLocaleString() : '';
			const dtend = dtendEntry ? new Date(dtendEntry[3] instanceof Object ? dtendEntry[2]['3'] : dtendEntry[3]).toLocaleString() : '';

			return {
				uid: uidEntry ? uidEntry[3] : '',
				summary: summaryEntry ? summaryEntry[3] : '',
				location: locationEntry ? locationEntry[3] : '',
				dtstart: dtstart,
				dtend: dtend,
				url: urlEntry ? urlEntry[3] : '',
			};
		});
	}
}

