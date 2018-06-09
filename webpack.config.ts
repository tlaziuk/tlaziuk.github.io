import HtmlWebpackPlugin from "html-webpack-plugin";
import { join as pathJoin, normalize as pathNormalize } from "path";
import { Configuration, Loader } from "webpack";
// @ts-ignore json
import { name as title } from "./package.json";

const isProduction = process.env.NODE_ENV === "production";

const LoaderTypeScript: Loader = {
    loader: "ts-loader",
    options: {
        appendTsSuffixTo: [
            /\.m[jt]s$/i,
        ],
        appendTsxSuffixTo: [
            /\.[jt]sx$/i,
        ],
        compilerOptions: {
            module: "esnext",
            sourceMap: !isProduction,
            target: "es5",
        },
        transpileOnly: true,
    },
};

const LoaderPug: Loader = {
    loader: "pug-loader",
};

module.exports = {
    devServer: {
        compress: true,
        contentBase: pathNormalize(pathJoin(__dirname, "dist")),
    },
    devtool: isProduction ? false : "source-map",
    entry: [
        pathNormalize(pathJoin(__dirname, "src")),
    ],
    mode: isProduction ? "production" : "development",
    module: {
        rules: [
            {
                exclude: /node_modules/i,
                test: /\.m?[jt]sx?$/i,
                use: [
                    LoaderTypeScript,
                ],
            },
            {
                test: /\.pug$/i,
                use: [
                    LoaderPug,
                ],
            },
        ],
    },
    output: {
        chunkFilename: "[chunkhash].js",
        filename: "[chunkhash].js",
        path: pathNormalize(pathJoin(__dirname, "dist")),
        publicPath: "/",
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: pathNormalize(pathJoin(__dirname, "src", "index.pug")),
            title,
        }),
    ],
    resolve: {
        extensions: [
            ".ts",
            ".tsx",
            ".js",
            ".jsx",
        ],
    },
    target: "web",
} as Configuration;
