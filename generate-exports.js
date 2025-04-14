import fs from 'fs';
import path from 'path';
import { globSync } from 'glob';

const esmDir = 'dist';
const typesDir = 'dist/types';

const exportMap = {
	'.': {
		import: './dist/index.js',
		types: './dist/types/index.d.ts',
	},
};

const getRelativePath = (filePath) => './' + path.relative('.', filePath).replace(/\\/g, '/');

const getSubpaths = (baseDir) => {
	return globSync(`${baseDir}/**/index.js`)
		.map((jsPath) => {
			const subpath = path.relative(baseDir, path.dirname(jsPath));
			return subpath === '.' ? null : subpath;
		})
		.filter(Boolean);
};

const esmPaths = getSubpaths(esmDir);

for (const subpath of esmPaths) {
	const exportPath = `./${subpath}`;
	exportMap[exportPath] = {
		import: getRelativePath(path.join(esmDir, subpath, 'index.js')),
		types: getRelativePath(path.join(typesDir, subpath, 'index.d.ts')),
	};
}

const pkgPath = './package.json';
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));

pkg.exports = exportMap;

fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
console.log('✅ Exports successfully generated!');
