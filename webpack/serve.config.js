import ReactRefreshPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import webpack from "webpack";
import { merge } from "webpack-merge";

import commonConfig from "./common.config";

const serveConfig = {
    mode: "development",
    devtool: "eval-cheap-module-source-map",
    entry: ["./src"],
    output: {
        filename: "[name].bundle.js",
    },
    devServer: {
        historyApiFallback: true,
        port: 8080,
        hot: true,
    },
    watchOptions: {
        ignored: ["node_modules"],
    },
    plugins: [new webpack.NoEmitOnErrorsPlugin(), new ReactRefreshPlugin()],
};

export default merge(commonConfig, serveConfig);
