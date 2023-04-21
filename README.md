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

## USE EXPRESS:

```js
import express from 'express';
import BusboyFileManagement from 'busboy-file-management'
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
import BusboyFileManagement from 'busboy-file-management'
const UploadManagement = new BusboyFileManagement();

export default async (req: any, res: any, next: Function) => await UploadManagement.handle(req, res, next);


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
