const { copyFileSync } = require("fs");
const path = require("path");

const src = path.resolve(__dirname, "../index.d.ts");
const dest = path.resolve(__dirname, "../types/index.d.ts");

copyFileSync(src, dest);
