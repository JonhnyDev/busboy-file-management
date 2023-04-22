# BUSBOY-FILE-MANAGEMENT

Busboy File Management is a library for managing files on the server using Busboy, a Node.js module for analyzing multipart/form-data data.

# Installation:
Installation can be done using npm or yarn. run the following command:
NPM:

```bash
npm install busboy-file-management
```

YARN:

```bash
yarn add busboy-file-management
```

## USE IN EXPRESS:
```js

import { BusboyFileManagement } from 'busboy-file-management'

or

const { BusboyFileManagement } = require('busboy-file-management');
```

```js
import express from 'express';
import { BusboyFileManagement } from 'busboy-file-management'
const UploadManagement = new BusboyFileManagement({
    ignoreInternalLimit: false,
    limit: 8 * 1024 * 1024,
    multi: false,
    type: 'memory'
});
const app = express();
const port = 3000;

app.use(express.json());
app.use(UploadManagement.handle)
app.post('/upload', (req: any, res: any) => {
  console.log('Files:', req.files);
  console.log('Fields:', req.body);
  res.send('Upload successful!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
```
## You can also:
upload_middlaware.js:
```js
import { BusboyFileManagement } from 'busboy-file-management'

export default async (req: any, res: any, next: Function) => {
    const UploadManagement = new BusboyFileManagement();
    return await UploadManagement.handle(req, res, next);
}
```
or
```js
const { BusboyFileManagement } = require('busboy-file-management');

module.exports = () => async (req, res, next) => {
    const UploadManagement = new BusboyFileManagement();
    return await UploadManagement.handle(req, res, next);
};

```
server.js:
```js
import express from 'express';
import UploadManagement from './upload_middlaware';

const app = express();
const port = 3000;

app.use(express.json());
app.use(UploadManagement)
app.post('/upload', (req: any, res: any) => {
  console.log('Files:', req.files);
  console.log('Fields:', req.body);
  res.send('Upload successful!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

```

# req.files data:
```
Files: [
  {
    fieldname: 'files',
    buffer: <Buffer 54 46 48 30 30 30 30 30 30 30 31 41 52 53 30 32 38 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 32 20 20 20 20 20 20 ... 8350 more bytes>,
    originalname: 'test.txt',
    encoding: '7bit',
    mimetype: 'text/plain',
    truncated: false,
    size: 8400,
    url: ''
  }
]
```

## Supported storages

| Feature  | Status |
| ------------- | ------------- |
| Memory  | ✅  |
| Temporary  | ✅  |

