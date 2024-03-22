<template>
	<div class='border-4 w-[900px] min-full rounded-3xl flex uppercase text-[#453B34] dark:text-white shadow-2xl'>
		<div class='w-full p-4 m-10 border-4 border-solid border-[#453B34] dark:border-white'>
			<div class="flex flex-row flex-wrap justify-center gap-4 p-4">






				<div v-for="event in eventsForTwoMonths()" :key="event.uid" class="w-48 overflow-hidden">
					<div class="p-1">
						<div class="font-bold text-xl mb-2">{{ event.summary }}</div>
					</div>
					<div class="flex flex-col space-2 p-2">
						<p class="text-base">
							Start: {{ event.dtstart }}
						</p>
						<p class="text-base">
							Ende: {{ event.dtend }}
						</p>
						<p class="text-base">
							Ort: {{ event.location }}
						</p>
						<a v-if="event.url" :href="event.url" class="text-base">Mehr Infos</a>
					</div>
				</div>
			</div>

		</div>
	</div>
</template>

<script src="./calendar.section.ts"></script>
