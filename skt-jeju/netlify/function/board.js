import { getStore } from "@netlify/blobs";

const CORS = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json"
};

export const handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: CORS, body: "" };
  }

  const store = getStore("skt-jeju-board");

  /* ── GET: 게시판 조회 ── */
  if (event.httpMethod === "GET") {
    try {
      const raw = await store.get("data");
      if (raw) {
        return { statusCode: 200, headers: CORS, body: raw };
      }
      const init = JSON.stringify({ board: {}, nextPostId: 1000 });
      await store.set("data", init);
      return { statusCode: 200, headers: CORS, body: init };
    } catch (e) {
      return { statusCode: 200, headers: CORS,
        body: JSON.stringify({ board: {}, nextPostId: 1000 }) };
    }
  }

  /* ── POST: 게시판 저장 ── */
  if (event.httpMethod === "POST") {
    try {
      const body = JSON.parse(event.body || "{}");
      await store.set("data", JSON.stringify(body));
      return { statusCode: 200, headers: CORS, body: JSON.stringify({ ok: true }) };
    } catch (e) {
      return { statusCode: 500, headers: CORS,
        body: JSON.stringify({ ok: false, error: e.message }) };
    }
  }

  return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: "Method Not Allowed" }) };
};

