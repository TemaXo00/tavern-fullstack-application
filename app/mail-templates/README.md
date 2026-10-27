# Mail templates

EJS-шаблоны для `@org/mail-handler`. Сервис рендерит файлы из этой папки и автоматически добавляет в контекст:

- `link` — адрес web-интерфейса (`TAVERN_WEB_CLIENT_LINK`);
- `year` — текущий год.

Шаблоны писем лежат в `auth/`, общие части — в `auth/partials/`.

## Структура

```text
mail-templates/
└── auth/
    ├── register.ejs
    ├── login.ejs
    ├── forgot-password.ejs
    ├── reset-password.ejs
    ├── block.ejs
    ├── unblock.ejs
    ├── change-email-old.ejs
    ├── change-email-new.ejs
    ├── change-password.ejs
    ├── set-active.ejs
    ├── delete.ejs
    └── partials/
        ├── theme.ejs
        ├── layout/
        │   ├── head.ejs
        │   ├── header.ejs
        │   ├── body-open.ejs
        │   ├── body-close.ejs
        │   ├── footer.ejs
        │   ├── page-start.ejs
        │   └── page-end.ejs
        └── components/
            ├── badge.ejs
            ├── button.ejs
            ├── callout.ejs
            ├── code.ejs
            ├── detail-list.ejs
            ├── divider.ejs
            ├── heading.ejs
            ├── link.ejs
            ├── list.ejs
            └── paragraph.ejs
```

## Каркас письма

Каждое письмо начинается с `page-start` и заканчивается `page-end`:

```ejs
<%
  const theme = {}
  const webLink = typeof link !== 'undefined' && link ? link : 'http://localhost:4200'
  const currentYear = typeof year !== 'undefined' && year ? year : new Date().getFullYear()
  const title = 'Заголовок письма'
  const preheader = 'Текст прехедера'
  const eyebrow = 'Категория'
%>
<%- include('./partials/layout/page-start', { theme, title, preheader, eyebrow, link: webLink }) %>

<%- include('./partials/components/heading', { theme, text: 'Заголовок' }) %>
<%- include('./partials/components/paragraph', { theme, text: 'Текст письма.' }) %>
<%- include('./partials/components/button', { theme, href: webLink, label: 'Открыть TAVERN' }) %>

<%- include('./partials/layout/page-end', { theme, link: webLink, year: currentYear }) %>
```

`page-start` подключает `head`, открывает каркас и шапку. `page-end` закрывает каркас и добавляет полноширинный футер с ссылкой на web-интерфейс и текущим годом.

## Тема

Все стили собраны в `auth/partials/theme.ejs`: палитра, шрифты, ширина, отступы и радиусы. Тема светлая, чёрно-белая, без цветных акцентов. Критичные стили продублированы inline, потому что `mail-handler` включает inlineCss при отправке.

Переопределить токены можно прямо в письме:

```ejs
<%
  const theme = {
    colors: {
      page: '#fafafa',
      button: '#18181b',
    },
    layout: {
      width: 640,
    },
  }
%>
```

Доступные группы токенов:

- `theme.meta` — `lang`, `brand`, `webLinkLabel`, `footerNote`, `copyright`;
- `theme.colors` — `page`, `card`, `text`, `muted`, `subtle`, `border`, `surface`, `surfaceStrong`, `inverse`, `inverseText`, `inverseMuted`, `inverseBorder`, `link`, `linkInverse`, `button`, `buttonText`, `buttonSecondary`, `buttonSecondaryText`, `buttonSecondaryBorder`;
- `theme.fonts` — `sans`, `mono`;
- `theme.layout` — `width`, `pagePadding`, `cardPadding`, `footerPadding`;
- `theme.radius` — `sm`, `md`, `lg`, `pill`.

## Компоненты

### `heading`

```ejs
<%- include('./partials/components/heading', {
  theme,
  text: 'Заголовок',
  level: 1,
  align: 'left',
  margin: '0 0 16px',
}) %>
```

### `paragraph`

```ejs
<%- include('./partials/components/paragraph', {
  theme,
  text: 'Текст',
  muted: false,
  size: '15px',
  lineHeight: '24px',
  align: 'left',
  margin: '0 0 16px',
  allowHtml: false,
}) %>
```

`allowHtml: true` использовать только для статического, доверенного текста. Пользовательские данные (`blockReason`, email, token) выводятся экранированно по умолчанию.

### `button`

```ejs
<%- include('./partials/components/button', {
  theme,
  href: webLink,
  label: 'Открыть TAVERN',
  variant: 'primary',
  align: 'left',
  top: '24px',
}) %>
```

`variant`: `primary` или `secondary`.

### `divider`

```ejs
<%- include('./partials/components/divider', { theme, spacing: '28px 0 0' }) %>
```

### `callout`

```ejs
<%- include('./partials/components/callout', {
  theme,
  title: 'Заголовок блока',
  text: 'Пояснение.',
  tone: 'neutral',
  margin: '28px 0 0',
}) %>
```

`tone`: `neutral` или `inverse`.

### `detail-list`

```ejs
<%- include('./partials/components/detail-list', {
  theme,
  title: 'Детали',
  items: [
    { label: 'Устройство', value: device },
    { label: 'Email', value: email, href: 'mailto:' + email },
  ],
}) %>
```

### `list`

```ejs
<%- include('./partials/components/list', {
  theme,
  items: ['Первый пункт', 'Второй пункт'],
  allowHtml: false,
}) %>
```

### `code`

```ejs
<%- include('./partials/components/code', {
  theme,
  label: 'Или скопируйте ссылку',
  value: resetLink,
}) %>
```

### `badge`

```ejs
<%- include('./partials/components/badge', {
  theme,
  text: 'Active',
  tone: 'solid',
}) %>
```

`tone`: `solid` или `outline`.

### `link`

```ejs
<%- include('./partials/components/link', {
  theme,
  href: webLink,
  label: 'Открыть TAVERN',
  margin: '0 0 16px',
}) %>
```

## Переменные шаблонов

| Шаблон             | Переменные                                   |
| ------------------ | -------------------------------------------- |
| `register`         | `browser`, `device`, `os`                    |
| `login`            | `browser`, `device`, `os`                    |
| `forgot-password`  | `token`                                      |
| `reset-password`   | `browser`, `device`, `os`                    |
| `block`            | `blockReason`, `blockedFrom`, `blockedUntil` |
| `unblock`          | `adminId`                                    |
| `change-email-old` | `newEmail`, `browser`, `device`, `os`        |
| `change-email-new` | `oldEmail`, `browser`, `device`, `os`        |
| `change-password`  | `browser`, `device`, `os`                    |
| `set-active`       | `adminId`                                    |
| `delete`           | —                                            |

Во все шаблоны дополнительно передаются `link` и `year`.

## Ссылки

Шаблоны формируют ссылки от `link`:

- вход — `${link}/auth/login`;
- восстановление пароля — `${link}/auth/forgot-password`;
- установка нового пароля — `${link}/auth/reset-password/:token`.

## Проверка рендера

Из корня приложения:

```bash
node -e "const ejs=require('ejs'); ejs.renderFile('mail-templates/auth/register.ejs',{link:'http://localhost:4200',year:2026,browser:'Chrome',device:'Desktop',os:'Linux'}).then(html=>console.log(html))"
```
