# DockerTools
Docker images for modern webdevelopment based on alpine linux

# Containers

## 1. Builder

### What is builder container?
We are using webpack and php composer to help you deployed modern web application. Exemplar App you can found in [project repository](https://github.com/gregorwebmaster/dockertools)

### Installed Packages
* Node.js 8
* NPM 6
* PHP 7.2
* PHP Composer 1.6

### Ports
* 35729  - Live Reload Webpack plugin

### Start a build server
> docker run -v /patch/to/your/app:/workspace -p 35729:35729 gregorwebmaster/ngino:builder

#### using docker-compose
```
version: '3.2'

services:

  builder:
    image: gregorwebmaster/ngino:builder
    volumes:
      - /patch/to/your/app:/workspace
    ports:
        -35729:35729
```