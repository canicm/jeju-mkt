import { getStore } from "@netlify/blobs";

const DEFAULT_MENU = [
  {
    id: 1, name: "공지사항", icon: "📢", type: "board", url: "", parentId: null,
    children: [
      { id: 11, name: "일반 공지",   icon: "📄", type: "board", url: "", parentId: 1, children: [] },
      { id: 12, name: "긴급 공지",   icon: "🚨", type: "board", url: "", parentId: 1, children: [] },
      { id: 13, name: "이벤트 안내", icon: "🎉", type: "board", url: "", parentId: 1, children: [] }
    ]
  },
  {
    id: 2, name: "마케팅 정보", icon: "🎯", type: "board", url: "", parentId: null,
    children: [
      { id: 21, name: "프로모션",       icon: "💰", type: "board", url: "", parentId: 2, children: [] },
      { id: 22, name: "캠페인",         icon: "📣", type: "board", url: "", parentId: 2, children: [] },
      { id: 23, name: "마케팅 자료실",  icon: "📁", type: "board", url: "", parentId: 2, children: [] }
    ]
  },
  {
    id: 3, name: "제품/요금제", icon: "📱", type: "board", url: "", parentId: null,
    children: [
      { id: 31, name: "단말기 정보", icon: "📲", type: "board", url: "", parentId: 3, children: [] },
      { id: 32, name: "요금제 안내", icon: "💳", type: "board", url: "", parentId: 3, children: [] },
      { id: 33, name: "부가서비스",  icon: "⭐", type: "board", url: "", parentId: 3, children: [] }
    ]
  },
  {
    id: 4, name: "유통망 관리", icon: "🏪", type: "board", url: "", parentId: null,
    children: [
      { id: 41, name: "판매점 현황", icon: "📍", type: "board", url: "", parentId: 4, children: [] },
      { id: 42, name: "실적 관리",   icon: "📊", type: "board", url: "", parentId: 4, children: [] }
    ]
  },
  {
    id: 5, name: "SK텔레콤 공식", icon: "🌐", type: "link",
    url: "https://www.sktelecom.com", parentId: null, children: []
  }
];

const CORS = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json"
};

export const handler = async (event) => {
  // CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: CORS, body: "" };
  }

  const store = getStore("skt-jeju-menu");

  /* ── GET: 메뉴 조회 ── */
  if (event.httpMethod === "GET") {
    try {
      const raw = await store.get("data");
      if (raw) {
        return { statusCode: 200, headers: CORS, body: raw };
      }
      // 초기 데이터
      const init = JSON.stringify({ menu: DEFAULT_MENU, nextId: 100 });
      await store.set("data", init);
      return { statusCode: 200, headers: CORS, body: init };
    } catch (e) {
      return { statusCode: 200, headers: CORS,
        body: JSON.stringify({ menu: DEFAULT_MENU, nextId: 100 }) };
    }
  }

  /* ── POST: 메뉴 저장 ── */
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