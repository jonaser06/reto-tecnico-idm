.PHONY: deploy-table start remove-table test

STAGE ?= dev

deploy-table: ## Despliega la tabla DynamoDB en AWS
	docker-compose --profile deploy up deploy-table

start: ## Inicia la aplicación en desarrollo local
	docker-compose up

remove-table: ## Elimina la tabla DynamoDB de AWS
	docker-compose run --rm deploy-table sh -c "sls remove --config serverless-table.yml --stage $(STAGE)"

test: ## Ejecuta tests con coverage (sin detener el servidor)
	docker-compose exec app yarn test:coverage
