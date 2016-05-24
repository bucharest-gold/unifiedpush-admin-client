#!/bin/bash

. build/version.sh

function waitForServer {
  # Give the server some time to start up. Look for a well-known
  # bit of text in the log file. Try at most 50 times before giving up.
  C=50
  while [ $C -gt 0 ]
  do
    grep "WildFly Full ${WILDFLYVERSION} (WildFly Core 2.0.10.Final) started" wildfly.log
    if [ $? -eq 0 ]; then
      echo "Server started."
      C=0
    else
      echo -n "."
      C=$(( $C - 1 ))
    fi
    sleep 1
  done
}

function waitForUPS {
  # Give the server some time to start up. Look for a well-known
  # bit of text in the log file. Try at most 50 times before giving up.
  C=50
  while [ $C -gt 0 ]
  do
    grep "Deployed \"ag-push.war\" (runtime-name : \"ag-push.war\")" wildfly.log
    if [ $? -eq 0 ]; then
      echo "Server started."
      C=0
    else
      echo -n "."
      C=$(( $C - 1 ))
    fi
    sleep 1
  done
}

WF="${WILDFLY}.tar.gz"
WILDFLY_URL="http://downloads.jboss.org/wildfly/${WILDFLYVERSION}/${WF}"

# Download wildfly server if we don't already have it
if [ ! -e $WILDFLY ]
then
  wget $WILDFLY_URL
  tar xzf $WF
  rm -f $WF
fi
# Download the keycloak wildfly adapter

WF_KC_ADAPTER="${KCWILDFLYADPATER}.tar.gz"
WF_KC_ADAPTER_URL="http://downloads.jboss.org/keycloak/${KCVERSION}/adapters/keycloak-oidc/${WF_KC_ADAPTER}"

wget $WF_KC_ADAPTER_URL
tar xzf $WF_KC_ADAPTER -C ./$WILDFLY
rm -f $WF_KC_ADAPTER


#Download the ups-db file
UPS_DB_FILE="unifiedpush-h2-ds.xml"
UPS_DB_FILE_URL="https://github.com/lholmquist/aerogear-unified-push-server/releases/download/0.0.1/${UPS_DB_FILE}"
wget $UPS_DB_FILE_URL
mv $UPS_DB_FILE ./$WILDFLY/standalone/deployments

#Download the ups-jms-setup
UPS_JMS_CLI="jms-setup-wildfly.cli"
UPS_JMS_CLI_URL="https://github.com/lholmquist/aerogear-unified-push-server/releases/download/0.0.1/${UPS_JMS_CLI}"
wget $UPS_JMS_CLI_URL
mv $UPS_JMS_CLI ./$WILDFLY/bin


#Download the ag-push.war
UPS_WAR="ag-push.war"
UPS_WAR_URL="https://github.com/lholmquist/aerogear-unified-push-server/releases/download/0.0.1/${UPS_WAR}"
wget $UPS_WAR_URL


## Start the wildfly server on port 8082
$WILDFLY/bin/standalone.sh -c standalone-full.xml -b 0.0.0.0 -Djboss.socket.binding.port-offset=2 > wildfly.log 2>&1 &
waitForServer

## Once started run the jms cli script
$WILDFLY/bin/jboss-cli.sh --controller=localhost:9992 --file=$WILDFLY/bin/$UPS_JMS_CLI

## then run the KC related cli commands
$WILDFLY/bin/jboss-cli.sh -c --controller=localhost:9992 --command="/system-property=ups.auth.server.url:add(value=http://localhost:8080/auth)"
$WILDFLY/bin/jboss-cli.sh -c --controller=localhost:9992 --command="/system-property=ups.realm.name:add(value=master)"

## Then add the UPS war
mv $UPS_WAR $WILDFLY/standalone/deployments
waitForUPS
