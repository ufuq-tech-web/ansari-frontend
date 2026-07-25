export const authEventEmitter = new EventTarget();
export const emitLogoutEvent = () => authEventEmitter.dispatchEvent(new Event('logout'));
