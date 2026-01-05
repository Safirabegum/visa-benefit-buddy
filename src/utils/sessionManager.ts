export function getSessionId(): string {
  let sessionId = sessionStorage.getItem('visa_buddy_session');

  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('visa_buddy_session', sessionId);
  }

  return sessionId;
}
