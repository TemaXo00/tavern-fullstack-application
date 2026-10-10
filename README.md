# TAVERN

## Описание

Разработанное приложение является частью учебных дисциплин в университете. Разрабаывается в рамках курсового проекта дисциплины "Программирование сетевых приложений" и лабораторных работ дисциплины "Современные технологии серверной разработки". Использует современный стек и нацелено на получение навыков написания FullStack-приложений

## Быстрый старт

```bash
# Клонируем репозиторий
git clone https://github.com/TemaXo00/tavern-nestjs-api.git

# Запускаем скрипт настройки
bash scripts/dev-workspace.setup.sh

# Запускаем Docker-инфраструктуру
docker compose -f docker-compose.infra.yml up --build -d

# Запускаем приложение
cd app
npm run all:dev
```

## Ручная установка

1 Клонируем репозиторий

```bash
git clone https://github.com/TemaXo00/tavern-nestjs-api.git
```

2 Создаем свои настройки в .env:

```bash
cp .env.example .env
cp app/.env.example app/.env

nano .env
nano app/.env
```

3 Создаем образ tavern-migrator

```bash
docker build -f docker-files/Db-Migrator.Dockerfile -t tavern/migrator:latest .
```

4 Устанавливаем зависимости NPM

```bash
cd app
npm i
```

5 Запускаем приложение

```bash
# Из корня проекта
docker compose -f docker-compose.infra.yml up --build -d && cd app && npm run all:dev
```

При необходимости тестирования gRPC методов для API - можно использовать Bruno. Для настройки переменных окружения следует сделать следующее:

```bash
# Переходим в директорию конфигурации. Делается из корня проекта
cd .bruno/
# Клонируем пример и переиименовываем в environments
cp environments-example environments
# При заходе в Bruno, как Workspace выбираем директорию .bruno в корне проекта
```

Для тестирования HTTP-методов - рекомендуется использовать Swagger и запущенные микросервисы. При порте 3000 у API Gateway, путь к Swagger следующий: localhost:3000/api/docs

Также поддерживается возможность генерации OpenAPI-документаици в форматах JSON и YAML:

```bash
# Пример получения документации Swagger в формате JSON
curl localhost:3000/api/docs/swagger.json
# Пример получения документации Swagger в формате YAML
curl localhost:3000/api/docs/swagger.yaml
```

## Техническая информация

Написан при помощи следующих основных технологий:

- [NestJS 11.0.0](https://nestjs.com/)
- [NX 23.1.1](https://nx.dev/)
- [Vue 3](https://vuejs.org/)
- [Prisma ORM 7.9.1](https://www.prisma.io/orm)
- [PostgreSQL 18.6](https://www.postgresql.org/)
- [Redis 8.10.0](https://redis.io/)
- [RabbitMQ 4.3.6](https://www.rabbitmq.com/)

Разработка приложения велась при помощи следующего программного обеспечения:

- [NodeJS 26.8 и новее](https://nodejs.org/en)
- [Docker 29.7.2 и новее](https://www.docker.com/)
- [Редактор кода Zed](https://zed.dev/)
- [API клиент Bruno](https://www.usebruno.com/)

## Архитектура проекта

```text
.
├── app/                        # Nx-монорепозиторий
│   ├── server/                 # Backend-область приложения
│   ├── client/                 # Frontend-область приложения
│   ├── core-libs/              # Библиотеки общего назначения
│   ├── server-libs/            # Специализированные backend-библиотеки
│   └── client-libs/            # Специализированные frontend-библиотеки
├── .bruno                      # Конфигурация Bruno
├── docker-compose.infra.yml    # Конфигурация контейнеров инфраструктуры (для запуска локально)
├── docker-compose.test.yml     # Тестовая конфигурация контейнеров для развертывания (требует Docker-образы микросервисов)
├── docker-files                # Файлы сборки проекта
├── .dockerignore               # Игнорируемые файлы Docker
├── docs                        # Документация
├── .env.example                # Пример файла .env
├── .gitignore                  # Игнорируемые файлы Git
├── README.md                   # Документация
├── scripts                     # Bash-скрипты
└── .zed                        # Конфигурация Zed
```

## Информация о API

Документация по каждому сервису приложения представлена в следующих файлах:

- [API Gateway](docs/gateway.md)
- [Сервис Авторизации](docs/auth.md)
- [Сервис Профилей](docs/profile.md)

## Возможные ошибки

### Скрипт dev-workspace.setup.sh не работает

Возможно, необходимо дать ему права на запуск. В Linux/MacOS это делается следующим образом:

```bash
chmod +x scripts/dev-workspace.setup.sh
```

После этого скрипт будет отрабатывать корректно

### Docker: Невозможно получить образ tavern/***:latest

При возникновении ошибки, следует создать Docker-образ необходимого сервиса. Пример команды:

```bash
# Из корня проекта
docker build -f docker-files/Auth.Dockerfile -t tavern/auth:latest ./app
```

Для создания аналогичных микросервисов, следует использовать менять следующие аргументы:

- `-f docker-files/Auth.Dockerfile` - меняется на Dockerfile для необходимого сервиса. Пример: `-f docker-files/Event.Dockerfile`
- `-t tavern/auth:latest` - меняется на необходимый тэг. Стоит смотреть по docker-compose.test.yml тэги, но обычно меняется auth на название необходимого микросервиса
