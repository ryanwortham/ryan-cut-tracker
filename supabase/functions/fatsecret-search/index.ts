const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

let cachedToken = "";
let cachedTokenExpiresAt = 0;

async function fatSecretToken() {
  const now = Date.now();
  if (cachedToken && cachedTokenExpiresAt > now + 60_000) return cachedToken;

  const clientId = Deno.env.get("FATSECRET_CLIENT_ID");
  const clientSecret = Deno.env.get("FATSECRET_CLIENT_SECRET");
  if (!clientId || !clientSecret) throw new Error("FatSecret credentials are not configured");

  const basic = btoa(`${clientId}:${clientSecret}`);
  const response = await fetch("https://oauth.fatsecret.com/connect/token", {
    method: "POST",
    headers: {
      "Authorization": `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "client_credentials", scope: "basic" }),
  });
  if (!response.ok) throw new Error(`FatSecret token failed (${response.status})`);
  const data = await response.json();
  cachedToken = data.access_token || "";
  cachedTokenExpiresAt = now + Number(data.expires_in || 3600) * 1000;
  return cachedToken;
}

function normalizeQuery(value: unknown) {
  return String(value || "").trim().slice(0, 120);
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const query = normalizeQuery(body.query);
    if (!query) {
      return new Response(JSON.stringify({ foods: [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = await fatSecretToken();
    const params = new URLSearchParams({
      method: "foods.search",
      search_expression: query,
      max_results: "12",
      format: "json",
    });

    const response = await fetch(`https://platform.fatsecret.com/rest/server.api?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error(`FatSecret food search failed (${response.status})`);
    const data = await response.json();
    const foods = data?.foods?.food || [];

    return new Response(JSON.stringify({ foods: Array.isArray(foods) ? foods : [foods] }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error?.message || error), foods: [] }), {
      status: 502,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
