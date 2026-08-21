const SESSION_KEY = "api-utilities-demo-session";
const SESSION_EVENT = "api-utilities-demo-session-change";

export const DEMO_EMAIL = "user@demo.com";
export const DEMO_PASSWORD = "1234";

export function getDemoUserEmail(): string | null {
  return localStorage.getItem(SESSION_KEY);
}

export function signInDemo(email: string, password: string): boolean {
  if (email !== DEMO_EMAIL || password !== DEMO_PASSWORD) return false;

  localStorage.setItem(SESSION_KEY, email);
  window.dispatchEvent(new Event(SESSION_EVENT));
  return true;
}

export function subscribeToDemoSession(callback: () => void) {
  window.addEventListener(SESSION_EVENT, callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener(SESSION_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}
