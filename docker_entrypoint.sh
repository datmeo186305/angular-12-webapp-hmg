#!/bin/bash

########################################
# Nativation to verify the nginx folders
########################################
echo ""
echo ""
echo "*********************"
echo "    Navigation"
echo "*********************"
whoami
nginx stop
pwd
ls
cd /code
ls
cd ..
#more ./generate_env-config.sh

########################################
# Create env-config.js file in the public folder
# of the ngnix server, based on the environment variables
# given by the docker run -e parameter
# - VUE_APP_ROOT
# - VUE_APP_KEYCLOAK
# - VUR_APP_WEBAPI
########################################
echo ""
echo ""
echo "*********************"
echo "Get ip address"
echo "*********************"
ip addr show
echo ""
echo ""
echo "*********************"
echo "Create ./code/environments/environment.ts"
echo "*******Exists?*********"
cd code
ls
########################################
# Create config.ts file in the public folder
# of the ngnix server
########################################
echo ""
echo ""
echo "*********************"
echo "Content ./code/environments/environment.ts"
echo "*********************"
cd /code
more ./environments/environment.ts

########################################
# Start ngnix server
# The configuration for the server contains also
# 'daemon off;'')
# to replace the start command for the
# container image.
# CMD ["nginx", "-g", "daemon off;"]
########################################
echo ""
echo ""
echo "*********************"
echo "Start server"
echo "*********************"
nginx
