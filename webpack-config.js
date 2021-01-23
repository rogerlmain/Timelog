const path = require ("path");

const root_path = path.join (__dirname, "/");


function root_pathed (file_path) {
	return path.join (root_path, file_path);
}// root_pathed;


module.exports = {
    devtool: 'source-map',
	mode: "development",

	entry: {
		"main": "./main.tsx"
	},

    output: {
        filename: "[name].js"
	},

    resolve: {
        extensions: ['.Webpack.js', '.web.js', '.ts', '.js', '.jsx', '.tsx'],
        alias: {
			root: root_path,
			components: root_pathed ("components")
        },
		symlinks: false
	},

    module: {
        rules: [
            {
                test: /\.js$|tsx/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'ts-loader'
                }
            }
        ]
    }
}