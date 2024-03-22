<template>
	<div class="grid grid-cols-12 grid-rows-12 w-screen gap-4">
		<div class="grid-item col-start-1 col-end-5 row-start-1 row-span-5 h-[900px]">
			<fsr-information />
		</div>
		<div class="grid-item col-start-5 col-end-9 row-start-1 row-span-5 h-[900px]">
			<menu-widget />
		</div>
		<div class="grid-item col-start-9 col-end-13 row-start-1 row-span-3 h-[450px]">
			<clock-widget class="p-8"/>
		</div>
		<div class="grid-item col-start-9 col-end-13 row-start-4 row-span-2 h-[433px] hidden">
			<t-h-f07-ical-widget />
		</div>
		<div class="grid-item col-start-1 col-end-13 row-start-12 row-span-7 h-[180px]">
			<news-feed-widget />
		</div>
	</div>
</template>

<script src="./dashboard.section.ts"></script>
