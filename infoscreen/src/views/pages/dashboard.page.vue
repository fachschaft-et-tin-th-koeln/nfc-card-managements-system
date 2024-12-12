<template>
	<div class="flex flex-grow flex-col items-start justify-start" :class="{
		'text-white': $store.getters['GET_DISPLAY_MODE'] === 'christmas',
		'text-black': $store.getters['GET_DISPLAY_MODE'] === 'party',
		'text-red': $store.getters['GET_DISPLAY_MODE'] !== 'christmas' && $store.getters['GET_DISPLAY_MODE'] !== 'party'
	}">
		<div class="content flex w-full h-full flex-grow">
			<template v-if="$store.getters['GET_DISPLAY_MODE'] == 'dashboard'">
				<dashboard-section />
			</template>
			<template v-else>
				<event-section />
			</template>
		</div>
	</div>
</template>

<script src="./dashboard.page.ts"></script>
