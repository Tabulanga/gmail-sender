# GMAIL SENDER

### Тестовое задание
Необходимо на Express (Node.JS) написать сервис API c одним маршрутом, принимающим на вход json с данными для эл. письма, которое будет сохранено в MongoDB, после добавлено в очередь заданий на Redis и отправлено с помощью API Gmail.

Использовать latest-версии применяемого софта   
Без тестов   
Упаковывать в Docker не нужно   

### Необходимое окружение
Node: 12.19   
MongoDB: 4.4.1   
Redis: 6.0.8   

### Как запустить
Клонировать репозиторий и установить пакеты
```
git clone https://github.com/Tabulanga/gmail-sender.git
cd gmail-sender
npm install
```
Cкопировать файл *.env.example* в *.env*
```
cp .env.example .env
```
В файле *.env* в переменных окружения можно прописать свой Gmail-адрес, для подставки в поле *От* , а так же при необходимости раскомментировать и изменить URL'ы подключения к MongoDB и Redis.   
По умолчанию, они настроены на стандартные порты без пароля.
Так же можно прописать порт API, за исключение 3000 (занят под редирект OAuth2)

```
## .env

## API_PORT=3030

## MONGODB_URL='mongodb://localhost:27017/gmail-sender'
## REDIS_URL='redis://localhost:6379'

## GMAIL CREDENTIALS
GUSER=your_account@gmail.com 
```
Для работы API Gmail необходимо сформировать идентификаторы клиентов OAuth 2.0   
[API Console](https://console.developers.google.com/apis/credentials)   
Клиент "Веб-приложение"   
Uri перенаправления: http://localhost:3000/oauth2callback   
   
после чего скачать файл JSON и сложить в *../config/credentials.json*   
После запуска откроется страница, запрашивающая доступы   
   
##### Запустить сервис
```
npm start
```
##### Запустить линтер. Настроен Airbnb Style Guide
```
npm run lint
```

### Проверка работы
Сервис ожидает *POST* по адресу *localhost:3030*. Формат *JSON*. 
```
curl --header "Content-Type: application/json"  --data '{ "to": "nobody@gmail.com", "subject": "Testing mail", "message": "Hi! This is great code ))" }' --request POST   http://localhost:3030/

```

### Замечания в процессе выполнения
- Какую-то валидацию делать не требовалось, я заложил только проверку на наличие поля *To*. Middleware есть, при необходимости расширяется.
- Все логи и ошибки выводятся в консоль или возвращаются в ответе. 
- О получении информации о новых задачах в очереди. Сначала подумал реализовать через подписку Redis Pub/Sub. Но потом решил сделать через List и примитив всплывающего списка блокировки BLPOP. Это в случае масштабирования должно защищать от одновременной обработки на нескольких машинах. Также после отправки письма из очереди или при неудаче, хотелось бы как минимум дополнять этой информацией запись в Монге. Но в ТЗ этого не было, решил не усложнять. Ну и пожалуй, принимать письма, сохранять в базу и регистрировать в очередь может один микросервис, а вот следить за очередью и оправлять письма наверное другой. Так выглядит на мой взгляд более логично и лучше масштабируется. 
