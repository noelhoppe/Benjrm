# Identity Provider - Keycloak
1. [JSON Schema for Keycloak Import/Export - GitHub Repository](https://github.com/jirutka/keycloak-json-schema)
2. [JSON Schema for Keycloak Import/Export - Schemas](https://jirutka.github.io/keycloak-json-schema/)
3. [JSON Schema for Keycloak Import/Export - Keycloak Version 26](assets/keycloak-realm-26.json)
4. [All configuration options for Keycloak](https://www.keycloak.org/server/all-config)
5. [Observability - Health Check endppints](https://www.keycloak.org/observability/health)

# How it should be integrated with the application
1. Keycloak's health management interface runs on http port 9000 and exposes health check endpoints.
External traffic to this port should be blocked with a reverse proxy.

# Realm Configuration
1. **"realm": "benjrm"** - 
A realm manages a set of users, credentials, roles, and groups.
A user belongs to and logs into a realm.
Realms are isolated from one another and can only manage and authenticate the users that they control.
2. **"enabled": true** -
Disabled realms cannot be accessed or used for authentication, and users within the realm cannot log in or perform any actions until the realm is enabled again.
2. **"sslRequired": "external"** - 
localhost (via 127.0.0.1.) and private IP addresses can access without HTTPS but all other requests must use HTTPS.
3. **"clientScopes": [{}]** -
Clients are entities that can request Keycloak to authenticate a user.
Most often, clients are applications and services that want to use Keycloak to secure themselves and provide a single sign-on solution.
Clients can also be entities that just want to request identity information or an access token so that they can securely invoke other services on the network that are secured by Keycloak.

## Client-side Web Application Configuration
4. **clientId: "web"**" -
The client identifier registered with the identity provider.
Represents the client application.
5. **"name": "Client-side Web Application"** -
Specifies display name of the client.
6. **"description: "Client-side Web Application of Benjrm"** -
Help text for the description of the new flow
7. **"publicClient": true** -
This defines the type of the OIDC client. When it's ON, the OIDC type is set to confidential access type. When it's OFF, it is set to public access type.
8. **"standardFlowEnabled": true** -
This enables standard OpenID Connect redirect based authentication with authorization code. 
In terms of OpenID Connect or OAuth2 specifications, this enables support of 'Authorization Code Flow' for this client.
9. **"pkce.code.challenge.method": "S256"** -
Require Proof Key for Code Exchange (PKCE) to protect against authorization code interception attacks. 
Public clients (client authentication disabled) should always require PKCE as they cannot securely store client secrets. 
It is also recommended for confidential clients as an additional layer of security. 
If not required, Keycloak only uses PKCE when the client includes a code challenge and method in its authorization request.
10. **"post.logout.redirect.uris": ["http://localhost:3000/"]** -
Valid URI pattern a browser can redirect to after a successful logout. 
A value of '+' or an empty field uses the list of valid redirect URIs. 
A value of '-' does not allow any post logout redirect URIs. 
Simple wildcards are allowed such as 'http://example.com/*'. A relative path can be specified too, such as /my/relative/path/*. 
Relative paths are relative to the client root URL; if none is specified, the auth server root URL is used.
11. **"rootUrl": "http://localhost:5173"** -
Root URL appended to relative URLs
12. **"redirectUris": ["http://localhost:5173"]** -
Default URL to use when the auth server needs to redirect or link back to the client.
13. **"webOrigins": ["http://localhost:5173"]** -
Allowed CORS origins. 
To permit all origins of Valid Redirect URIs, add '+'. 
This does not include the * wildcard though. To permit all origins, explicitly add '*'.