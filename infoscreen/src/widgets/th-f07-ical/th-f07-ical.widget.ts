import { Options, Vue } from 'vue-class-component'
import { IWidget } from '@/interfaces/widget.interface'

import * as ical from 'ical.js';
// Interfaces
type EventAttribute = [string, object, string, string | object];

@Options({
	"name": "ThF07IcalWidget",
	components: {

	},
	props: {
		groupSize: {
			type: Number,
			default: 3,
			require: false,
		},
	}
})
export default class ThF07IcalWidget extends Vue implements IWidget {
	id = 'th-f07-ical-widget';
	enabled = true;

	private calendarData: [] = [];
	private currentIndex = 0;
	private visibleItems = 5;
	private displayedItems: any = [];

	public created(): void {
		this.fetchCalendar().then(() => {
			setInterval(this.updateDisplayedItems, 5000);
			setInterval(this.fetchCalendar, 86400);
		});
	}

	async fetchCalendar() {
		try {
			// const response = await fetch('https://ilu.th-koeln.de/calendar.php?client_id=thkilu&token=1b18c1ea1f5ab118d3a8596cc746e9ae&limited=0');
			const response = await fetch('/api/calendar.php?client_id=thkilu&token=1b18c1ea1f5ab118d3a8596cc746e9ae&limited=0');
			const text = await response.text();
			const jcalData = ical.parse(text);

			const now = new Date();

			// Filtern zukünftiger Events
			const futureEvents = jcalData[2].filter((event: any[]) => {
				const dtstartProperty = event[1].find((attr: EventAttribute) => attr[0] === "dtstart");
				if (dtstartProperty) {
					const eventStartDate = new Date(dtstartProperty[3]);
					return eventStartDate > now;
				}
				return false;
			});

			// Sortieren der Events nach dem Startdatum
			const sortedFutureEvents = futureEvents.sort((a: any[], b: any[]) => {
				const dtstartAProperty = a[1].find((attr: EventAttribute) => attr[0] === "dtstart");
				const startDateA = dtstartAProperty ? new Date(dtstartAProperty[3]).getTime() : 0;

				const dtstartBProperty = b[1].find((attr: EventAttribute) => attr[0] === "dtstart");
				const startDateB = dtstartBProperty ? new Date(dtstartBProperty[3]).getTime() : 0;

				return startDateA - startDateB;
			});

			this.calendarData = sortedFutureEvents;
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

	private extractDate(datum: string): string {
		const [datePart, _] = datum.split(',');
		const [day, month, year] = datePart.split('.').map(Number);
		const date = new Date(year, month - 1, day);

		return date.toLocaleDateString('de-DE', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit'
		});
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
				dtstart: this.extractDate(dtstart),
				dtend: this.extractDate(dtend),
				url: urlEntry ? urlEntry[3] : '',
			};
		});
	}

	public updateDisplayedItems() {
		if (this.currentIndex < this.eventsForTwoMonths().length) {
			this.displayedItems = this.eventsForTwoMonths().slice(this.currentIndex, this.currentIndex + this.visibleItems);
			this.currentIndex += this.visibleItems;
		} else {
			this.currentIndex = 0;
			this.displayedItems = this.eventsForTwoMonths().slice(this.currentIndex, this.currentIndex + this.visibleItems);
			this.currentIndex += this.visibleItems;
		}
	}
}
