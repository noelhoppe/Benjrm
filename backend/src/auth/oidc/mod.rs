use {
    crate::app_data::{env_var, env_var_default},
    actix_security::http::security::{OAuth2Client, OAuth2Config, OAuth2Provider},
    std::env,
    url::Url,
};

mod error;
mod handler;

pub use handler::init;

pub struct Oidc {
    client: OAuth2Client,
    public_url: Url,
    public_idp_url: Option<Url>,
    issuer_url: Url,
    logout_url: Url,
}

impl Oidc {
    pub async fn from_env() -> Self {
        const DEFAULT_NAME: &str = "KC_URL and KC_REALM_ID";
        let keycloak = env::var("KC_URL")
            .ok()
            .map(|x| Url::parse(&x).expect("KC_URL"))
            .zip(env::var("KC_REALM_ID").ok());
        let keycloak = keycloak.as_ref();

        let public_idp_url = env::var("OIDC_PUBLIC_IDP_URL")
            .ok()
            .map(|x| Url::parse(&x).expect("OIDC_PUBLIC_IDP_URL"));

        let public_url = Url::parse(&env_var("PUBLIC_URL")).expect("PUBLIC_URL");

        let authorization_url = env_var_default("OIDC_AUTHORIZATION_URL", DEFAULT_NAME, || {
            keycloak.map(|(url, realm)| format!("{url}realms/{realm}/protocol/openid-connect/auth"))
        });

        let token_url = env_var_default("OIDC_TOKEN_URL", DEFAULT_NAME, || {
            keycloak
                .map(|(url, realm)| format!("{url}realms/{realm}/protocol/openid-connect/token"))
        });

        let userinfo_url = env_var_default("OIDC_USERINFO_URL", DEFAULT_NAME, || {
            keycloak
                .map(|(url, realm)| format!("{url}realms/{realm}/protocol/openid-connect/token"))
        });

        let issuer_url = env_var_default("OIDC_ISSUER_URL", DEFAULT_NAME, || {
            keycloak.map(|(url, realm)| format!("{url}realms/{realm}"))
        });
        let issuer_url = Url::parse(&issuer_url).expect("OIDC_ISSUER_URL");
        let public_issuer_url = Self::to_public_idp_url_inner(issuer_url.clone(), &public_idp_url);

        let logout_url = env_var_default("OIDC_LOGOUT_URL", DEFAULT_NAME, || {
            keycloak
                .map(|(url, realm)| format!("{url}realms/{realm}/protocol/openid-connect/logout"))
        });
        let logout_url = Url::parse(&logout_url).expect("LOGOUT_URL");
        let logout_url = Self::to_public_idp_url_inner(logout_url, &public_idp_url);

        let config = OAuth2Config::new(
            env_var("OIDC_CLIENT_ID"),
            env_var("OIDC_CLIENT_SECRET"),
            format!("{public_url}auth/oidc/callback"),
        )
        .provider(OAuth2Provider::Keycloak)
        .authorization_uri(authorization_url)
        .token_uri(token_url)
        .userinfo_uri(userinfo_url)
        .issuer_uri(issuer_url)
        .public_issuer_uri(public_issuer_url.clone())
        .scopes(vec!["openid"]);

        let client = OAuth2Client::new(config).await.unwrap();
        if !client.has_oidc() {
            panic!("OIDC server is incorrectly configured or doesn't support OIDC.");
        }

        Self {
            client,
            public_url,
            public_idp_url,
            issuer_url: public_issuer_url,
            logout_url,
        }
    }

    fn to_public_idp_url_inner(mut url: Url, idp_url: &Option<Url>) -> Url {
        if let Some(public) = idp_url {
            let _ = url.set_scheme(public.scheme());
            let _ = url.set_host(public.host_str());
            let _ = url.set_port(public.port());
        }
        url
    }

    fn to_public_idp_url(&self, url: Url) -> Url {
        Self::to_public_idp_url_inner(url, &self.public_idp_url)
    }
}
