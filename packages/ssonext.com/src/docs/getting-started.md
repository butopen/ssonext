---
title: Getting Started in 30s - SSONext open source single sign on, fast to integrate, easy to extend with hooks, plugins, and APIs
description: SSONext is an open source SSO (single sign-on) system, fast to integrate and easy to extend with web hooks, plugins and API
permalink: /docs/getting-started/
layout: layouts/doc
---

# Getting started
    
## Getting a login/sign-up form on your site
SSONext is an open source single sign-on solution. The goal we want to achieve is making it possible to have a user management system ready in seconds.

The result will be a form similar to this one:

![The base SSONext login form](/assets/img/soonext-login-form-example.jpg)

SSONext must be integrated on the frontend and on the backend.

## On the frontend: how to integrate the login form on your pages

To integrate the login form on your website/webapp you just need to

1) embed the following script on the head of your page
```html
<script src="https://ssonext.com/lib?code=233-445-997"></script>
```
2) use the web component `<sn-login>` where you want the form to appear:
```html
<sn-login></sn-login>
```

When the user logins successfully, a JWT token gets saved in `localStorage.SSONEXT_TOKEN`.

If you want to make an authorized request, then attach the JWT token in the Authorization header as a bearer token.

For example, using fetch, you will:

```javascript
fetch("/api/some-endpoint", {method: 'GET', headers: {Authorization: "Bearer " + localStorage.SSONEXT_TOKEN}})
```
On the server side you can check if the user is authorized by using the SSONext APIs or using any JWT libray. See below.

Next steps:
- [customize the CSS of the form](/customize-css-form)
- [use your own form](/custom-form)
- [save custom user information on the registration form](/register-user-with-additional-data)

## On the backend: how to check if the user is authorized

You can **verify a JWT token on the backend** using SSONext with the following endpoint by making a GET request:

```
https://ssonext.com/api/verify?API_KEY=YOUR_SSONEXT_API_KEY&token=A_SSONEXT_JWT_TOKEN
```

The response of this request can be an error, or a JSON like this:

```js
{
    valid: true,
    payload: {email:string, ...},
    expires: "2021-11-21T11:22:22.222Z"
}
```

Next steps:
- [Use SSONext on NodeJS is easier with the SSONext NPM package](/docs/ssonext-nodejs-npm-package/)










