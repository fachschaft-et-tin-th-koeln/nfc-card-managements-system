const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
	transpileDependencies: true,
	devServer: {
		proxy: {
			'/api': {
				target: 'https://ilu.th-koeln.de',
				changeOrigin: true, // Wichtig, um sicherzustellen, dass der Host-Header der Ziel-URL entspricht
				pathRewrite: { '^/api': '' }, // Entfernt /api aus dem Pfad
				secure: false, // Wenn der Zielserver selbstsignierte Zertifikate verwendet
			},
			'/schulz': {
				target: 'http://192.168.1.15',
				changeOrigin: true, // Wichtig, um sicherzustellen, dass der Host-Header der Ziel-URL entspricht
				pathRewrite: { '^/schulz': '' }, // Entfernt /api aus dem Pfad
				secure: false, // Wenn der Zielserver selbstsignierte Zertifikate verwendet
			}
		},
	},
})
