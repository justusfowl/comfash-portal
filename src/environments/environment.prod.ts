export const environment = {
  production: true,
  ENV :{
    mode : "prod", 
    hostURL : 'comfash.com', 
    hostPort: "443", 
    apiVersion : "01", 
    auth : {
      clientID: 'IEFi9KoFw0QdQbtoXoCcD523MZ3OVULr',
      domain: 'comfash.eu.auth0.com',
      responseType: 'token id_token',
      audience: 'https://comfash.eu.auth0.com/api/v2/',
      redirectUri: 'https://comfash.com/',
      scope: 'openid profile email app_metadata',
      api_secret : '' // no api secret for production required for the actions of the portal, so far only approvals take place in dev
    }
  }
};
