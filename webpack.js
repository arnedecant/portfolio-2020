// --------------------------------------------------------------
// :: WEBPACK CONFIGURATION
// --------------------------------------------------------------

const config = require('./build-config.json')
const path = require('path')


// --------------------------------------------------------------
// :: PLUGINS
// --------------------------------------------------------------
// - https://www.npmjs.com/package/uglifyjs-webpack-plugin

const uglify = require('uglifyjs-webpack-plugin')

let plugins = []

if(config.production){

	plugins.push(new uglify({
		parallel: true,
		cache: true
	}))

}


// --------------------------------------------------------------
// :: SET BUILD PARAMS
// --------------------------------------------------------------
// Get build target-ID from our build-config.json
// NOTE: file-naming schemes must match our build-target-ID
// NOTE: id: 'web' implies that js/web.js and sass/web.scss exist

let targets = {}

config.targets.forEach((target) => {
	targets[target['id']] = './src/js/'+target['src-js']
})


// --------------------------------------------------------------
// :: MODULE EXPORTS
// --------------------------------------------------------------
// - https://www.npmjs.com/package/babel-loader

module.exports = {

	entry: targets,
	plugins: plugins,

	// Where to ouput the bundled js
	// [name] will be replaced by the target['id']

	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, 'public')
	},

	// Target .js-files but ignore
	// anything inside node modules

	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader?cacheDirectory=true',
					options: {
						presets: ['env']
					}
				}
			}
		]
	}
}
