export function encodeScenarioToParam(obj: unknown): string {
  const json = JSON.stringify(obj);
  const b64 = typeof window !== 'undefined'
    ? window.btoa(unescape(encodeURIComponent(json)))
    : Buffer.from(json).toString('base64');
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/,'');
}

export function decodeScenarioParam(param: string): any {
  const b64 = param.replace(/-/g, '+').replace(/_/g, '/');
  const json = typeof window !== 'undefined'
    ? decodeURIComponent(escape(window.atob(b64)))
    : Buffer.from(b64, 'base64').toString();
  return JSON.parse(json);
}

