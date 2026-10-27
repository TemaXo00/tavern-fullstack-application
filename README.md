# TAVERN

## Описание

TAVERN - event-платформа, которая разработана для проведения мероприятий. Область мероприятий может быть разная: от концертов исполнителей вплоть до D&D и настольных игр, определяется конечным пользователем платформы

Разрабаывается в рамках курсового проекта дисциплины "Программирование сетевых приложений". Целью проекта является получение и закрепление навыков написания Backend-приложений на фреймворке NestJS:

- Разработка схем баз данных при помощи современных технологий (Prisma ORM)
- Разработка архитектурно чистого продукта, с высоким уровнем поддерживаемости
- Получение навыков в области кеширования запросов (Redis)
- Изучение транзакций баз данных
- Практическое применение системы контроля доступа по ролям (RBAC)
- Понимание устройства монорепозиториев (NX)
- Разработка и отладка CI/CD процессов
- Настройка среды окружения и Docker-контейнеров

## Быстрый старт

```bash
# Клонируем репозиторий
git clone https://github.com/TemaXo00/tavern-nestjs-api.git

# Запускаем скрипт настройки
bash scripts/dev-workspace.setup.sh

# Запускаем docker compose файл
docker compose up --build -d
```

## Ручная установка и использование

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

3 Создаем образы приложений

```bash
./scripts/docker.build.sh название_registry тэг
```

Пример команды:

```bash
./scripts/docker.build.sh local.registry.com latest
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

При необходимости тестирования gRPC методов для API - проект нацелен на использование Bruno в качестве локального хранения API-запросов. Для настройки переменных окружения следует сделать следующее:

```bash
# Переходим в директорию конфигурации. Делается из корня проекта
cd .bruno/
# Клонируем пример и переиименовываем в environments
cp environments-example environments
# При заходе в Bruno, как Workspace выбираем директорию .bruno в корне проекта
```

Для тестирования HTTP-методов - рекомендуется использовать Swagger. При порте 3000 у API Gateway, путь к Swagger следующий: `localhost:3000/api/docs`

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
├── .bruno/                     # Конфигурация API-клиента Bruno
├── docker-files/               # Файлы сборки проекта
├── docs/                       # Документация
├── scripts/                    # Bash-скрипты
├── .zed/                       # Конфигурация редактора кода Zed
├── app/                        # Nx-монорепозиторий
│   ├── server/                 # Backend-область приложения
│   ├── client/                 # Frontend-область приложения
│   ├── core-libs/              # Библиотеки общего назначения
│   ├── server-libs/            # Специализированные backend-библиотеки
│   └── client-libs/            # Специализированные frontend-библиотеки
├── docker-compose.infra.yml    # Конфигурация контейнеров инфраструктуры (для запуска локально без дополнительных образов приложений)
├── docker-compose.yml          # Конфигурация контейнеров для развертывания
├── .dockerignore               # Игнорируемые файлы Docker
├── .env.example                # Пример файла .env
├── .gitignore                  # Игнорируемые файлы Git
└── README.md                   # Документация
```

## Информация о API

Документация по каждому сервису приложения представлена в следующих файлах:

- [API Gateway](docs/gateway.md)
- [Сервис Авторизации](docs/auth.md)
- [Сервис Профилей](docs/profile.md)
- [Сервис Мероприятий](docs/event.md)
- [Сервис Почты](docs/mail.md)

## Возможные ошибки

### Bash-скрипты не работают

Возможно, необходимо дать права на запуск. В Linux/MacOS это делается следующим образом:

```bash
chmod +x scripts/dev-workspace.setup.sh
```

После этого скрипт будет отрабатывать корректно

### Docker: Невозможно получить образ

При возникновении ошибки, следует создать Docker-образы сервисов под необходимый registry с необходимым тэгом. Пример команды:

```bash
# Из корня проекта
./scripts/docker.build.sh repo.docker.com latest
```
