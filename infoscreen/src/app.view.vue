<template>
	<div class="h-full w-full flex flex-grow old-p-10 relative" :class="displayMode">
		<!-- Hauptinhalt -->
		<template v-if="displayMode === 'dashboard'">
			<VueLayout />
		</template>
		<template v-if="displayMode === 'christmas'">
			<ChristmasLayout />
		</template>
		<template v-else>
			<VueLayout />
		</template>
	</div>
</template>

<script src="./app.view.ts"></script>
