const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { webpack } = require("webpack");

module.exports = {

	entry: "./client/main",
	devtool: "source-map",

	output: {
		path: path.join (__dirname, "/publish"),
		publicPath: "/public/",
		filename: "main.js"
	},

	resolve: {
		extensions: [".js", ".jsx"],
		alias: {

tests: path.resolve (__dirname, "client/tests"),

			client: path.resolve (__dirname, "client"),
			classes: path.resolve (__dirname, "client/classes"),
			controls: path.resolve (__dirname, "client/controls"),
			forms: path.resolve (__dirname, "client/forms"),
			models: path.resolve (__dirname, "client/models"),
			pages: path.resolve (__dirname, "client/pages"),
			panels: path.resolve (__dirname, "client/panels"),
			popups: path.resolve (__dirname, "client/popups"),
			tests: path.resolve (__dirname, "client/tests"),
			types: path.resolve (__dirname, "client/types"),

			resources: path.resolve (__dirname, "client/resources")

		}/* alias */
	},

	devServer: {
		port: 3000
	},

	module: {

		rules: [
			{
				test: /\.bundle\.js$/,
				use: {
					loader: "bundle-loader",
					options: {
						name: "my-chunk",
						cacheDirectory: true,
						presets: ["@babel/preset-env"]
					}// options;
				}// use;
			},
			{
				test: /\.(jsx)?$/,
				use: {
					loader: "babel-loader",
					options: {
						cacheDirectory: true,
						presets: [
							[
								"@babel/preset-env", {
									"targets": { "browsers": [">0.03%"] },
									"useBuiltIns": "entry",
									"corejs": 3
								}
							],
							"@babel/preset-react"
						]
					}/* options */,
				}// use;
			},
			{
				test: /\.css$/,
				use: ["style-loader", "css-loader"]
			},			
		]
	}/* module */,

	plugins: [
		new HtmlWebpackPlugin ({ template: "./index.html" })
	],

	performance: {
		maxEntrypointSize: 512000,
		maxAssetSize: 512000
	}

};