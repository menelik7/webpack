const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

const config = {
	entry: "./src/index.js",
	output: {
		path: path.resolve(__dirname, "build"),
		filename: "[name].bundle.js",
	},
	mode: "development",
	optimization: {
		minimize: true,
		minimizer: [
			`...`,
			new ImageMinimizerPlugin({
				minimizer: {
					implementation: ImageMinimizerPlugin.imageminMinify,
					options: {
						plugins: [
							["imagemin-mozjpeg", { quality: 40 }],
							[
								"imagemin-pngquant",
								{
									quality: [0.65, 0.9],
									speed: 4,
								},
							],
							["imagemin-gifsicle", { interlaced: true }],
							[
								"imagemin-svgo",
								{
									plugins: [
										{
											name: "preset-default",
											params: {
												overrides: {
													removeViewBox: false,
													addAttributeToSvgElement: {
														params: {
															attributes: [
																{ imlns: "https://www.w3.org/2000/svg" },
															],
														},
													},
												},
											},
										},
									],
								},
							],
						],
					},
				},
			}),
		],
	},
	module: {
		rules: [
			{
				use: "babel-loader",
				test: /\.js$/,
				exclude: /node_modules/,
			},
			{
				use: [MiniCssExtractPlugin.loader, "css-loader"],
				test: /\.css$/,
			},
			{
				test: /\.(jpe?g|png|gif|svg)$/,
				type: "asset",
				parser: {
					dataUrlCondition: {
						maxSize: 10 * 1024,
					},
				},
				generator: {
					filename: "./images/[name][ext]",
				},
			},
		],
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: "styles.css",
		}),
	],
};

module.exports = config;
