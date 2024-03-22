<template>
	<div class='widget widget-news-feed'>
		<div class="widget-wrapper">
			<div class="widget-content overflow-hidden">
				<div class="ticker-container overflow-hidden whitespace-nowrap" ref="tickerContainer">
					<div class="ticker flex will-change-transform">
						<div class="ticker-item mr-4 after:content-['++'] after:ml-4" v-for="(item, index) in newsList" :key="index">
							<span>{{ item.title }}</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style rel="stylesheet" src="./news-feed.widget.scss" lang="scss"/>
<script src="./news-feed.widget.ts"></script>
