const UPSTREAM_URL = "https://bezoekje.app";

export const SOURCE_URL = "https://github.com/MajesteitBart/bezoekje";

// Read per call, not at module scope: `next build` imports this without the
// runtime environment, and only the running server knows where it is hosted.
export function siteUrl(): string {
  return process.env.SITE_URL ?? UPSTREAM_URL;
}

export function siteHost(): string {
  return new URL(siteUrl()).host;
}

export function isUpstreamSite(): boolean {
  return siteHost() === new URL(UPSTREAM_URL).host;
}
