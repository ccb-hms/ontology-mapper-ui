# ontology-mapper-ui

### Requirements

-   Docker

### Running Locally

When first cloned, run the command:
```
git submodule init
```
to initialize the contained [`ontology-mapper`](https://github.com/ccb-hms/ontology-mapper) repository.
Then, after initialization or whenever the [`ontology-mapper`](https://github.com/ccb-hms/ontology-mapper) repository is updated, run the command 
```
git submodule update
```
to update the local version of that submodule.

To start the application, run the command:
```
docker-compose up
```
The first time the command is run, Docker should build two images and the corresponding containers:

-   `ontology-mapper-api`: the Flask backend API
-   `ontology-mapper-client`: the React frontend

Then, in a browser, navigate to `localhost:3000` to see the application. When done, hit `Ctrl+C` in the command line to shut down the containers.

### Acknowledgements

Initial setup of React and Flask and Dockerization aided by an [article series](https://blog.miguelgrinberg.com/post/how-to-dockerize-a-react-flask-project) by Miguel Grinberg.
