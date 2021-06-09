module.exports = {
	purge: [],
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {
			fontFamily: {
				nanum: ['Nanum Gothic Coding']
			}
		},
		container: {
			screens: {
				xl: '1024px'
			}
		}
	},
	variants: {
		extend: {
			opacity: ['disabled'],
			cursor: ['disabled']
		}
	},
	plugins: []
}
