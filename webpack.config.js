const path = require("path");
module.exports = {
  entry: { demo2d: "./src/demo2d.ts", demo3d: "./src/demo3d.ts" },
  devtool: "inline-source-map",
  devServer: {
    contentBase: "./build",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "[name].js",
    library: "CrowdSimulator",
    path: path.resolve(__dirname, "build"),
  },
};
