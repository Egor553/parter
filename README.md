
# ШАГ — Платформа Наставничества

**ШАГ** — это мост между поколениями, платформа, где молодые люди (18-25 лет) могут встретиться с топовыми предпринимателями и экспертами для обмена опытом, энергией и получения наставничества.

## Особенности

- **ИИ-Подбор**: Использует Gemini AI для рекомендации наставника на основе текстового запроса пользователя.
- **Интеграция с Google Таблицами**: Все анкеты регистрации автоматически сохраняются в Google Таблицу через Apps Script Webhook.
- **Видео-визитки**: Каждый наставник имеет краткое видео-приветствие для знакомства.
- **Гибкие форматы**: Доступны индивидуальные онлайн/оффлайн встречи и групповые сессии.
- **Адаптивный дизайн**: Современный интерфейс на Tailwind CSS, оптимизированный для всех устройств.

## Быстрый старт

### 1. Требования
Для работы AI функций необходим API ключ Google Gemini.

### 2. Установка
Проект использует современные ES модули и не требует сложной сборки для простых демонстраций. 

### 3. Переменные окружения
Приложение ожидает:
- `process.env.API_KEY`: Ключ Google Gemini API.
- `GOOGLE_SHEETS_WEBHOOK_URL`: (Уже настроен в коде) URL вашего развернутого Google Apps Script.

## Настройка Google Таблиц

Если вы хотите использовать свою таблицу, разверните следующий код в Google Apps Script:

```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  
  sheet.appendRow([
    data.timestamp,
    data.name,
    data.birthDate,
    data.city,
    data.phone,
    data.focus,
    data.source
  ]);
  
  return ContentService.createTextOutput("Success").setMimeType(ContentService.MimeType.TEXT);
}
```

Разверните как "Веб-приложение" с доступом для "Все" (Anyone).

## Стек технологий
- React 19
- TypeScript
- Tailwind CSS
- Lucide React (иконки)
- Google Gemini API (@google/genai)
- Google Apps Script (Backend)

---
*Человеку нужен человек. Сделай свой ШАГ.*
