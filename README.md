# Service Registry

A simple service for storing information about microservices.

## Build

```
make install lint unit-test component-test dependency-check
```

## Running

```
docker run -p 80 -e MONGODB_URL=mongodb://mongodb/service_registry quay.io/wealthwizards/service-registry
```

## Usage

Endpoints:

* GET, POST - /service-registry/v1/service
* GET, PUT - /service-registry/v1/service/[service-id]
* GET - /service-registry/v1/service?tags=tag1
* GET - /service-registry/v1/tag

Service object:

```
{
    "_id": "my-service",
    "links": [
        {
            "url": "/ping",
            "_id": "ping"
        },
        {
            "url": "/health",
            "_id": "health"
        }
    ],
    "environments": [
        {
            "_id": "test",
            "baseUrl": "https://test.example.com/my-service"
        },
        {
            "_id": "prod",
            "baseUrl": "https://prod.example.com/my-service"
        }
    ],
    "tags": [
      "tag1",
      "tag2"
    ]
}
```
