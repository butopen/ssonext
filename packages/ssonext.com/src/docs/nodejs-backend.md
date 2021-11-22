---
title: Getting Started in 30s - SSONext open source single sign on, fast to integrate, easy to extend with hooks, plugins, and APIs
description: SSONext is an open source SSO (single sign-on) system, fast to integrate and easy to extend with web hooks, plugins and API
permalink: /docs/ssonext-nodejs-npm-package/
layout: layouts/doc
---

# Using SSONext with NodeJs

If you use NPM, the easiest way to authorize a user on the backend is through the `@butopen/ssonext` library

1) Install the SSONext library:
```shell
npm install @butopen/ssonext
```


2) Import the library:
```typescript
import {SSONext} from "@butopen/ssonext" // or const {SSONext} = require("@butopen/ssonext")
```
3) Check the token:
```typescript
const tokenData = new SSONext("YOUR_SSONEXT_API_KEY").verify(token)
```

## One more option: check if the user is authorized on Node.js without the SSONext library
There is still a third option to verify a token on the backend: through any JWT library, without the SSONext package.

`jsonwebtoken` is a popular node NPM package to verify JWT token. SSONext tokens are JWT tokens, so you can use it to authorize a user:

1) When you init your app, download your password once:
```typescript
// do it once in your init code
const fetch = require('node-fetch');
const YOUR_SSONEXT_PASSWORD = (await (await fetch("https://ssonext.com/api/pwd?API_KEY=YOUR_SSONEXT_API_KEY")).json()).password
```
Here we use node-fetch, but you may want to use Axios or the pure Node HTTPs APIs.

2) With the password above, verify the JWT token using `jsonwebtoken` as follows:
```typescript
    
// to verify the JWT token offline
const jwt = require('jsonwebtoken');
jwt.verify(token, YOUR_SSONEXT_PASSWORD);

```

Both methods work offline. An async request is made  just once, to get the password from your API key.

Internally the SSONext NPM package does the same stuff as in point (2). However, SSONext API exposes other useful methods. 



