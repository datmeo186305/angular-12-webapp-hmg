#!/bin/bash

########################################
# Create a file based on the environment variables
# given by the dockerc run -e parameter
########################################
cat <<EOF
export const environment = {
  PRODUCTION: ${PRODUCTION},
  API_BASE_URL: "${API_BASE_URL}",
  IDENTITY_API_PATH: "${IDENTITY_API_PATH}",
  CUSTOMER_API_PATH: "${CUSTOMER_API_PATH}",
  COM_API_PATH: "${COM_API_PATH}",
  LOANAPP_API_PATH: "${LOANAPP_API_PATH}",
  CORE_API_PATH: "${CORE_API_PATH}",
  PAYMENT_API_PATH: "${PAYMENT_API_PATH}",
  ZALO_URL: "${ZALO_URL}",
  FB_MESSENGER_URL: "${FB_MESSENGER_URL}"
  PAYMENT_ORDER_NAME: "${PAYMENT_ORDER_NAME}"
  CONTRACT_ACTIVITY_STATUS: "${CONTRACT_ACTIVITY_STATUS}"
  CONTRACT_UUID: "${CONTRACT_UUID}"
  SENTRY_DSN: "${SENTRY_DSN}"
  VIDEO_GUIDE_URL: "${VIDEO_GUIDE_URL}"
};
EOF
