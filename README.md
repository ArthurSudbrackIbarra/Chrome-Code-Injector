# Chrome Extension Template for Code Injection

This template provides a foundation for creating Chrome extensions that facilitate the execution of your code either within the current page or in the background context.

You have the flexibility to choose between two injection methods:

1. **Content Script Injection:** This method injects your code into the current page, utilizing the content script.
2. **Background Script Injection:** This method injects your code into the background context, enabling it to run across all pages.

It's important to understand that content scripts are confined to the current page, while background scripts operate in the background, influencing all pages. Detailed explanations about these script types are available in `src/background.ts` and `src/content.ts`.

## Building and Testing Instructions

Follow these steps to construct and test your extension:

### Initial Setup

1. Begin by executing `npm run build` in the root directory. This action compiles your extension and generates an `extension-unpacked` directory at the project's root.
2. In Chrome, navigate to `chrome://extensions`.
3. Enable developer mode in the top right corner of the page.
4. Locate and click "Load unpacked" at the top left, then choose the previously generated `extension-unpacked` directory.

### Iterative Development and Reloading

Now that your extension is loaded in Chrome, any future updates can be managed effortlessly:

1. Whenever you introduce modifications, rerun `npm run build` to recompile the extension.
2. Reload your modified extension in Chrome by clicking the circular arrow icon inside the extension's box.

By following these steps, you can swiftly iterate, test, and refine your extension's functionality.

---

## Code Annotations

As you develop your extension, you can employ the following annotations within your code to modify the behavior of your extension during the build process.

### @ignore Annotation

The `@ignore` annotation is used to exclude the entire content of a script file from being considered during the extension's build process. This annotation is effective when placed at the **first line** of either the `content.ts` or `background.ts` script files.

Example usage:

```typescript
// @ignore
console.log("This entire file's code will be excluded from the extension build.");
```

### @match-url Annotation

The `@match-url` annotation is utilized to conditionally inject the `content.ts` or `background.ts` script into a webpage based on the URL of the page. This annotation supports regular expressions for specifying URL patterns.

Example usage:

```typescript
// @match-url https://google.*
console.log("This code will only be injected into the extension on pages whose URLs match the specified pattern.");
```

These annotations provide granular control over the inclusion of script files in your extension's build and how they interact with specific web pages. Incorporate these annotations thoughtfully to customize your extension's functionality.
