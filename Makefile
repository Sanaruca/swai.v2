build:
	bunx nx build swai --configuration docker
	bunx nx build api --configuration docker

compose:
	docker compose up -d
