export const fitbitAuthConfig = {
    clientId: '',
    clientSecret: '',
    redirectUrl: '',
    scopes: [
      'activity', 'heartrate', 'location', 'nutrition', 'profile',
      'settings', 'sleep', 'social', 'weight','temperature','respiratory_rate','oxygen_saturation'
    ],
    serviceConfiguration: {
      authorizationEndpoint: 'https://www.fitbit.com/oauth2/authorize',
      tokenEndpoint: 'https://api.fitbit.com/oauth2/token',
      revocationEndpoint: 'https://api.fitbit.com/oauth2/revoke'
    },
    usePKCE: false, // Fitbit doesn't support PKCE
  };
  