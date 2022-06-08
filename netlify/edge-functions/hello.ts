import { Context } from "netlify:edge";

export default async (req: Request, ctx: Context) =>
  new Response("Hello from EF");
