# Tech Stack — Backend

## Runtime & Language

| Technology     | Version | Purpose                                 |
| -------------- | ------- | --------------------------------------- |
| **Node.js**    | ≥ 18    | JavaScript runtime environment          |
| **TypeScript** | ^5.9    | Statically-typed superset of JavaScript |

---

## Web Framework

| Technology     | Version | Purpose                          |
| -------------- | ------- | -------------------------------- |
| **Express.js** | ^5.2    | HTTP server and REST API routing |

---

## Databases

| Technology     | Version | Purpose                                      |
| -------------- | ------- | -------------------------------------------- |
| **PostgreSQL** | —       | Primary relational database (via `pg` ^8.20) |
| **MongoDB**    | —       | NoSQL document store (via `mongodb` ^7.1)    |

---

## Authentication & Security

| Technology             | Version | Purpose                                       |
| ---------------------- | ------- | --------------------------------------------- |
| **jsonwebtoken**       | ^9.0    | JWT-based access/refresh token authentication |
| **helmet**             | ^8.1    | Sets secure HTTP response headers             |
| **cors**               | ^2.8    | Cross-Origin Resource Sharing configuration   |
| **express-rate-limit** | ^8.2    | Rate limiting to protect against abuse        |

---

## Validation

| Technology            | Version | Purpose                                        |
| --------------------- | ------- | ---------------------------------------------- |
| **express-validator** | ^7.3    | Request body/query/param validation middleware |

---

## Real-time Communication

| Technology    | Version | Purpose                                               |
| ------------- | ------- | ----------------------------------------------------- |
| **Socket.IO** | ^4.8    | WebSocket-based real-time bidirectional communication |

---

## API Documentation

| Technology             | Version | Purpose                                      |
| ---------------------- | ------- | -------------------------------------------- |
| **swagger-jsdoc**      | ^6.2    | Generates OpenAPI spec from JSDoc comments   |
| **swagger-ui-express** | ^5.0    | Serves interactive Swagger UI at `/api-docs` |

---

## Configuration & Utilities

| Technology | Version | Purpose                                           |
| ---------- | ------- | ------------------------------------------------- |
| **dotenv** | ^17.3   | Loads environment variables from `.env`           |
| **lodash** | —       | General-purpose utility functions                 |
| **yaml**   | ^2.8    | YAML file parsing (used for OpenAPI spec loading) |

---

## Developer Tooling

| Technology    | Version | Purpose                                            |
| ------------- | ------- | -------------------------------------------------- |
| **nodemon**   | ^3.1    | Auto-restarts server on file changes               |
| **tsx**       | ^4.21   | Runs TypeScript files directly (used for scripts)  |
| **tsc-alias** | ^1.8    | Resolves TypeScript path aliases after compilation |
| **rimraf**    | ^6.1    | Cross-platform `rm -rf` for cleaning `dist/`       |
| **ESLint**    | ^10.0   | Static code analysis and linting                   |
| **Prettier**  | ^3.8    | Opinionated code formatter                         |

---

## Containerization

| Technology | Purpose                                                                               |
| ---------- | ------------------------------------------------------------------------------------- |
| **Docker** | Container image for both development (`Dockerfile.dev`) and production (`Dockerfile`) |

---

## npm Scripts

| Script                      | Command                             | Description                              |
| --------------------------- | ----------------------------------- | ---------------------------------------- |
| `dev`                       | `npx nodemon`                       | Start development server with hot reload |
| `build`                     | `rimraf ./dist && tsc && tsc-alias` | Compile TypeScript to `dist/`            |
| `start`                     | `node dist/index.js`                | Run the compiled production build        |
| `lint` / `lint:fix`         | `eslint .`                          | Lint source files                        |
| `prettier` / `prettier:fix` | `prettier --check/--write .`        | Format source files                      |
| `seed:admin`                | `tsx src/scripts/seedAdmin.ts`      | Seed the initial admin account           |
