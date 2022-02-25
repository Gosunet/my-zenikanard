#!/usr/bin/env node
const envFilePlugin = require('esbuild-envfile-plugin');

require('esbuild').build({
    plugins: [envFilePlugin],
    target: "es2020",
    bundle: true,
    outfile: "dist/index.js",
    sourcemap: true,
    format:"cjs",
    entryPoints: ["src/index.ts"],
    platform:"node",
});