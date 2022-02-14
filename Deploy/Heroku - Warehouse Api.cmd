@ECHO OFF
TITLE "DEPLOY - RUN - PUSH | CSMS.WarehouseApi, Docker, Heroku container | Loading ..."

CD %~dp0

ECHO Step 1: Create csms-warehouse-api image in Docker
ECHO Step 2: Add tag registry.heroku.com/csms-warehouse-api/web
ECHO Step 3: Push csms-warehouse-api image to Heroku hub
ECHO Step 4: Release csms-warehouse-api in heroku
ECHO Step 5: View log of csms-warehouse-api in Heroku

ECHO.
ECHO Step 1/5: Create csms-warehouse-api image in Docker
PAUSE
ECHO ----- Filter all containers with image name is csms-warehouse-api
CALL docker ps -aq --filter ancestor=csms-warehouse-api
ECHO ----- Stop old containers
FOR /f "tokens=*" %%i IN ('docker ps -aq --filter "ancestor=csms-warehouse-api"') DO docker stop %%i
ECHO ----- Remove old containers
FOR /f "tokens=*" %%i IN ('docker ps -aq --filter "ancestor=csms-warehouse-api"') DO docker rm %%i
ECHO ----- Remove old image with name is csms-warehouse-api
CALL docker rmi csms-warehouse-api --force
ECHO ----- Build csms-warehouse-api in Docker
CD ..\System\CSMS.API\WarehouseApi
CALL docker build -t "csms-warehouse-api" -f "HerokuDockerfile" .

ECHO Step 2/5: Add tag registry.heroku.com/csms-warehouse-api/web
PAUSE
CALL docker tag csms-warehouse-api registry.heroku.com/csms-warehouse-api/web

ECHO Step 3/5: Push csms-warehouse-api image to Heroku hub
PAUSE
CALL docker push registry.heroku.com/csms-warehouse-api/web
ECHO.

ECHO Step 4/5: Release csms-warehouse-api in heroku
PAUSE
CALL heroku container:release web --app csms-warehouse-api
ECHO.

ECHO Step 5/5: View log of csms-warehouse-api in Heroku
PAUSE
CALL heroku logs --tail --app csms-warehouse-api
ECHO.
PAUSE
EXIT