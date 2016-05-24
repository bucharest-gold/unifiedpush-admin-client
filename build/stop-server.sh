#!/bin/bash

. build/version.sh

${WILDFLY}/bin/jboss-cli.sh --connect --controller=localhost:9992 command=:shutdown
