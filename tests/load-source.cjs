// Load the real TypeScript modules in Node; native APIs can be replaced by test doubles.
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

function loadSource(relativePath, mocks = {}, cache = new Map()) {
  const filename = path.resolve(__dirname, '..', relativePath);
  if (cache.has(filename)) return cache.get(filename);
  const source = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const module = { exports: {} };
  cache.set(filename, module.exports);
  function importModule(name) {
    if (Object.hasOwn(mocks, name)) return mocks[name];
    if (name.startsWith('@/')) return loadSource(`src/${name.slice(2)}.ts`, mocks, cache);
    return require(name);
  }
  new Function('require', 'module', 'exports', source)(importModule, module, module.exports);
  return module.exports;
}

module.exports = { loadSource };
