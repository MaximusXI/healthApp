import AsyncStorage from '@react-native-async-storage/async-storage';
import { authorize, refresh, revoke } from 'react-native-app-auth';
import { fitbitAuthConfig } from './authConfig';

const STORAGE_KEY = '@fitbitTokens';
const SKEW_MS = 60 * 1000; // 60s safety skew

// ----- Storage helpers -----
export async function saveTokens(tokens) {
  // react-native-app-auth returns accessTokenExpirationDate (ISO string)
  const normalized = {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    tokenType: tokens.tokenType,
    scope: tokens.scope,
    idToken: tokens.idToken ?? null,
    accessTokenExpirationDate:
      tokens.accessTokenExpirationDate || tokens.expiresAt || null,
  };
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  return normalized;
}

export async function getTokens() {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : null;
}

export async function clearTokens() {
  await AsyncStorage.removeItem(STORAGE_KEY);
}

function isExpired(expirationIso) {
  if (!expirationIso) return true;
  const exp = new Date(expirationIso).getTime();
  return Date.now() + SKEW_MS >= exp;
}

// ----- Public API -----
// 1) Start Fitbit OAuth and persist tokens
export async function authorizeFitbit({ forceLogin = false } = {}) {
  const result = await authorize({
    ...fitbitAuthConfig,
    // During testing, force login UI to switch users if needed
    additionalParameters: forceLogin ? { prompt: 'login' } : undefined,
  });
  const saved = await saveTokens(result);
  return saved;
}

// 2) Ensure there is a valid access token (auto-refresh if needed)
export async function ensureAccessToken() {
  const tokens = await getTokens();
  if (!tokens) throw new Error('Fitbit not connected.');

  if (!isExpired(tokens.accessTokenExpirationDate)) {
    return tokens.accessToken;
  }

  if (!tokens.refreshToken) {
    await clearTokens();
    throw new Error('Session expired and no refresh token available.');
  }

  // Refresh
  const next = await refresh(fitbitAuthConfig, {
    refreshToken: tokens.refreshToken,
  });

  const merged = await saveTokens({
    ...tokens,
    ...next,
  });
  return merged.accessToken;
}

// 3) Revoke + clear
export async function logoutFitbit() {
  const tokens = await getTokens();
  try {
    if (tokens?.accessToken) {
      await revoke(fitbitAuthConfig, {
        tokenToRevoke: tokens.accessToken,
        sendClientId: true,
      });
    }
  } catch (_) {}
  try {
    if (tokens?.refreshToken) {
      await revoke(fitbitAuthConfig, {
        tokenToRevoke: tokens.refreshToken,
        sendClientId: true,
      });
    }
  } catch (_) {}
  await clearTokens();
}

// 4) Authenticated fetch helper
export async function apiFetch(url, opts = {}) {
  const accessToken = await ensureAccessToken();
  console.log('Fitbit Access Token:')
  console.log(accessToken);
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    'Accept-Language': 'en_US',
    ...(opts.headers || {}),
  };
  const res = await fetch(url, { ...opts, headers });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Fitbit API error ${res.status}: ${body}`);
  }
  return res.json();
}

// 5) Example: bundle commonly used endpoints
export async function fetchFitbitData() {
  // dynamic dates
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const date = `${yyyy}-${mm}-${dd}`;

  const [profile, steps, heart, sleep, temp, skin_temperature, oxygen_saturation,breathing_rate] = await Promise.all([
    apiFetch('https://api.fitbit.com/1/user/-/profile.json'),
    apiFetch(`https://api.fitbit.com/1/user/-/activities/steps/date/${date}/1d.json`),
    apiFetch(`https://api.fitbit.com/1/user/-/activities/heart/date/${date}/1d.json`),
    apiFetch(`https://api.fitbit.com/1.2/user/-/sleep/date/${date}.json`),
    apiFetch(`https://api.fitbit.com/1/user/-/temp/core/date/${date}.json`),
    apiFetch(`https://api.fitbit.com/1/user/-/temp/skin/date/${date}.json`),
    apiFetch(`https://api.fitbit.com/1/user/-/spo2/date/${date}.json`),
    apiFetch(`https://api.fitbit.com/1/user/-/br/date/${date}.json`)
  ]);

  return { profile, steps, heart, sleep, temp, skin_temperature, oxygen_saturation, breathing_rate };
}
