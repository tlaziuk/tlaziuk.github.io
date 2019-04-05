import {execSync as childProcessExecSync} from "child_process";
import CircularDependencyPlugin from "circular-dependency-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { join as pathJoin, normalize as pathNormalize } from "path";
import { Configuration, EnvironmentPlugin, Loader } from "webpack";
// @ts-ignore no type defs
import SriPlugin from "webpack-subresource-integrity";
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
        crossOriginLoading: "anonymous",
        filename: "[chunkhash].js",
        path: pathNormalize(pathJoin(__dirname, "dist")),
        publicPath: "/",
    },
    plugins: [
        new CircularDependencyPlugin({
          allowAsyncCycles: false,
          cwd: __dirname,
          exclude: /node_modules/,
          failOnError: true,
        }),
        new EnvironmentPlugin({
            GIT_REV: childProcessExecSync("git rev-parse HEAD").toString().trim(),
            TIMESTAMP: Date.now(),
        }),
        new HtmlWebpackPlugin({
            chunksSortMode: "none",
            inject: false,
            template: pathNormalize(pathJoin(__dirname, "src", "index.pug")),
            title,
        }),
        new SriPlugin({
            enabled: isProduction,
            hashFuncNames: ["sha256", "sha384", "sha512"],
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
