<template>
	<div class='widget widget-clock'>
		<div class="widget-wrapper" style="align-items: flex-start;">
			<header class="widget-header w-full">
				<h1 class="text-6xl">
					<strong>Fachschaft</strong> ET/TIN
				</h1>
			</header>
			<div class="widget-content w-full h-full overflow-hidden">
				<div class="flex flex-col text-white">
					<div class="time text-9xl mb-5">
						<h1>{{ this.currentTime }}</h1>
					</div>
					<div class="date text-5xl">
						<h1>{{ this.currentDate }}, KW {{ this.currentWeek }}</h1>
					</div>
				</div>
			</div>
		</div>
		<footer class="widget-footer">

		</footer>
	</div>
</template>

<style lang="scss" scoped>
	.widget-header {
		@apply bg-transparent;
	}
</style>
<script src="./clock.widget.ts"></script>
