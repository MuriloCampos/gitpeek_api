Express API that allows you to get a list of the [trending](https://github.com/trending) or the most starred repositories on GitHub of a given language. It also saves the results on a Postgres database.

## Running the project

- **(optional)** Rename .env.example to .env and add your GitHub token to be able to make more than 10 requests per minute (eg. GITHUB_TOKEN=123456);
- Make sure you have [docker-compose installed](https://docs.docker.com/compose/install/);
- Start the containers `docker-compose up`;
- Open [http://localhost:8080](http://localhost:8080) with your browser to test if it's up.

## Routes

- GET /repo?language=LANGUAGE&since=INTERVAL
    - Returns the trending repositories of the given LANGUAGE in the given INTERVAL
    - Possible intervals are: daily, weekly and monthly
- GET /starred_repos?language=LANGUAGE
    - Returns the 50 most starred repos of the given LANGUAGE

**You can also check the deployed version of the [API](https://gitpeekapi.herokuapp.com/)**
