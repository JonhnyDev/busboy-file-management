import express from 'express';
import UploadManagement from './middlaware';

const app = express();
const port = 3000;

app.use(express.json());
app.use(UploadManagement)
app.get('/', (_req: any, res: any) => {
  res.status(200).send('ok')
});
app.post('/upload', (req: any, res: any) => {
  console.log('Files Total:', req.files.length);
  console.log('Files:', req.files);
  console.log('Fields:', req.body);
  res.send('Upload successful!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
