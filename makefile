
all: build up


up:
	docker-compose up -d

build:
	docker-compose build

down:
	docker-compose down -v

re: down up