<template>
	<div class='header-container flex w-full h-full space-x-4'>
		<div class="header-item w-2/5">
			<div class="header-item-subtitle">
				<organizer-name />
			</div>
			<div class="header-item-title">
				<event-title />
			</div>
		</div>
		<div class="header-item w-3/5">
			<div class="header-item-subtitle justify-between">
				<span>Öffnungszeiten</span>
				<opening-time />
			</div>
			<div class="header-item-title">
				<event-title />
			</div>
		</div>

		<div class="hidden">
		<div class='title-container flex w-2/5h-full items-center justify-start flex-col border-r-4 border-[#453B34] dark:border-white wpr-4'>
			<div class='name flex w-full justify-center items-center h-[62px] text-[38px] wpb-[7.5px]'>
				Fachschaft ET/TIN
			</div>
			<organizer-name />
			<event-title />
		</div>
		<div class='feature-container w-3/5'>
			<div
				class='open-hour-container flex items-center border-b-4 border-[#453B34] dark:border-white ml-4'>
				<div class='title mr-auto text-[38px]'>opening</div>

				<div class="times flex flex-col">
					<template v-for="(group, index) in groupedOpeningHours" :key="index">
						<div class="flex flex-row justify-between">
							<span class='detail ml-8'>{{ group.days }}</span>
							<span class='detail ml-8'>{{ group.times }}</span>
						</div>
					</template>
				</div>

			</div>
			<div class='deal-container flex'>
				<div class='deals flex flex-col mr-auto ml-4'>
					<div class='deal text-[38px]'>
						<div class='title text-[53.2px]'>free fish friday</div>
						<div class='subtitle text-xl tracking-[-0.5px] opacity-75'>free 1/2 lb haddlock with
							every order of
							chips
						</div>
					</div>
					<div class=' deal text-[38px]'>
						<div class='title text-[53.2px]'>1/2 price monday</div>
						<div class='subtitle text-xl tracking-[-0.5px] opacity-75'>all food 1/2 price</div>
					</div>
					<div class='deal text-[38px]'>new deals monthly</div>
				</div>
				<div class='vertical-text mt-4 bg-[#453B34] dark:bg-white '>
					<div
						class='text w-full h-full text-[70.4px] dark:text-gray-800 text-white leading-[115%] pt-[7.5px]'>
						DEALS</div>
				</div>
			</div>
		</div>
		</div>
	</div>
</template>

<style  src="./menu-header.component.scss" lang="scss" />
<script src="./menu-header.component.ts"></script>
