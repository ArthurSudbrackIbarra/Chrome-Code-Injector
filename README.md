# Chrome Code Injector

A template for building Chrome extensions that allow your code to run on the background.

You can choose between two different ways to inject your code:

1. Injecting your code into the current page, using the content script.
2. Injecting your code into the background, using the background script.

The difference between the two is that the content script is only injected into the current page, while the background script is injected into the background and can be used to run code on all pages. You can find more information about the two types of scripts in `src/background.ts` and `src/content.ts`.

## How to Build and Test

Follow the steps below to build and test your extension:

### First Time Setup

1. In the root directory, run `npm run build` to build your extension.
2. In Chrome, go to `chrome://extensions`.
3. Enable developer mode in the top right corner.
4. Click "Load unpacked" in the top left corner and select the generated `build` directory in the root of your project.

### Rebuilding and Reloading

Now that your extension has already been loaded into Chrome, whenever you make new changes to it, you can simply run `npm run build` again to rebuild your extension and then reload it in Chrome by clicking the circular arrow icon.
