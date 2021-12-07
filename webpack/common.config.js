import fs from "fs";
import { resolve } from "path";

import DotenvPlugin from "dotenv-webpack";
import GitRevisionPlugin from "git-revision-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import webpack from "webpack";

const gitRevisionPlugin = new GitRevisionPlugin({
    branch: true,
    versionCommand: "describe --tags --abbrev=0",
});

const nodeEnv = process.env.NODE_ENV;
const envConfigPath = fs.existsSync(`./.env.${nodeEnv}`)
    ? `./.env.${nodeEnv}`
    : "./.env";

const buildTime = new Date().toISOString();

export default {
    resolve: {
        extensions: [".js", ".jsx", ".ts", ".tsx", ".css"],
        symlinks: false,
        fallback: {
            buffer: require.resolve("buffer/"),
            os: false,
            https: false,
            http: false,
            crypto: false,
            util: false,
            stream: false,
            assert: false,
        },
    },
    module: {
        rules: [
            {
                test: /(\.ts|\.tsx)$/,
                exclude: /node_modules/,
                use: ["babel-loader"],
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env", "@babel/preset-react"],
                        plugins: ["@babel/plugin-proposal-class-properties"],
                    },
                },
            },
            {
                test: /\.(css|scss)$/,
                use: [
                    "style-loader",
                    {
                        loader: "css-loader",
                        options: {
                            importLoaders: 1,
                            modules: {
                                localIdentName:
                                    "[name]__[local]___[hash:base64:5]",
                            },
                        },
                    },
                ],
                include: /\.module\.css$/,
            },
            {
                test: /\.(css|scss)$/,
                use: ["style-loader", "css-loader"],
                exclude: /\.module\.css$/,
            },
            {
                test: /\.(jpg|png)$/,
                use: {
                    loader: "url-loader",
                },
            },
            {
                test: /\.svg$/i,
                use: {
                    loader: "url-loader",
                    options: {
                        encoding: false,
                    },
                },
            },
            {
                test: /\.svg$/,
                use: [
                    {
                        loader: "babel-loader",
                    },
                    {
                        loader: "react-svg-loader",
                        options: {
                            jsx: true, // true outputs JSX tags
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        new DotenvPlugin({
            path: envConfigPath,
            safe: false,
            systemvars: true,
        }),
        new webpack.ProvidePlugin({
            Buffer: ["buffer", "Buffer"],
        }),
        // gitRevisionPlugin,
        new webpack.DefinePlugin({
            // __BUILD_VERSION: JSON.stringify(gitRevisionPlugin.version()),
            // __BUILD_COMMIT: JSON.stringify(gitRevisionPlugin.commithash()),
            // __BUILD_BRANCH: JSON.stringify(gitRevisionPlugin.branch()),
            __BUILD_DATE: JSON.stringify(buildTime),
        }),
        new HtmlWebpackPlugin({
            inject: "body",
            template: resolve("public/index.ejs"),
            templateParameters: {
                // buildBranch: gitRevisionPlugin.branch(),
                buildDate: buildTime,
                // buildSha: gitRevisionPlugin.commithash().substring(0, 7),
                // buildVersion: gitRevisionPlugin.version(),
                title: "Populous Defi",
            },
        }),
    ],
};
