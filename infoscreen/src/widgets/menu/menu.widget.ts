import { Options, Vue } from 'vue-class-component'
import { IWidget } from '@/interfaces/widget.interface'

import { ApiService } from '@/services/ApiService';

// Interfaces
interface Product {
	id: number,
	slug: string,
	name: string,
	description: string,
	price: number
	type: string,
	quantity: number
	size: number,
	active: boolean
}

@Options({
	"name": "MenuWidget",
	components: {

	}
})
export default class MenuWidget extends Vue implements IWidget {
	id = 'menu-widget';
	enabled = true;

	private products: Product[] = [];

	public created(): void {
		this.getProducts();
	}

	private async getProducts() {
		const service = new ApiService<Product>('api/nfc-products?active=1');
		await service.initialize();

		if (service.code == 200) {
			const data = service.data as Product[];
			if (data) {
				this.products = data

			}
		} else {
			console.log(service);
			console.log(service.message);
		}

	}

	get groupedProducts(): Record<string, Product[]> {
		const grouped = this.products.reduce((acc: Record<string, Product[]>, product: Product) => {
			if (!acc[product.type]) {
				acc[product.type] = [];
			}
			acc[product.type].push(product);
			return acc;
		}, {} as Record<string, Product[]>);

		return grouped;
	}

}
