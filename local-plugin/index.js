const { promises: fs } = require("fs");
const { resolve } = require("path");

module.exports = {
  onPreBuild: async ({ constants }) => {
    const functionSrc = `
      import { prettyBytes } from "alias:bytes";
      import { Context } from "https://edge.netlify.com";

      export default async (req: Request, context: Context) => {
        const bytes = prettyBytes(12345)

        return context.json({ bytes })
      }
    `;
    const importMap = {
      imports: {
        "alias:bytes": "https://deno.land/std@0.149.0/fmt/bytes.ts",
      },
    };
    const manifest = {
      functions: [
        {
          path: "/internal-func",
          function: "internal-func",
        },
      ],
      import_map: "./import_map.json",
      version: 1,
    };

    await fs.mkdir(constants.INTERNAL_EDGE_FUNCTIONS_SRC, { recursive: true });

    const functionPath = resolve(
      constants.INTERNAL_EDGE_FUNCTIONS_SRC,
      "internal-func.ts"
    );
    await fs.writeFile(functionPath, functionSrc);

    const importMapPath = resolve(
      constants.INTERNAL_EDGE_FUNCTIONS_SRC,
      "import_map.json"
    );
    await fs.writeFile(importMapPath, JSON.stringify(importMap));

    const manifestPath = resolve(
      constants.INTERNAL_EDGE_FUNCTIONS_SRC,
      "manifest.json"
    );
    await fs.writeFile(manifestPath, JSON.stringify(manifest));
  },
  onPostBuild: ({ constants }) => {
    const manifestPath = resolve(
      constants.EDGE_FUNCTIONS_DIST,
      "manifest.json"
    );
    const manifest = require(manifestPath);

    console.log(manifest);
  },
};
