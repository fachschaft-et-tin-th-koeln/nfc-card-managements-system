import { Options, Vue } from 'vue-class-component'
import { IWidget } from '@/interfaces/widget.interface'

import axios from 'axios';

// Interfaces
interface NewsItem {
	title: string;
	description: string;
	link: string;
	guid: string;
	pubDate: string;
}

@Options({
	'name': 'NewsFeedWidget',
	components: {

	}
})
export default class NewsFeedWidget extends Vue implements IWidget {
	id = 'news-feed-widget';
	enabled = true;

	private newsList: NewsItem[] = [];

	public created(): void {
		this.fetchNews().then(() => {
			this.startNewsTicker();
			this.startFetch();
		});
	}

	private startFetch() {
		setInterval(() => {
			this.fetchNews();
		}, 36000);
	}

	private async fetchNews() {
		const feedUrl = 'https://www.tagesschau.de/xml/rss2/';
		try {
			const response = await axios.get(`${feedUrl}`, {
				headers: {
					'Content-Type': 'application/xml; charset=utf-8'
				}
			});
			this.parseXml(response.data);
		} catch (error) {
			// this.newsList = [{ 'title': 'Fehler beim Laden der Nachrichten', 'description': String(error), }];
			console.error('Fehler beim Laden der Nachrichten:', error);
		}
	}

	private parseXml(xmlData: string) {
		const parser = new DOMParser();
		const xmlDoc = parser.parseFromString(xmlData, "text/xml");
		const items = xmlDoc.getElementsByTagName("item");
		this.newsList = Array.from(items).map(item => {
			return {
				title: item.getElementsByTagName("title")[0].textContent || '',
				description: item.getElementsByTagName("description")[0].textContent || '',
				link: item.getElementsByTagName("link")[0].textContent || '',
				guid: item.getElementsByTagName("guid")[0].textContent || '',
				pubDate: item.getElementsByTagName("pubDate")[0].textContent || '',
			};
		});
	}

	private startNewsTicker() {
		const tickerContainer = this.$refs.tickerContainer as HTMLElement;
		if (!tickerContainer) return;
		const ticker = tickerContainer.querySelector('.ticker') as HTMLElement;
		let offset = 0;
		const move = () => {
			// Dynamische Berechnung der Verschiebung, um eine vollständige Anzeige zu gewährleisten
			offset -= 1; // Die Geschwindigkeit kann angepasst werden
			if (offset <= -this.calculateTickerWidth(ticker)) {
				offset = 0; // Zurücksetzen des Offsets, wenn das Ende erreicht ist
			}
			ticker.style.transform = `translateX(${offset}px)`;
			requestAnimationFrame(move);
		};
		requestAnimationFrame(move);
	}

	private calculateTickerWidth(ticker: HTMLElement): number {
		let totalWidth = 0;
		ticker.childNodes.forEach((node) => {
			if (node.nodeType === Node.ELEMENT_NODE) {
				const element = node as HTMLElement;
				totalWidth += element.offsetWidth + (parseInt(window.getComputedStyle(element).marginRight) || 0);
			}
		});
		return totalWidth;
	}
}
