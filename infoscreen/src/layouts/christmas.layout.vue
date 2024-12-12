<template>
	<div class="h-[1080px] w-[1920px] bg-christmas text-white">

		<div class="flex flex-row h-full py-12 px-52 space-x-40">
			<div class="w-1/2 h-full border">

			</div>
			<div class="w-1/2">
				<div class="grid grid-cols-12 grid-rows-12 w-full h-full">


					<div class="grid-item col-start-1 col-end-7 row-start-4 row-end-7">
						<div class="flex flex-col px-10">
							<h1 class="text-center text-6xl font-cute pt-0 pb-3">Speißen</h1>
							<div class="flex flex-col">
								<div v-for="(products, type) in this.groupedFoodProducts" :key="type"
									class="section w-full">
									<div v-for="product in products" :key="product.id"
										:class="{ 'line-through': !product.active }"
										class="product-item flex flex-col text-xl leading-none">
										<div class="flex justify-between">
											<div class='title font-semibold whitespace-wrap truncate'>
												{{ product.name }}
											</div>
											<div class="price flex flex-row text-xs">
												<span v-if="type !== 'food'" class="text-left">{{ `${product.size}
													${product.unit}` }} / </span>
												<span class="text-right">{{ product.price.toLocaleString('de-DE', {
													minimumFractionDigits: 2,
													maximumFractionDigits: 2
												}) }} €</span>
											</div>
										</div>
										<p class="subtitle text-xs" v-html="product.description"></p>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="grid-item col-start-1 col-end-7 row-start-7 row-end-10">
						<div class="flex flex-col px-8">
							<h1 class="text-center text-4xl font-cute pt-16 pb-4">Drinks</h1>
							<div class="flex flex-col">
								<div v-for="(products, type) in this.groupedDrinkProducts" :key="type"
									class="section w-full">
									<div v-for="product in products" :key="product.id"
										:class="{ 'line-through': !product.active }"
										class="product-item flex flex-col text-xl leading-none">
										<div class="flex justify-between">
											<div class='title font-semibold whitespace-wrap truncate'>
												{{ product.name }}
											</div>
											<div class="price flex flex-row text-xs">
												<span v-if="type !== 'food'" class="text-left">{{ `${product.size}
													${product.unit}` }} / </span>
												<span class="text-right">{{ product.price.toLocaleString('de-DE', {
													minimumFractionDigits: 2,
													maximumFractionDigits: 2
												}) }} €</span>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="grid-item col-start-1 col-end-7 row-start-10 row-end-13">
						<div class="flex flex-col px-8">
							<h1 class="text-center text-5xl font-cute pt-0 pb-4">Specials</h1>
							<div class="flex flex-col">
								<div v-for="(products, type) in this.groupedSpecialProducts" :key="type"
									class="section w-full">
									<div v-for="product in products" :key="product.id"
										:class="{ 'line-through': !product.active }"
										class="product-item flex flex-col text-xl leading-none">
										<div class="flex justify-between">
											<div class='title font-semibold whitespace-wrap truncate'>
												{{ product.name }}
											</div>
											<div class="price flex flex-row text-xs">
												<span v-if="type !== 'food'" class="text-left">{{ `${product.size}
													${product.unit}` }} / </span>
												<span class="text-right">{{ product.price.toLocaleString('de-DE', {
													minimumFractionDigits: 2,
													maximumFractionDigits: 2
												}) }} €</span>
											</div>
										</div>
										<p class="subtitle text-xs" v-html="product.description"></p>
									</div>
								</div>
							</div>
						</div>
					</div>

				</div>
			</div>
		</div>
	</div>
</template>

<script src="./christmas.layout.ts"></script>
