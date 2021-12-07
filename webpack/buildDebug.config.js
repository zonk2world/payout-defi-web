import { CustomizeRule, mergeWithRules } from "webpack-merge";

import buildConfig from "./build.config";

const buildDebugConfig = {
    optimization: {
        minimize: false,
    },
    plugins: [],
};

module.exports = mergeWithRules({ plugins: CustomizeRule.Replace })(
    buildConfig,
    buildDebugConfig
);
