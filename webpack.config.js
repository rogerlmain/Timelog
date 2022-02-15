const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {

	entry: "./client/main",
	devtool: "source-map",

	output: {
		path: path.join (__dirname, "/publish"),
		publicPath: "/public/",
		filename: "main.js"
	},

	resolve: {
		extensions: [".ts", ".tsx", ".js"],
		alias: {

			client: path.resolve (__dirname, "client"),

			classes: path.resolve (__dirname, "client/classes/"),
			controls: path.resolve (__dirname, "client/controls/"),
			models: path.resolve (__dirname, "client/models/"),
			pages: path.resolve (__dirname, "client/pages/"),
			panels: path.resolve (__dirname, "client/panels/"),
			types: path.resolve (__dirname, "client/types/"),

			resources: path.resolve (__dirname, "resources/")

		}/* alias */
	},

	devServer: {
		port: 3001
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
				test: /\.(tsx)?$/,
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
							"@babel/preset-typescript",
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