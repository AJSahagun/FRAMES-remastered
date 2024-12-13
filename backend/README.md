
# FRAMES Nest backend

This is for backend of FRAMES deployed on render

## Tech used

**Tech used:** PostgreSQL(Neon), NestJS, Helmet, 

## Quick Start

Clone the project:
```
git clone https://github.com/techtonic-bsu/frames-remastered
```
Run the project:
```
npm run start:dev
```



## API Reference
You can use either local and prod api endpoints:

For local: `API_URL: http://localhost:3001/v-/api/`

For prod: `API_URL: https://frames-nest.onrender.com/v-/api/`

#### Register an account with encodings

```http
  POST /api/v1/user
```
```http
  POST /api/v2/user
```
### Checklist:
- API key on header.
- Request body (case sensitive) - first_name, middle_name, last_name, srCode(v1) school_id(v2), department, program, encoding

#### Visitor history

```http
  POST /api/v2/history
```
### Checklist:
- Request body (case sensitive) - encoding, school_id, time_in, time_out [optional]
- Ensure that time_in and time_out is ISO8601 format

#### Visitor list of history

```http
  GET /api/v2/history
```
### Checklist:
- Request header must have Authorization, and Bearer with the JWT

#### Login Admin/Librarian
```http
  POST /api/v2/auth/login
```
### Checklist:
- Request body (case sensitive) - username, password
### Returns:
- JWT that needs to be stored in frontend.

#### User management - all requires admin token
New account
```
  POST /api/v2/auth/accounts
```
### Checklist:
- Request body (case sensitive) - username, password, role
### Returns:
- 2** if success

Fetch all accounts
```
  GET /api/v2/auth/accounts
```
Update an account
```
  PATCH /api/v2/auth/accounts/:username
```
### Checklist:
- Request body (case sensitive) - username param, [username, password, role] all optional
### Returns:
- 2** if success

Delete an account
```
  DELETE /api/v2/auth/accounts/:username
```
### Checklist:
- Request body (case sensitive) - username param
### Returns:
- 2** if success

## Error Codes
https://developer.mozilla.org/en-US/docs/Web/HTTP/Status

