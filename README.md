# <img src="public/images/logo.svg" height="53" alt="Fake Filler" title="Fake Filler" />

This extension allows you to fill all form inputs (textboxes, textareas, radio buttons, dropdowns, etc.) with dummy data. It is a must for developers and testers who work with forms as it avoids the need for manually entering values in fields.

## Install

- [**Chrome** extension](https://chrome.google.com/webstore/detail/bnjjngeaknajbdcgpfkgnonkmififhfo)
- [**Edge** extension](https://microsoftedge.microsoft.com/addons/detail/bdcjobafgkjgckiikonbfcdocnhnaaii)
- [**Firefox** add-on](https://addons.mozilla.org/en-US/firefox/addon/fake-filler/)

## Default shortcut

Use **_CTRL+SHIFT+F_** on Windows and **_CMD+SHIFT+F_** on Mac to fire the extension. See the [Keyboard Shortcuts](https://github.com/FakeFiller/fake-filler-extension/wiki/Keyboard-Shortcuts) page for more details.

#### Development Dependencies

To pack this extension from the source code you will need to the backend technologies installed and accessible from the path:
 - Node.js
 - Python 2

#### Development Instructions

1. Clone the repo to your computer
2. Open the repo in VSCode or another IDE.
3. In the terminal run `npm install`
    - Ensure your terminal current directory is the same directory that has this README.
    - Fix any errors that come up.
4. From the terminal run `npm start`
    - This will automatically package any changes you make in to source to the `\dist` directory
    - If you prefer to package changes manually you can run `./node_modules/.bin/webpack --config webpack.config.dev.ts` instead.
5. Make your changes.
6. Test the generated extension by loading it as a temporary extension.