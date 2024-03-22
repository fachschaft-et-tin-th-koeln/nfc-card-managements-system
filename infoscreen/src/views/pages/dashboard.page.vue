<template>
	<div class="flex flex-grow flex-col items-start justify-start text-gray-800 dark:text-white">
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
