import request from 'supertest';
import express from 'express';
import { BusboyFileManagement } from '../src';

const app = express();
app.use(express.json());

describe('BusboyFileManagament', () => {
    describe('handle()', () => {
        it('should handle file upload without default options', async () => {
            const fileContent = 'Lorem ipsum dolor sit amet';
            const filename = 'test.txt';
            const mimetype = 'text/plain';

            const busboyFileManagament = new BusboyFileManagement();

            app.post('/', busboyFileManagament.handle.bind(busboyFileManagament), (req: any, res: any) => {
                expect(req.files?.length).toBe(1);

                const file = req.files[0];
                expect(file.fieldname).toBe('file');
                expect(file.buffer.toString()).toBe(fileContent);
                expect(file.originalname).toBe(filename);
                expect(file.encoding).toBe('7bit');
                expect(file.mimetype).toBe(mimetype);
                expect(file.truncated).toBe(false);
                expect(file.size).toBe(fileContent.length);

                res.sendStatus(200);
            });

            const response = await request(app)
                .post('/')
                .attach('file', Buffer.from(fileContent), { filename });

            expect(response.status).toBe(200);
        });
        it('should handle file upload with custom options', async () => {
            const fileContent = 'Lorem ipsum dolor sit amet';
            const filename = 'test.txt';
            const mimetype = 'text/plain';

            const busboyFileManagament = new BusboyFileManagement({
                limit: 10 * 1024 * 1024, // 10 MB
                multi: true,
            });

            app.post('/', busboyFileManagament.handle.bind(busboyFileManagament), (req: any, res: any) => {
                expect(req.files.length).toBe(1);

                const file = req.files[0];
                expect(file.fieldname).toBe('file');
                expect(file.buffer.toString()).toBe(fileContent);
                expect(file.originalname).toBe(filename);
                expect(file.encoding).toBe('7bit');
                expect(file.mimetype).toBe(mimetype);
                expect(file.truncated).toBe(false);
                expect(file.size).toBe(fileContent.length);

                res.sendStatus(200);
            });

            const response = await request(app)
                .post('/')
                .attach('file', Buffer.from(fileContent), { filename });

            expect(response.status).toBe(200);
        });
        it('should reject request with a too large file', async () => {
            const fileContent = 'a'.repeat(11 * 1024 * 1024); // 11 MB
            const filename = 'test.txt';
            //const mimetype = 'text/plain';

            const busboyFileManagement = new BusboyFileManagement({
                limit: 10 * 1024 * 1024, // 10 MB
            });

            app.post(
                '/',
                busboyFileManagement.handle.bind(busboyFileManagement),
                (_req: any, res: any) => {
                res.sendStatus(200);
                }
            );

            const response = await request(app)
                .post('/')
                .attach('file', Buffer.from(fileContent), { filename });
            expect(response.status).toBe(500);
        });
        it('should handle single file upload', async () => {
            const fileContent = 'Lorem ipsum dolor sit amet';
            const filename = 'test.txt';
            const mimetype = 'text/plain';

            const busboyFileManagament = new BusboyFileManagement();

            app.post(
                '/',
                busboyFileManagament.handle.bind(busboyFileManagament),
                (req: any, res: any) => {
                expect(req.files?.length).toBe(1);

                const file = req.files[0];
                expect(file.fieldname).toBe('file');
                expect(file.buffer.toString()).toBe(fileContent);
                expect(file.originalname).toBe(filename);
                expect(file.encoding).toBe('7bit');
                expect(file.mimetype).toBe(mimetype);
                expect(file.truncated).toBe(false);
                expect(file.size).toBe(fileContent.length);

                res.sendStatus(200);
                }
            );

            const response = await request(app)
                .post('/')
                .attach('file', Buffer.from(fileContent), { filename });
            expect(response.status).toBe(200);
        });
    });
});
