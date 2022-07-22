import { Context } from "https://edge.netlify.com";

export default async (req: Request, context: Context) => {
  setTimeout(async () => {
    await fetch("https://webhook.site/3e84cb0a-00cc-4a56-917b-8c98e8e511c3");
  }, 10000);

  return context.json({ hello: "world" });
};
