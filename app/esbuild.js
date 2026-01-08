const esbuild = require("esbuild");
esbuild
  .build({
    entryPoints: ["src/infrastructure/handlers/**/*.ts"],
    outdir: "dist",
    outbase: "src",
    bundle: true,
    minify: true,
    treeShaking: true,
    sourcemap: true,
    keepNames: true,
    platform: "node",
    target: "node20.11.1",
    plugins: [],
  })
  .catch(() => process.exit(1));
