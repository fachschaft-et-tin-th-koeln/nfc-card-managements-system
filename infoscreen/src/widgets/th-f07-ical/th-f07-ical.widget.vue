<template>
	<div class='widget widget-th-f07-ical'>
		<div class="widget-wrapper" style="flex-direction: column-reverse; justify-content: space-between; align-items: flex-start;">
			<header class="widget-header hidden w-full p-4 bg-white text-black">
				<h1 class="widget-title text-6xl mb-8">
					Fakultätskalender
				</h1>
			</header>
			<div class="widget-content w-full h-full overflow-hidden">
				<div v-for="event in displayedItems" :key="event.uid">
					<div class="ical-item mb-3">
						<span class="sender block font-semibold text-2xl truncate">{{ event.summary}}</span>
						<div class="date flex justify-start text-base">
							<span class="uppercase">{{ event.dtstart }}</span>
							<template v-if="event.dtstart !== event.dtend">
								<span v-if="event.dtend" class="mx-5">bis</span>
								<span class="timestamp uppercase">{{ event.dtend }}</span>
							</template>
						</div>
						<span v-if="event.location" class="more block mt-0.5 text-xs opacity-75">
							{{ event.location }}
						</span>
					</div>
				</div>
			</div>
			<footer class="widget-footer">

			</footer>
		</div>
	</div>
</template>

<style rel="stylesheet" src="./th-f07-ical.widget.scss" lang="scss" scoped/>
<script src="./th-f07-ical.widget.ts"></script>
