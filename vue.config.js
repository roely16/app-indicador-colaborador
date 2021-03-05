module.exports = {
	transpileDependencies: [
		'vuetify'
	],
	devServer: {
		host: 'localhost'
	},
	publicPath: process.env.NODE_ENV === 'production' ? '/apps/app-indicador-colaborador/' : '/',
	pwa: {
		workboxOptions: {
		skipWaiting: true
		}
	},
}
