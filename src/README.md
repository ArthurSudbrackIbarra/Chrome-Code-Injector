# Source Directory

This directory contains the source code that will be injected into Chrome.

## What to Change Here?

Here you may change the code for the content and for the background scripts that will be injected into Chrome.

- The file `content.ts` contains the code that will be injected into each page.
- The file `background.ts` contains the code that will be injected into the browser's background.

You can and should create new files and folders here, and import them in the `content.ts` and `background.ts` files.
