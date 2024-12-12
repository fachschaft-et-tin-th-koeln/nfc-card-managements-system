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
	name: "ChristmasLayout",
	components: {},
})
export default class ChristmasLayout extends Vue {
	private products: Product[] = [];
	public created(): void {
		this.getProducts();
	}

	private async getProducts() {
		const service = new ApiService<Product>("api/nfc-products?active=1");
		await service.initialize();

		if (service.code == 200) {
			const data = service.data as Product[];
			if (data) {
				this.products = data;
			}
		} else {
			console.log(service);
			console.log(service.message);
		}
	}

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

		console.log(grouped);
		return grouped;
	}

	get groupedFoodProducts(): Record<string, Product[]> {
		return Object.entries(this.groupedProducts)
			.filter(([type]) => type === "food") // Nur Produkte mit 'type' == 'food'
			.reduce((acc: Record<string, Product[]>, [type, products]) => {
				acc[type] = products;
				return acc;
			}, {});
	}

	get groupedDrinkProducts(): Record<string, Product[]> {
		return Object.entries(this.groupedProducts)
			.filter(([type]) => type !== "food") // Nur Produkte mit 'type' == 'food'
			.reduce((acc: Record<string, Product[]>, [type, products]) => {
				acc[type] = products;
				return acc;
			}, {});
	}

	get groupedSpecialProducts(): Record<string, Product[]> {
		return Object.entries(this.groupedProducts)
			.filter(([type]) => type === "special") // Nur Produkte mit 'type' == 'food'
			.reduce((acc: Record<string, Product[]>, [type, products]) => {
				acc[type] = products;
				return acc;
			}, {});
	}
}
