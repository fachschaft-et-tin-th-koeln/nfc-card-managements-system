<template>
	<div class="h-[1080px] w-[1920px] bg-party bg-contain font-trailmade">

		<div class="flex flex-row w-[full] h-full p-4 ---space-x-5">
			<!-- left -->
			<div class="relative w-[730px] h-full  mr-4">

				<!-- Überschrift-Bereich oben: Semester Opening '25 + Fachschaften -->
				<div class="headline absolute left-[19.5rem] pt-8">

					<div class="absolute h-[35px] w-[375px] top-[1rem] left-[-6.8rem]">
						<img :src="require(`@/assets/party-line-1.png`)" alt="party-line-1" class="w-full h-full" />
					</div>
					<div class="absolute h-[20px] w-[380px] top-[5.3rem] left-[1.2rem]">
						<img :src="require(`@/assets/party-line-2.png`)" alt="party-line-1" class="w-full h-full" />
					</div>

					<div class="absolute h-[10px] w-[380px] top-[9.7rem] left-[-2.2rem]">
						<img :src="require(`@/assets/party-line-3.png`)" alt="party-line-1" class="w-full h-full" />
					</div>

					<div class="relative inline-block text-center tracking-[.15em]">
						<h1 class="text-[48px] text-black">
							<!-- Pinke Linie hinter dem Text -->
							Semester Opening '25
						</h1>
						<h2 class="text-[48px] text-black mt-2">
							Fachschaften ETIN &amp; IMP
						</h2>

					</div>
				</div>
				<div v-if="showPopup"
					class="spezial-offer absolute top-[240px] left-[195px] h-[460px] w-[530px] animate-zoomInOut">
					<div class="absolute h-[112px] w-[112px] top-[0rem] left-[0rem]">
						<img :src="require('@/assets/party-corner-top-left.png')" alt="party-line-1"
							class="w-full h-full" />
					</div>
					<div class="absolute h-[112px] w-[112px] bottom-[0rem] right-[0rem]">
						<img :src="require('@/assets/party-corner-bottom-right.png')" alt="party-line-2"
							class="w-full h-full" />
					</div>

					<div class="spezial-content h-full mx-12 my-6 transform rotate-[-3deg]">
						<div class="fixed inset-0 flex items-center justify-center z-50">
							<!-- Inneres Container-Element mit (beliebig) Hintergrund oder nur Text -->
							<div
								class="relative flex flex-col justify-center items-center p-8 rounded-lg text-6xl w-full h-full">
								<h1 class="font-bold text-center neon-text">Specials!</h1>

								<div class="!text-6xl section w-full max-w-5xl">
									<template v-for="(products, type) in this.groupedSpecialProducts" :key="type">
										<div v-for="product in products" :key="product.id"
											:class="{ 'line-through': !product.active }"
											class="product-item flex flex-col justify-between text-4xl leading-none">
											<div class="flex justify-between">
												<div class="title font-semibold whitespace-wrap truncate">{{
													product.name }}-Mate
												</div>
												<div class="price flex flex-row">
													<span class="text-left">{{
														`${product.size}
														${product.unit}` }} / </span>
													<span class="text-right">{{
														product.price.toLocaleString('de-DE', {
															minimumFractionDigits: 2,
															maximumFractionDigits: 2
														}) }} €</span>
												</div>
											</div>
										</div>
									</template>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<!-- right -->
			<div class="relative w-[calc(100%-730px)] h-full ">
				<div class="grid grid-cols-12 grid-rows-12 w-full h-full">
					<!-- Diese Zelle nimmt alle Spalten/Zeilen ein -->
					<div class="relative col-span-12 row-span-12 p-10">
						<!-- Obere Ecke (Top-Left) -->
						<div class="absolute top-0 right-0 h-[112px] w-[112px]">
							<img :src="require('@/assets/party-corner-top-left.png')" alt="party-line-1"
								class="w-full h-full transform rotate-[96deg]" />
						</div>
						<!-- Untere Ecke (Bottom-Right) -->
						<div class="absolute bottom-0 left-0 h-[112px] w-[112px]">
							<img :src="require('@/assets/party-corner-bottom-right.png')" alt="party-line-2"
								class="w-full h-full transform rotate-[96deg]" />
						</div>
						<!-- Spezial-Content, füllt den gesamten Bereich aus -->
						<div
							class="spezial-content flex w-[calc(100%-50px)] h-[calc(100%+50px)]  transform rotate-[3deg] mt-[-25px] ml-[25px]">
							<!-- Dein Inhalt hier -->
							<div class="grid grid-cols-12 grid-rows-12 w-full h-full">
								<div class="grid-item col-start-1 col-end-8 row-start-1 row-end-7">
									<div class="flex flex-col px-8">
										<h1 class="text-center text-5xl pt-16 pb-4">Drinks</h1>
										<div class="flex flex-col">
											<div v-for="(products, type) in this.groupedDrinkProducts" :key="type"
												class="section w-full">
												<div v-for="product in products" :key="product.id"
													:class="{ 'line-through': !product.active }"
													class="product-item flex flex-col text-2xl leading-none">
													<div class="flex justify-between">
														<div class='title font-semibold whitespace-wrap truncate'>
															{{ product.name }}
														</div>
														<div class="price flex flex-row">
															<span v-if="type !== 'food'" class="text-left">{{
																`${product.size}
																${product.unit}` }} / </span>
															<span class="text-right">{{
																product.price.toLocaleString('de-DE', {
																	minimumFractionDigits: 2,
																	maximumFractionDigits: 2
																}) }} €</span>
														</div>
													</div>
													<div class="subtitle">
														<p class="subtitle text-xl" v-html="product.description">
														</p>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>

								<!-- Specials -->
								<div
									class="grid-item col-start-6 col-end-10 row-start-7 row-end-10 transform rotate-[-5deg]">
									<div class="absolute top-[30px] left-[-35px] h-[163px] w-[391px] z-[-99]">
										<img :src="require('@/assets/party-circle-1.png')" alt="party-line-1"
											class="w-full h-full"
											style="filter: brightness(80%) saturate(200%) hue-rotate(-80deg);" />
									</div>
									<div class="flex flex-col px-8">
										<h1 class="text-center text-5xl pt-0 pb-4">Specials</h1>
										<div class="flex flex-col">
											<div v-for="(products, type) in this.groupedSpecialProducts" :key="type"
												class="section w-full">
												<div v-for="product in products" :key="product.id"
													:class="{ 'line-through': !product.active }"
													class="product-item flex flex-col text-2xl leading-none">
													<div class="flex justify-between">
														<div class='title font-semibold whitespace-wrap truncate'>
															{{ product.name }}
														</div>
														<div class="price flex flex-row">
															<span v-if="type !== 'food'" class="text-left">{{
																`${product.size}
																${product.unit}` }} / </span>
															<span class="text-right">{{
																product.price.toLocaleString('de-DE', {
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
								<!-- Shots -->
								<div
									class="grid-item col-start-1 col-end-4 row-start-8 row-end-8 transform rotate-[-3deg]">
									<div class="flex flex-col px-8">
										<h1 class="text-center text-5xl pt-0 pb-4">Shots</h1>
										<div class="flex flex-col">
											<div v-for="(products, type) in this.groupedShotsProducts" :key="type"
												class="section w-full">
												<div v-for="product in products" :key="product.id"
													:class="{ 'line-through': !product.active }"
													class="product-item flex flex-col text-2xl leading-none">
													<div class="flex justify-between">
														<div class='title font-semibold whitespace-wrap truncate'>
															{{ product.name }}
														</div>
														<div class="price flex flex-row">
															<span v-if="type !== 'food'" class="text-left">{{
																`${product.size}
																${product.unit}` }} / </span>
															<span class="text-right">{{
																product.price.toLocaleString('de-DE', {
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
								<!-- Food -->
								<div
									class="grid-item col-start-6 col-end-12 row-start-11 row-end-10 transform rotate-[6deg]">
									<div class="absolute top-[50px] left-[145px] h-[10px] w-[191px] z-[-99]">

										<img :src="require('@/assets/party-line-4.png')" alt="party-line-1"
											class="w-full h-full"
											style="filter: brightness(80%) saturate(200%) hue-rotate(-80deg);" />
									</div>
									<div class="flex flex-col px-10">
										<h1 class="text-center text-6xl pt-0 pb-3">Speisen</h1>
										<div class="flex flex-col">
											<div v-for="(products, type) in this.groupedFoodProducts" :key="type"
												class="section w-full">
												<div v-for="product in products" :key="product.id"
													:class="{ 'line-through': !product.active }"
													class="product-item flex flex-col text-2xl leading-none">
													<div class="flex justify-between">
														<div class='title font-semibold whitespace-wrap truncate'>
															{{ product.name }}
														</div>
														<div class="price flex flex-row text-xl">
															<span v-if="type !== 'food'" class="text-left">{{
																`${product.size}
																${product.unit}` }} / </span>
															<span class="text-right">{{
																product.price.toLocaleString('de-DE', {
																	minimumFractionDigits: 2,
																	maximumFractionDigits: 2
																}) }} €</span>
														</div>
													</div>
													<p class="subtitle text-xl" v-html="product.description"></p>
												</div>
											</div>
										</div>
									</div>
								</div>
								<!-- Pfand -->
								<div
									class="grid-item col-start-9 col-end-13 row-start-3 row-end-12 transform rotate-[-12deg]">
									<div class="absolute top-[-30px] left-[-15px] h-[163px] w-[391px] z-[-99]">
										<img :src="require('@/assets/party-circle-1.png')" alt="party-line-1"
											class="w-full h-full"
											style="filter: brightness(49%) saturate(180%) hue-rotate(-120deg); transform: rotate(12deg);" />
									</div>
									<div class="flex flex-col px-10">
										<h1 class="text-center text-[64px] pt-0 pb-3">Pfand: 1,00€</h1>
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

<script src="./party.layout.ts"></script>

<style scoped>
/* Beispielhafter Neon-Effekt für Überschrift */
.neon-text {
	color: #ff00ff;
	text-shadow:
		0 0 5px #ff00ff,
		0 0 0px #ff00ff,
		0 0 0px #ff00ff,
		0 0 40px #ff00ff;
	/* 0 0 5px #ff00ff,
		0 0 10px #ff00ff,
		0 0 20px #ff00ff,
		0 0 40px #ff00ff;*/
}

/* Eigene Keyframe-Animation für kontinuierliches leichtes Zoomen */
@keyframes zoomInOut {

	0%,
	100% {
		transform: scale(1);
	}

	50% {
		transform: scale(1.08);
	}
}

/* Klasse für die Zoom-Animation (ersetzt "animate-pulse") */
.animate-zoomInOut {
	animation: zoomInOut 1.5s ease-in-out infinite;
}
</style>
