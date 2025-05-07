import { dirname } from 'path';
import { promises as fspromise, createWriteStream } from 'fs';
const { mkdir } = fspromise;

export async function SaveFile(filePath, base64Data) {
    try {
        await mkdir(dirname(filePath), { recursive: true });

        const buffer = Buffer.from(base64Data, 'base64');

        await new Promise((resolve, reject) => {
            const stream = createWriteStream(filePath);
            stream.write(buffer);
            stream.end();
            stream.on('finish', resolve);
            stream.on('error', reject);
        });
        return buffer;
    } catch (error) {
        console.error('Error al guardar el archivo:', error);
    }
}