import { Options, Vue } from "vue-class-component";

// Services
import { ApiService } from "@/services/ApiService";

// Interfaces
interface Product {
	id: number;
	slug: string;
	name: string;
	description: string;
	price: number;
	type: string;
	quantity: number;
	size: number;
	active: boolean;
}

// Layouts

// Components

@Options({
	name: "PartyLayout",
	components: {},
})
export default class PartyLayout extends Vue {
	/* ----------------------------------------------------- */
	/*   EIGENSCHAFTEN                                       */
	/* ----------------------------------------------------- */

	// Produkte-Array
	private products: Product[] = [];

	// Steuert Sichtbarkeit des Pop-ups
	// => Keine explizite Typangabe, damit kein Linter-Fehler entsteht
	public isPopupVisible = false;

	// Timer-Referenz für das Intervall
	private popupInterval: number | undefined;

	/* ----------------------------------------------------- */
	/*   LIFECYCLE-HOOKS                                     */
	/* ----------------------------------------------------- */

	public created(): void {
		// Nur einmal Products laden
		this.getProducts();
	}

	public mounted(): void {
		// Pop-up nach 5 Sekunden das erste Mal
		setTimeout(() => {
			this.showPopup();
		}, 5000);
		// Danach alle 60 Sekunden
		this.popupInterval = window.setInterval(() => {
			this.showPopup();
		}, 60000);
	}

	public beforeUnmount(): void {
		// Timer aufräumen
		if (this.popupInterval) {
			clearInterval(this.popupInterval);
		}
	}

	/* ----------------------------------------------------- */
	/*   METHODEN                                            */
	/* ----------------------------------------------------- */

	private async getProducts() {
		const service = new ApiService<Product>("api/nfc-products?active=1");
		await service.initialize();

		if (service.code === 200) {
			const data = service.data as Product[];
			if (data) {
				this.products = data;
			}
		} else {
			console.log(service);
			console.log(service.message);
		}
	}

	private showPopup(): void {
		this.isPopupVisible = true;
		// nach 15 Sekunden automatisch ausblenden
		setTimeout(() => {
			this.isPopupVisible = false;
		}, 15000);
	}

	/* ----------------------------------------------------- */
	/*   GETTER                                              */
	/* ----------------------------------------------------- */

	get groupedProducts(): Record<string, Product[]> {
		const grouped = this.products.reduce(
			(acc: Record<string, Product[]>, product: Product) => {
				if (!acc[product.type]) {
					acc[product.type] = [];
				}
				acc[product.type].push(product);
				return acc;
			},
			{} as Record<string, Product[]>
		);

		return grouped;
	}

	get groupedFoodProducts(): Record<string, Product[]> {
		return Object.entries(this.groupedProducts)
			.filter(([type]) => type === "food")
			.reduce((acc: Record<string, Product[]>, [type, products]) => {
				acc[type] = products;
				return acc;
			}, {});
	}

	get groupedDrinkProducts(): Record<string, Product[]> {
		return Object.entries(this.groupedProducts)
			.filter(
				([type]) =>
					type !== "food" && type !== "shots" && type !== "special"
			)
			.reduce((acc: Record<string, Product[]>, [type, products]) => {
				acc[type] = products;
				return acc;
			}, {});
	}

	get groupedShotsProducts(): Record<string, Product[]> {
		return Object.entries(this.groupedProducts)
			.filter(([type]) => type === "shots")
			.reduce((acc: Record<string, Product[]>, [type, products]) => {
				acc[type] = products;
				return acc;
			}, {});
	}

	get groupedSpecialProducts(): Record<string, Product[]> {
		return Object.entries(this.groupedProducts)
			.filter(([type]) => type === "special")
			.reduce((acc: Record<string, Product[]>, [type, products]) => {
				acc[type] = products;
				return acc;
			}, {});
	}
}
