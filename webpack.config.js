const path = require("path");
const fs = require("fs");
const CopyPlugin = require("copy-webpack-plugin");

/*
  This function is used to filter the files that should be copied to the extension's directory.
*/
function shouldCopyFile(filePath) {
  return !filePath.endsWith(".ts") && !filePath.endsWith("README.md");
}

/*
  Creating the entry object dynamically.
  This will determine which files (background.ts, content.ts) will be included in the extension.
  The files will be included if they exist and are not empty.
  The files will be excluded if they contain the // @ignore annotation in the first line.
*/
const entry = {};
const CONTENT_FILE_NAME = "content";
const CONTENT_FILE_MATCH_URLS = [];
const BACKGROUND_FILE_NAME = "background";
const WEB_ACCESSIBLE_RESOURCES = [];
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
    const lines = fileContent.split("\n");
    const firstLine = lines[0];
    if (firstLine.trim() === "// @ignore") {
      return;
    }
    /*
      Checking if the file has @match-url annotations.
      The file can have multiple @match-url annotations.
    */
    if (file === CONTENT_FILE_NAME) {
      lines.forEach((line) => {
        const matchUrl = line.trim().match(/\/\/ @match-url: (.*)/);
        if (matchUrl) {
          CONTENT_FILE_MATCH_URLS.push(matchUrl[1]);
        }
      });
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
  Adding any HTML, CSS and JS files found inside the 'src' directory
  and child directories to the web accessible resources list.
*/
const srcPath = path.resolve(__dirname, "src");
function getDirectoryFiles(directory, tailRecursionList) {
  const files = fs.readdirSync(directory, {
    withFileTypes: true,
    encoding: "utf8",
  });
  files.forEach((file) => {
    const filePath = path.resolve(directory, file.name);
    if (file.isDirectory()) {
      getDirectoryFiles(filePath, tailRecursionList);
    } else {
      if (shouldCopyFile(filePath)) {
        /*
          Get path relative to the 'src' directory.
          Replace backslashes with forward slashes.
          Remove the first slash.
        */
        const relativePath = filePath
          .replace(srcPath, "")
          .replace(/\\/g, "/")
          .slice(1);
        tailRecursionList.push(relativePath);
      }
    }
  });
}
getDirectoryFiles(srcPath, WEB_ACCESSIBLE_RESOURCES);

/*
  Modify the extension's manifest JSON file.
  This will add the 'content_scripts' key to the manifest file if the content.ts file exists and will be used.
  This will also add the 'background' key to the manifest file if the background.ts file exists and will be used.
*/
const manifest = require("./public/manifest.json");
/*
  Content script.
*/
if (entry.content) {
  manifest.content_scripts = [
    {
      matches:
        CONTENT_FILE_MATCH_URLS.length == 0
          ? ["<all_urls>"]
          : CONTENT_FILE_MATCH_URLS,
      js: [`${CONTENT_FILE_NAME}.js`],
    },
  ];
} else {
  delete manifest.content_scripts;
}
/*
  Background script.
*/
if (entry.background) {
  manifest.background = {
    service_worker: `${BACKGROUND_FILE_NAME}.js`,
  };
} else {
  delete manifest.background;
}
/*
  Web accessible resources.
*/
if (WEB_ACCESSIBLE_RESOURCES.length > 0) {
  manifest.web_accessible_resources = {
    resources: WEB_ACCESSIBLE_RESOURCES,
    matches: ["<all_urls>"],
  }
} else {
  delete manifest.web_accessible_resources;
}
/*
  Write the modified manifest file.
*/
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
      patterns: [
        { from: ".", to: ".", context: "public" },
        {
          from: ".",
          to: ".",
          context: "src",
          filter: shouldCopyFile,
        },
      ],
    }),
  ],
};
