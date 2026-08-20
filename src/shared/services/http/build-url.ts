const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

export function buildUrl(url: any, params?: object): string {
  let cleanUrl = "";
  if (typeof url === "string") {
    cleanUrl = url;
  } else if (typeof url === "object" && url !== null && url.url) {
    cleanUrl = url.url;
  } else {
    cleanUrl = String(url);
  }

  if (cleanUrl.startsWith("/")) cleanUrl = cleanUrl.substring(1);

  const base = API_URL.endsWith("/") ? API_URL.substring(0, API_URL.length - 1) : API_URL;
  const finalUrl = `${base}/${cleanUrl}`;

  if (!params) return finalUrl;

  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      query.append(key, String(value));
    }
  });

  const queryString = query.toString();
  return queryString ? `${finalUrl}?${queryString}` : finalUrl;
}

