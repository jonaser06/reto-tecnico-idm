.PHONY: deploy-table start remove-table test docs deploy remove

STAGE ?= dev

deploy-table: ## Despliega la tabla DynamoDB en AWS
	docker-compose --profile deploy up deploy-table

start: ## Inicia la aplicación en desarrollo local
	docker-compose up

remove-table: ## Elimina la tabla DynamoDB de AWS
	docker-compose run --rm deploy-table sh -c "sls remove --config serverless-table.yml --stage $(STAGE)"

test: ## Ejecuta tests con coverage (sin detener el servidor)
	docker-compose exec app yarn test:coverage

docs: ## Genera y abre documentación OpenAPI
	cd app && npx @redocly/cli build-docs docs/openapi/openapi.yaml -o docs/index.html && open docs/index.html

deploy: ## Despliega las funciones Lambda a AWS
	docker-compose exec app npx serverless deploy --config serverless-cloud.yml --stage $(STAGE)

remove: ## Elimina las funciones Lambda de AWS
	docker-compose exec app npx serverless remove --config serverless-cloud.yml --stage $(STAGE)
