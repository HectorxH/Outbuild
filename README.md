# Outbuild

## Project Structure

- `o11y`: config for observability related tooling.
- `src`
    - `api`
        - `__tests__`: Api related unit tests (if I had more tests, there would be a `__tests__` folder for each api subfolder instead)
        - `activity`: Endpoints and logic related to activities
        - `auth`: Endpoints and logic related to authentication
        - `schedule`: Endpoints and logic related to schedules
    - `common`
        - `db`: Db connection, migration logic, and type definitions.
        - `middlewre`: Error handling, Simple pagination, and basic JWT auth.
        - `models`: Some common models across the API (Errors and Responses).
        - `utils`: Misc utility functions and logic (Reading config from `.env` and reused validation logic)
        - `types`: Only to extend global definitions by 3rd party libraries (in this case add fields to the requests through a express middleware)
        - `app.ts`: Express initialization, middlewares, logging, and api docs generation.
        - `index.ts`: Entrypoint.

## How to run

### Docker compose

The application runs in docker containers using docker compose. To start run:

```bash
docker compose up
# depending on your system you may need instead to run:
docker-compose up
```

This will bring up the following services:

- An empty Postgres instance
- The API itself running on node22-alpine using `pm2` to use all available cores
- Promtail, Loki and Grafana as an Observability stack to gather, store and display logs and metrics. Grafana comes with a sample dashboard preconfigured.

### Initialize DB (migrations)

Once the containers are up, initialize the DB applying the migrations with:

```bash
npm run migrate
```

### Run tests

Tests are run with `vitest`, given that the structured logging is meant to be
looked at through a external tool like grafana, it ends up being quite messy
looking for test, so consider outputing the logs to a file and formatting it
with `pino-pretty` or format it directly in stdout (may brake `vitest` colors).

```bash
npm run test | npx pino-pretty
```

## Endpoints

The API documentation is available at [http://localhost:8000/api-docs](http://localhost:8000/api-docs),
from here you can see all available endpoints of the API, as well as execute
requests to them. Most endpoints require authentication, a token can be
obtained loging into a new user, and can be stored for use in future requests
using the "Authorize" button.

For monitoring Grafana can be found at [http://localhost:3000](http://localhost:3000), for simplicity
login is not required. There should be an already existing dashboard called
"Outbuild API", here can be found the logs from both postgres and the api,
as well as some basic plots and metrics (API requests per minute and API
response time).

## Considerations

The activities of a schedule need to be requested from their own endpoint, this
was done to make pagination easier.

## TODO (if I had more time)

- [ ] More testing
    - [ ] Especially Integration tests!
    - [ ] Testing for Services.
- [ ] More logging
    - [ ] Request tracing to benchmark performance
