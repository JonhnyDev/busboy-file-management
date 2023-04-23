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

## USE:
```js

import { BusboyFileManagement } from 'busboy-file-management'

or

const { BusboyFileManagement } = require('busboy-file-management');
```

# EXPRESS Middlaware:

## Memory Usage
upload_middlaware.js:
```js
import { BusboyFileManagement, MemoryStorage } from 'busboy-file-management'

export default async (req: any, res: any, next: Function) => {
    const UploadManagement = new BusboyFileManagement({
        limits:{
            files: 5,
            fileSize: 80 * 1024 * 1024
        },
        storage: new MemoryStorage()
    });
    return await UploadManagement.handle(req, res, next);
}
```
 or

```js
import { BusboyFileManagement, TemporaryStorage } from 'busboy-file-management'

export default async (req: any, res: any, next: Function) => {
    const UploadManagement = new BusboyFileManagement({
        limits:{
            files: 5,
            fileSize: 80 * 1024 * 1024
        },
        storage: new TemporaryStorage()
    });
    return await UploadManagement.handle(req, res, next);
}
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

## req.files data:
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
## req.files data temporary storage:
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
    url: 'C:\\Users\XXXXX\AppData\Local\Temp\ad31f46f-f1b5-4f22-a5e7-5df6243bf1fb'
  }
]
```
## Supported storages

| Feature  | Status |
| ------------- | ------------- |
| MemoryStorage  | ✅  |
| TemporaryStorage  | ✅  |

