[![Static Badge](https://img.shields.io/badge/node-%3E%3D16.20.1-brightgreen)](https://nodejs.org/en)
[![Static Badge](https://img.shields.io/badge/npm-%3E%3D8.19.4-blue)](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
![Static Badge](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
![Static Badge](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Static Badge](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)

<h1>
    <div align="right">
        <a href="README.md">
            <img src="https://flagcdn.com/gb.svg" width="36" height="24" title="Английский язык" alt="Английский язык">
        </a>
        <img src="https://flagcdn.com/ru.svg" width="30" height="24" title="Русский язык" alt="Русский язык">
    </div>
    penco
</h1>

## Описание
penco — это веб-приложение для совместного редактирования графических схем в режиме реального времени. Пользователи
могут вместе рисовать различные геометрические фигуры на холсте в браузере.  
Особенностью приложения является возможность загружать PDF-документы на графический холст как отдельные объекты и
оставлять заметки на их страницах вместе с другими пользователями.

## Архитектура
Архитектура веб-приложения состоит из трёх основных компонентов: **серверной части**, **клиентской части** и **протокола
WebSocket**.

Связующим компонентом архитектуры является **протокол WebSocket**. Для создания двунаправленной связи в системе на стороне и
сервера, и клиента должен быть создан специальный экземпляр веб-сокета.

![Architecture](assets/architecture.jpg)

В **серверной части** системы инициализируется экземпляр протокола WebSocket, который следит за подключением клиентов и
прослушивает созданные именованные события. При возникновении какого-либо из них сервер обрабатывает полученные от
клиента данные и в тот же момент времени отправляет их всем остальным пользователям.

**Клиентская часть** также инициализирует специальный экземпляр протокола WebSocket, который устанавливает соединение с
серверным сокетом, создает необходимые обработчики для событий, установленных на сервере, и сам эмитирует нужные события
для отправки данных на сервер.

## Примеры работы веб-приложения
#### Совместное редактирование холста тремя пользователями
На скриншоте ниже показано, как три пользователя могут рисовать на одном холсте.  
Пользователи могут создавать различные линии, окружности или прямоугольники.

![Collaborative drawing](assets/collaborative-drawing.png)

#### Совместное редактирование загруженного PDF-документа
На скриншоте ниже показано, как несколько пользователей могут оставлять заметки на страницах PDF-документа.  
Пользователи могут загрузить любой PDF-документ, перелистывать его страницы и оставлять на них заметки.

![Collaborative PDF-file](assets/collaborative-pdf.png)

## Установка и использование
Клонируйте данный репозиторий.  
В корне проекта и внутри директориях [backend](backend) и [frontend](frontend) выполните команду:
```shell
npm i
```
Внутри директории [backend](backend) выполните следующую команду:
```shell
npm run dev
```
Внутри директории [frontend](frontend) выполните следующие команды:
```shell
npm run build
npm run start
```
Откройте http://localhost:3000/.

При последующих запусках достаточно выполнять команды `npm run dev` и `npm run start`.

## Зависимости
- **Node.js** v16.20.1 или более новая версия;
- **npm** v8.19.4 или более новая версия.

## Используемые технологии и инструменты
### Протокол WebSocket:
- backend: [socket.io](https://www.npmjs.com/package/socket.io) `4.7.5`
- frontend: [socket.io-client](https://www.npmjs.com/package/socket.io-client) `4.7.5`
### Backend
- [TypeScript](https://www.typescriptlang.org/) `5.4.5`
- [Express](https://expressjs.com/) `4.19.2`
### Frontend
- [TypeScript](https://www.typescriptlang.org/) `5.4.5`
- [React](https://react.dev/) `18.3.1`
- [LESS](https://lesscss.org/) `4.2.0`
- [webpack](https://webpack.js.org/) `5.91.0`
