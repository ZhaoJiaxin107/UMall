# UMall
A backend design using Node.js for an online shopping mall 

### Basic operation of development project

- Modularization: good maintenance and encapsulation of public code

- Handling error

- Various requests (configuration Middleware)

- Open static resources

All the above data projects need the basic framework, so we need to build the basic framework before developing the project.

**Express generator** is a tool used to build the basic framework of a project

In addition to the above basic operations, you also need **promise** + **async await** to process data, and you need to unify the interface specification. No matter what the request result is, you have to return a JSON data to the front end

### Partition interface module

#### Home page:
Unified in: routes/index.js

#### List page:
Unified in: routes/list.js

#### Details page:
Unified in: routes/detail.js

#### Search function:
Unified in: routes/index.js and routes/list.js

#### Register and login:
Unified in: routes/user.js

#### Express generator

* Download and install scaffolding
```
npm i express-generator -g
```
* Use scaffolding to frame the project
```
Express -- view = EJS UMallAPI

//Express uses the express framework

//view = EJS use the view template EJS
```
* Download dependency package

There is no node in the basic framework_ modules, so we need to install.
```
cd UMallAPI
npm install
```
* Start project
```
npm run start or npm start
```
* Configure package.json 

package.json To configure some commands, use the scripts attribute in the

```js
{
    "scripts": {
        "start": "node ./bin/www"
        "dev": "nodemon ./bin/www"
    }
}

```
* Start project
```
npm run start
npm run dev
```
