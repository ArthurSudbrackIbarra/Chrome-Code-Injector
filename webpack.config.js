const path = require("path");
const fs = require("fs");
const CopyPlugin = require("copy-webpack-plugin");

/*
  Creating the entry object dynamically.
  This will determine which files (background.ts, content.ts) will be included in the extension.
  The files will be included if they exist and are not empty.
  The files will be excluded if they contain the // @ignore annotation in the first line.
*/
const entry = {};
const CONTENT_FILE_NAME = "content";
const BACKGROUND_FILE_NAME = "background";
const files = [CONTENT_FILE_NAME, BACKGROUND_FILE_NAME];
files.forEach((file) => {
  const filePath = path.resolve(__dirname, "src", `${file}.ts`);
  try {
    /*
      Checking if the file exists.
    */
    if (!fs.existsSync(filePath)) {
      return;
    }
    const fileContent = fs.readFileSync(filePath, "utf8");
    /*
      Checking if the file is empty.
    */
    if (fileContent.trim().length === 0) {
      return;
    }
    /*
      Checking if the file contains the // @ignore annotation.
    */
    const firstLine = fileContent.split("\n")[0];
    if (firstLine.trim() === "// @ignore") {
      return;
    }
    /*
      If all the checks are passed, then add the file to the entry.
    */
    entry[file] = filePath;
  } catch (error) {
    console.error(error);
  }
});

/*
  Modify the extension's manifest JSON file.
  This will add the 'content_scripts' key to the manifest file if the content.ts file exists and will be used.
  This will also add the 'background' key to the manifest file if the background.ts file exists and will be used.
*/
const manifest = require("./public/manifest.json");
if (entry.content) {
  manifest.content_scripts = [
    {
      matches: ["<all_urls>"],
      js: [`${CONTENT_FILE_NAME}.js`],
    },
  ];
} else {
  delete manifest.content_scripts;
}
if (entry.background) {
  manifest.background = {
    service_worker: `${BACKGROUND_FILE_NAME}.js`,
  };
} else {
  delete manifest.background;
}
try {
  fs.writeFileSync(
    path.resolve(__dirname, "public", "manifest.json"),
    JSON.stringify(manifest, null, 2)
  );
  console.log("[OK] Manifest file was modified.");
} catch (error) {
  console.error(error);
}

/*
  Exporting the webpack configuration.
*/
module.exports = {
  mode: "production",
  entry: entry,
  output: {
    path: path.join(__dirname, "extension-unpacked"),
    filename: "[name].js",
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: ".", to: ".", context: "public" }],
    }),
  ],
};
