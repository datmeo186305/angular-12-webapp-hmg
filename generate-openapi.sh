#!/bin/bash

echo "*********************"
echo "Generate open api modules"
echo "*********************"
ls
mkdir -p "open-api-modules"
ls
pwd

openapi-generator-cli generate -i open-api-yaml/loanapp-tng-docs.yaml -g typescript-angular -o ./open-api-modules/loanapp-tng-api-docs

openapi-generator-cli generate -i open-api-yaml/loanapp-hmg-docs.yaml -g typescript-angular -o ./open-api-modules/loanapp-hmg-api-docs

openapi-generator-cli generate -i open-api-yaml/identity-docs.yaml -g typescript-angular -o ./open-api-modules/identity-api-docs

openapi-generator-cli generate -i open-api-yaml/customer-docs.yaml -g typescript-angular -o ./open-api-modules/customer-api-docs

openapi-generator-cli generate -i open-api-yaml/com-docs.yaml -g typescript-angular -o ./open-api-modules/com-api-docs

openapi-generator-cli generate -i open-api-yaml/core-docs.yaml -g typescript-angular -o ./open-api-modules/core-api-docs

openapi-generator-cli generate -i open-api-yaml/payment-docs.yaml -g typescript-angular -o ./open-api-modules/payment-api-docs

openapi-generator-cli generate -i open-api-yaml/contract-docs.yaml -g typescript-angular -o ./open-api-modules/contract-api-docs

openapi-generator-cli generate -i open-api-yaml/public-docs.yaml -g typescript-angular -o ./open-api-modules/public-api-docs

ls

