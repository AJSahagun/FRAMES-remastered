
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
- API key on header
- Request body (case sensitive) - first_name, middle_name, last_name, srCode(v1) school_id(v2), department, program, encoding

#### Visitor history

```http
  POST /api/v2/history
```
### Checklist:
- Request body (case sensitive) - encoding, school_id, time_in, time_out [optional]
- Ensure that time_in and time_out is ISO8601 format


## Error Codes
https://developer.mozilla.org/en-US/docs/Web/HTTP/Status

