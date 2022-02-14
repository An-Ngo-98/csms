@ECHO OFF
TITLE "DEPLOY - RUN - PUSH | CSMS.SystemApi System, Docker, Heroku container | Loading ..."

CD %~dp0

ECHO Step 1: Create csms-system-api image in Docker
ECHO Step 2: Add tag registry.heroku.com/csms-system-api/web
ECHO Step 3: Push csms-system-api image to Heroku hub
ECHO Step 4: Release csms-system-api in heroku
ECHO Step 5: View log of csms-system-api in Heroku

ECHO.
ECHO Step 1/5: Create csms-system-api image in Docker
PAUSE
ECHO ----- Filter all containers with image name is csms-system-api
CALL docker ps -aq --filter ancestor=csms-system-api
ECHO ----- Stop old containers
FOR /f "tokens=*" %%i IN ('docker ps -aq --filter "ancestor=csms-system-api"') DO docker stop %%i
ECHO ----- Remove old containers
FOR /f "tokens=*" %%i IN ('docker ps -aq --filter "ancestor=csms-system-api"') DO docker rm %%i
ECHO ----- Remove old image with name is csms-system-api
CALL docker rmi csms-system-api --force
ECHO ----- Build csms-system-api in Docker
CD ..\System\CSMS.API\SystemApi
CALL docker build -t "csms-system-api" -f "HerokuDockerfile" .

ECHO Step 2/5: Add tag registry.heroku.com/csms-system-api/web
PAUSE
CALL docker tag csms-system-api registry.heroku.com/csms-system-api/web

ECHO Step 3/5: Push csms-system-api image to Heroku hub
PAUSE
CALL docker push registry.heroku.com/csms-system-api/web
ECHO.

ECHO Step 4/5: Release csms-system-api in heroku
PAUSE
CALL heroku container:release web --app csms-system-api
ECHO.

ECHO Step 5/5: View log of csms-system-api in Heroku
PAUSE
CALL heroku logs --tail --app csms-system-api
ECHO.
PAUSE
EXIT