export const parseJwt = (token = '') => {
  const [, payloadBase64] = token.split('.');
  if (!payloadBase64) return 'token is invalid';

  const payload = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
  return JSON.parse(window.atob(payload));
};
