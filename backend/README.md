
# FRAMES Nest backend

This is for backend of FRAMES deployed on render.com


## Tech used

**Server:** PostgreSQL, Neon for deployment

## Quick Start

Clone the project:
```
git clone https://github.com/techtonic-bsu/frames-nest
```
Run the project:
```
npm run dev
```



## API Reference
You can use either local and prod api endpoints:

For local: `API_URL: http://localhost:4000/api/v1/`

For prod: `API_URL: https://frames-nest.onrender.com/api/v1`

#### Register an account with encodings

```http
  POST /api/v1/signup
```
Make sure to include api key on header for authorization.
