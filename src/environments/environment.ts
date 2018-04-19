// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  ENV :{
    mode : "dev", 
    hostURL : 'comfash.local', 
    hostPort: "9999", 
    apiVersion : "01", 
    auth : {
      clientID: 'IEFi9KoFw0QdQbtoXoCcD523MZ3OVULr',
      domain: 'comfash.eu.auth0.com',
      responseType: 'token id_token',
      audience: 'https://comfash.eu.auth0.com/api/v2/',
      redirectUri: 'http://localhost:8899/',
      scope: 'openid profile email' 
    }
  }
};
