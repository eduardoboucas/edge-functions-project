import { Html5Entities } from "https://deno.land/x/html_entities@v1.0/mod.js";

import { Context } from "netlify:edge";

import { getClient } from "../../lib/edge/mysql.ts";

export default async (req: Request, ctx: Context) => {
  const url = new URL(req.url);

  if (url.searchParams.has("name")) {
    const { client, regionCode } = await getClient();

    console.log("Writing:", regionCode);

    await client.execute(`INSERT INTO users(name) values(?)`, [
      url.searchParams.get("name"),
    ]);

    const rootURL = new URL("/", req.url);

    return Response.redirect(rootURL.toString());
  }

  const dbStart = performance.now();
  const { client, regionCode } = await getClient(Deno.env.get("DENO_REGION"));
  const data = await client.query(`select * from users`);
  const dbEnd = performance.now();

  console.log("Reading:", regionCode);

  const res = await ctx.next();
  const text = await res.text();
  const items = data
    .map(
      ({ name }: { name: string }) => `<li>${Html5Entities.encode(name)}</li>`
    )
    .join("\n");
  const details = `Read data from ${regionCode} in ${Math.round(
    dbEnd - dbStart
  )} milliseconds`;
  const newText = text
    .replace("<!--items-->", items)
    .replace("<!--details-->", details);

  return new Response(newText, res);
};
