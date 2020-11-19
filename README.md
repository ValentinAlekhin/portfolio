# Portfolio

## Project setup

```
yarn install
```

### Compiles and hot-reloads for development

```
yarn serve
```

### Compiles and minifies for production

```
yarn build
```

## Docker setup

### Build image

```
docker build -t my_portfolio .
```

### Run container

```
docker container run -p 80:80 -p 443:443 -d --rm --name my_portfolio my_portfolio
```
