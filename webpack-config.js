const path = require ("path");
const { jar } = require("request");

const root = __dirname;
const root_pathed = (file_path) => { return path.resolve (root, file_path) }

module.exports = {
	devtool: "source-map",
	mode: "development",
	watch: true,

	entry: {
		"main": "./src/main.tsx"
	},

	output: {
		filename: "main.js"
	},

	resolve: {
		extensions: [".Webpack.js", ".web.js", ".ts", ".js", ".jsx", ".tsx"],
		modules: [ root, root_pathed ("src"), "node_modules" ],
		symlinks: false
	},

	module: {
		rules: [
			{
				test: /\.js$|tsx/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: "ts-loader"
				}
			}
		]
	}
}