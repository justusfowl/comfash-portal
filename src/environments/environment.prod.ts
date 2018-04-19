export const environment = {
  production: true,
  ENV :{
    mode : "prod", 
    hostURL : 'comfash.local', 
    hostPort: "9999", 
    apiVersion : "01", 
    auth : {
      clientID: 'IEFi9KoFw0QdQbtoXoCcD523MZ3OVULr',
      domain: 'comfash.eu.auth0.com',
      responseType: 'token id_token',
      audience: 'https://comfash.eu.auth0.com/api/v2/',
      redirectUri: 'https://comfash.local:9999/',
      scope: 'openid profile email' 
    }
  }
};
