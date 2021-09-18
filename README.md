# ontology-mapper-ui

### Requirements

-   Docker

### Running Locally

Once Docker is installed, run the command

```
docker-compose up
```

while inside of the repository. The first time the command is run, Docker should build two images and corresponding containers:

-   `ontology-mapper-api`: the Flask backend API
-   `ontology-mapper-client`: the React frontend

Then, in a browser, navigate to `localhost:3000` to see the application. When done, hit `Ctrl+C` in the command line to shut down the containers.
