/*
 * Jest collectCoverageFrom: discovers parent sources with tests and includes
 * explicitly listed sources. Untested modules and the SDK are excluded.
 */

const BATCH_PATHS = [
  // append '<rootDir>/src/...' paths here.
]
const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '..')

const walkTestFiles = (dir, acc = []) => {
  if (!fs.existsSync(dir)) return acc
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === 'coverage') continue
    if (entry.name === '@' && path.basename(dir) === 'src') continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      walkTestFiles(full, acc)
      continue
    }
    if (!/\.(test|spec)\.[jt]sx?$/.test(entry.name)) continue
    acc.push(full)
  }
  return acc
}

const sourceForTest = (testPath) => {
  const testDir = path.dirname(testPath)
  const base = path.basename(testPath).replace(/\.(test|spec)\.[jt]sx?$/, '')
  const searchDir = path.basename(testDir) === '__tests__' ? path.dirname(testDir) : testDir
  const candidates = [
    path.join(searchDir, `${base}.ts`),
    path.join(searchDir, `${base}.tsx`),
    path.join(searchDir, `${base}.js`),
    path.join(searchDir, `${base}.jsx`),
    path.join(searchDir, 'index.ts'),
    path.join(searchDir, 'index.tsx'),
    path.join(searchDir, 'index.js'),
    path.join(searchDir, 'index.jsx')
  ]
  return candidates.find((candidate) => fs.existsSync(candidate)) || null
}

const sources = new Set()
for (const testPath of walkTestFiles(path.join(root, 'src'))) {
  const sourcePath = sourceForTest(testPath)
  if (!sourcePath) continue
  sources.add('<rootDir>/' + path.relative(root, sourcePath).replace(/\\/g, '/'))
}

module.exports = [...new Set([...BATCH_PATHS, ...sources])]
