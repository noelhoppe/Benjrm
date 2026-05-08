#!/bin/bash

echo "Setup Identity Provider..."

echo "==> Printing out the current configuration"
/opt/keycloak/bin/kc.sh show-config

echo "==> Starting the server in development mode"
/opt/keycloak/bin/kc.sh start-dev &
echo "Waiting a bit for startup"
sleep 6

CUSTOM_REALM_NAME=demo_realm
CUSTOM_CLIENT_NAME=demo_client
CUSTOM_CLIENT_ID=demo_client_resource_id
CUSTOM_ROLE_NAME=demo-role
DEMO_PASSWORD=password
USERS_EMAIL_DOMAIN='example.com'

function CreateUserInRealm {
  # while loop to parse the arguments passed to the function.
  # The loop continues as long as there are arguments left to process ($# -gt 0).
  # $# is a special variable in Bash that holds the number of arguments passed to the function.
  while [ $# -gt 0 ]; do
    case "$1" in
      --realm*|-r*) # checks it the first argument starts with --realm or -r
        # if --realm <realm_name> format is used, shift the arguments to get the realm name in the next argument
        # else if --realm=<realm_name> format is used, the realm name is already in the same argument and no need to shift
        if [[ "$1" != *=* ]]; then shift; fi
        # $1 is the current argument being processed, and # operator is used to remove the shortest match of the following pattern (*= in this case) from the beginning of the string.
        SUPPLIED_REALM="${1#*=}"
        ;; # ends the current pattern block and moves to the next one
      --username*|-u*)
        if [[ "$1" != *=* ]]; then shift; fi
        SUPPLIED_USER_NAME="${1#*=}"
        ;;
      --password*|-p*)
        if [[ "$1" != *=* ]]; then shift; fi
        SUPPLIED_USER_PASSWORD="${1#*=}"
        ;;
      *) # default case if argument doesn't match any of the above patterns
        # prints an error message to standard error (>&2) file descriptor and exits the script with a status code of 1 (indicating an error).
        >&2 printf "Error: Invalid argument\n"
        exit 1
        ;;
    esac # ends the case statement
    shift # shifts the arguments to the left, so that the next argument becomes the current argument ($1) for the next iteration of the loop
  done
  echo "==> Creating demo user $SUPPLIED_USER_NAME in demo realm $SUPPLIED_REALM"
  /opt/keycloak/bin/kcadm.sh create users \
    --target-realm "$SUPPLIED_REALM" \
    --set username="$SUPPLIED_USER_NAME" \
    --set enabled=true \
    --set emailVerified=true \
    --set "email=${SUPPLIED_USER_NAME}@${USERS_EMAIL_DOMAIN}" \
    --set "firstName=${SUPPLIED_USER_NAME}First" \
    --set "lastName=${SUPPLIED_USER_NAME}Last" \
    --output
  echo "==> Setting password for user $SUPPLIED_USER_NAME in demo realm $SUPPLIED_REALM"
  /opt/keycloak/bin/kcadm.sh set-password \
    --target-realm "$SUPPLIED_REALM" \
    --username "$SUPPLIED_USER_NAME" \
    --new-password "$SUPPLIED_USER_PASSWORD"
}

while : # Endless loop (while : Bash-Builtin) to check if Keycloak is ready to accept connections
do
  # open a bidirectional TCP connection to port 9000 on localhost and assigns it to file descriptor 3.
  # if the port is open and accepting connections, the command will succeed, otherwise it will fail.
  exec 3<>/dev/tcp/127.0.0.1/9000

  # sends and HTTP GET /health/ready request to port 9000 on localhost and assigns it to file descriptor 3.
  # If the port is open and accepting connections, the command will succeed, otherwise it will fail.
  echo -e 'GET /health/ready HTTP/1.1\nHost: http://localhost:9000\nConnection: close\n\n' >&3

  # Checks the exit status of the previous command (the HTTP request). $? is a special variable in Bash that
  # holds the exit status of the last command executed.
  # If the exit status is 0 (success), it means that the port is open and accepting connections,
  # and the script will print "==> KC Ready" and break out of the loop
  if [ $? -eq 0 ]
  then
    echo '==> KC Ready'
    break
  fi
  # If the exist status is not 0 (failure), it means that the port is not open or not accepting connections,
  # and the script will print "==> KC not ready, sleeping a bit and checking again" and sleep for 2 seconds before checking again.
  echo "==> KC not ready, sleeping a bit and checking again"
  sleep 2
