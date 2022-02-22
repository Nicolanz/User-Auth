<h1 align = "center">User Auth</h1><br>
<p align="center">
    <img width="400" height="250" src="https://web-static.wrike.com/cdn-cgi/image/width=1760,format=auto,q=80/blog/content/uploads/2019/05/API-Wrike-.jpg?av=8d387ac3ad145fbd322ff0d641cd1124">
</p>

------------


## Description

This repository contains the backend of a basic User Authentication system made with Express

## Installation
Please clone this repo locally. Then, make sure you have `node ^15`, `npm ^7`, and `mongo ^5` installed on your operating system.
Finally, run: `npm install` to install these dependencies:


```
@sendgrid/mail: ^7.6.1
bcryptjs: ^2.4.3
consola: ^2.15.3
cors": ^2.8.5
dotenv: ^16.0.0
esm: ^3.2.25
express: ^4.17.2
express-validator: ^6.14.0
i: ^0.3.7
jsonwebtoken: ^8.5.1
lodash: ^4.17.21
mongoose: ^6.2.0
mongoose-paginate-v2": ^1.6.2
multer: ^1.4.4
passport: ^0.5.2
passport-jwt: ^4.0.0
```

You also must fill the value of the env variables found in the - [.env.example](./.env.example) file. I recommend you to define them into a file called: `.env`
```
# Api generated in Sendgrid to send emails.
SENDGRID_API=
# Mongo location route. Ex:
APP_DB=mongodb://127.0.0.1:27017/user-auth
# Email host. Ex:
APP_HOST_EMAIL=juan1234@hotmail.com
# Test host or domain name. Ex:
APP_DOMAIN=http://localhost:5000/
# App secret key. Ex:
APP_SECRET=1234567892
# Port number. Ex:
APP_PORT=5000
```


## Author:

- *Nicolás Zárate*  - [@Nicolanz](https://github.com/Nicolanz)

