import path from "path";

import { CleanWebpackPlugin } from "clean-webpack-plugin";
import TerserWebpackPlugin from "terser-webpack-plugin";
import webpack from "webpack";
import { merge } from "webpack-merge";

import commonConfig from "./common.config";

const buildConfig = {
    mode: "production",
    devtool: "source-map",
    entry: ["./src"],
    output: {
        path: path.resolve("./dist"),
        filename: "[name].bundle.js",
        chunkFilename: "[name].chunk.js",
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserWebpackPlugin({
                cache: true,
                parallel: true,
                sourceMap: true,
            }),
        ],
    },
    plugins: [
        new CleanWebpackPlugin(),
        // Pending Webpack v5 support
        new webpack.optimize.ModuleConcatenationPlugin(),
        new webpack.optimize.AggressiveMergingPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
    ],
};

export default merge(commonConfig, buildConfig);