done

echo "Configuring realms and users"
echo "==> Configuring admin connection"
/opt/keycloak/bin/kcadm.sh config credentials \
  --server http://localhost:8088 \
  --realm master \
  --user "$KC_BOOTSTRAP_ADMIN_USERNAME" \
  --password "$KC_BOOTSTRAP_ADMIN_PASSWORD"
echo "==> Disabling SSL Required on master realm, because source of noice for local dev use"
/opt/keycloak/bin/kcadm.sh update realms/master \
  --set sslRequired=NONE
echo "==> Creating demo realm"
/opt/keycloak/bin/kcadm.sh create realms \
  --set realm="$CUSTOM_REALM_NAME" \
  --set enabled=true \
  --set sslRequired=NONE \
  --output
echo "===> Creating client scope openid needed by legacy client"
/opt/keycloak/bin/kcadm.sh create client-scopes \
  --target-realm "$CUSTOM_REALM_NAME" \
  --set id="openid_scope_id" \
  --set name="openid" \
  --set protocol=openid-connect \
  --set 'attributes."include.in.token.scope"=true' \
  --output
echo "==> Creating demo oauth client registration in demo realm"
/opt/keycloak/bin/kcadm.sh create clients \
  --target-realm "$CUSTOM_REALM_NAME" \
  --set id="$CUSTOM_CLIENT_ID" \
  --set clientId="$CUSTOM_CLIENT_NAME" \
  --set publicClient="true" \
  --set "redirectUris=[\"*\"]" \
  --set "webOrigins=[\"*\"]" \
  --set directAccessGrantsEnabled=true \
  --set enabled=true \
  --output
echo "==> Adding scope openid to client $CUSTOM_CLIENT_NAME"
/opt/keycloak/bin/kcadm.sh update \
  clients/$CUSTOM_CLIENT_ID/default-client-scopes/openid_scope_id \
  --target-realm "$CUSTOM_REALM_NAME"
echo "==> Creating demo role in demo realm"
/opt/keycloak/bin/kcadm.sh create roles \
  --target-realm "$CUSTOM_REALM_NAME" \
  --set name="$CUSTOM_ROLE_NAME" \
  --output

echo "==> Creating demo users in demo realm"
CreateUserInRealm --realm "$CUSTOM_REALM_NAME" --username "demo-admin" --password "$DEMO_PASSWORD"
CreateUserInRealm --realm "$CUSTOM_REALM_NAME" --username "user" --password "$DEMO_PASSWORD"
CreateUserInRealm --realm "$CUSTOM_REALM_NAME" --username "admin" --password "$DEMO_PASSWORD"
CreateUserInRealm --realm "$CUSTOM_REALM_NAME" --username "simon" --password "$DEMO_PASSWORD"

echo "==> Assigning roles to demo users"

/opt/keycloak/bin/kcadm.sh add-roles \
  --target-realm "$CUSTOM_REALM_NAME" \
  --uusername "demo-admin" \
  --rolename "$CUSTOM_ROLE_NAME"

/opt/keycloak/bin/kcadm.sh add-roles \
  --target-realm "$CUSTOM_REALM_NAME" \
  --uusername "user" \
  --rolename "$CUSTOM_ROLE_NAME"

/opt/keycloak/bin/kcadm.sh add-roles \
  --target-realm "$CUSTOM_REALM_NAME" \
  --uusername "admin" \
  --rolename "$CUSTOM_ROLE_NAME"

echo "Demo setup done"
echo "Keeping container alive indefinitely until it's shut down from the outside"
echo "To get user access token run curl --request POST --url http://localhost:8088/realms/$CUSTOM_REALM_NAME/protocol/openid-connect/token --header 'Content-Type: application/x-www-form-urlencoded' --data client_id=$CUSTOM_CLIENT_NAME --data username=demo-admin --data password=password --data realm=$CUSTOM_REALM_NAME --data grant_type=password"
sleep infinity