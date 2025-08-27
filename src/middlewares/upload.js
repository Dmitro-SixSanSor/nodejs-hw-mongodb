import multer from 'multer';
import path from 'path';
import fs from 'fs';

const tempDir = path.resolve('tmp');
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

export const upload = multer({
  dest: tempDir,
  limits: { fileSize: 5 * 1024 * 1024 },
});
