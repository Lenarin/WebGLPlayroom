const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
	entry: './src/js/main.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'app.js',
		publicPath: "/"
	},
	plugins: [
		new CopyWebpackPlugin( {
			patterns: [{ from: '**/*', to: '', context: 'src/static' }],
		}),
	],
	module: {
		rules: [
		  {
			test: /\.glsl$/i,
			use: 'raw-loader',
		  },
		],
	  },
};
