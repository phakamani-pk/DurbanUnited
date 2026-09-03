import { readdir, readFile, stat, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const repository = process.env.GITHUB_REPOSITORY?.split('/')[1];
if (!repository) process.exit(0);

async function rewrite(directory) {
  for (const entry of await readdir(directory)) {
    const path = join(directory, entry);
    const info = await stat(path);
    if (info.isDirectory()) await rewrite(path);
    else if (/\.(html|css|js|json|txt)$/.test(entry)) {
      const source = await readFile(path, 'utf8');
      const updated = source.replaceAll('/images/', `/${repository}/images/`);
      if (updated !== source) await writeFile(path, updated);
    }
  }
}

await rewrite('out');
