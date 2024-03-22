<template>
	<div class='widget widget-th-f07-ical'>
		<div class="widget-wrapper" style="flex-direction: column-reverse; justify-content: space-between; align-items: flex-start;">
			<header class="widget-header w-full p-4 bg-white text-black">
				<h1 class="widget-title text-6xl mb-8">
					Speisen & Getränke
				</h1>
			</header>
			<div class="widget-content w-full h-full overflow-hidden">
				<div class="menu pr-32">
					<div v-for="(products, type) in this.groupedProducts" :key="type" class="section">
						<div class="category-title hidden">{{ type }}</div>
						<div v-for="product in products" :key="product.id" :class="{'line-through' : !product.active}" class="product-item flex flex-col text-4xl -font-writers mb-3">
							<div class="flex justify-between items-center" >
								<div class='title max-w-40 font-semibold whitespace-wrap truncate'>
									{{ product.name}}
								</div>
								<div class="price text-lg">
									<span v-if="type !== 'food'" class="text-xs">{{ `${product.size} ${product.unit}` }} / </span>
									<span>{{ product.price.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }} €</span>
								</div>
							</div>
							<p class="subtitle text-base">{{ product.description }}</p>
						</div>
					</div>
				</div>
			</div>
			<footer class="widget-footer">

			</footer>
		</div>
	</div>
</template>

<script src="./menu.widget.ts"></script>
