run 

```bash
npx tsup src/index.ts --format esm,cjs --dts --sourcemap && node dist/index.js --parser ts --verbose test/test-file.js test/another-test-file.js
```