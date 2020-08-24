# How to run service
- Build and run container with
```bash
./cli/run.sh
```
- Create MongoDB index:
```bash
docker exec -it mongo /bin/bash
mongo -u user -p pass
use analytics
db.series_access.createIndex( { accessCount: -1 } )
```
- Open SwaggerUI in your browser [http://127.0.0.1:8080/docs/#](http://127.0.0.1:8080/docs/#/)
