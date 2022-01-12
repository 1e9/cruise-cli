# `@cruise-cli/esm-get-path`

> TODO: description

## Usage

```js
const getPath = require('@cruise-cli/esm-get-path');

// import.meta.url: /root/b/foo.js
getPath(import.meta.url) 
// return '/root/b/foo.js'

getPath(import.meta.url, '..');
// '/root/b'

getPath(import.meta.url, '../package.json'); 
// '/root/b/package.json'
```
