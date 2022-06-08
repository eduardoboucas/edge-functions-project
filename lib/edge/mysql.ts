import { Client } from "https://github.com/codeflows/mysql/raw/tls/mod.ts";

function getRegionCode(region?: string) {
  if (region === "europe-west2") {
    return "PLANETSCALE_EU_WEST_1";
  }

  if (region?.startsWith("europe-")) {
    return "PLANETSCALE_EU_CENTRAL_1";
  }

  if (region?.startsWith("us-west")) {
    return "PLANETSCALE_US_WEST_2";
  }

  return "PLANETSCALE_MASTER";
}

export async function getClient(region?: string) {
  const regionCode = getRegionCode(region);
  const connectionString = Deno.env.get(regionCode) ?? "";
  const url = new URL(connectionString);
  const client = await new Client().connect({
    hostname: url.hostname,
    tls: {
      enabled: true,
    },
    username: url.username,
    db: url.pathname.slice(1),
    password: url.password,
  });

  return {
    client,
    regionCode,
  };
}
