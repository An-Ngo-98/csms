@ECHO OFF
TITLE "DEPLOY - RUN - PUSH | CSMS.UsersApi, Docker, Heroku container | Loading ..."

CD %~dp0

ECHO Step 1: Create csms-users-api image in Docker
ECHO Step 2: Add tag registry.heroku.com/csms-users-api/web
ECHO Step 3: Push csms-users-api image to Heroku hub
ECHO Step 4: Release csms-users-api in heroku
ECHO Step 5: View log of csms-users-api in Heroku

ECHO.
ECHO Step 1/5: Create csms-users-api image in Docker
PAUSE
ECHO ----- Filter all containers with image name is csms-users-api
CALL docker ps -aq --filter ancestor=csms-users-api
ECHO ----- Stop old containers
FOR /f "tokens=*" %%i IN ('docker ps -aq --filter "ancestor=csms-users-api"') DO docker stop %%i
ECHO ----- Remove old containers
FOR /f "tokens=*" %%i IN ('docker ps -aq --filter "ancestor=csms-users-api"') DO docker rm %%i
ECHO ----- Remove old image with name is csms-users-api
CALL docker rmi csms-users-api --force
ECHO ----- Build csms-users-api in Docker
CD ..\System\CSMS.API\UsersApi
CALL docker build -t "csms-users-api" -f "HerokuDockerfile" .

ECHO Step 2/5: Add tag registry.heroku.com/csms-users-api/web
PAUSE
CALL docker tag csms-users-api registry.heroku.com/csms-users-api/web

ECHO Step 3/5: Push csms-users-api image to Heroku hub
PAUSE
CALL docker push registry.heroku.com/csms-users-api/web
ECHO.

ECHO Step 4/5: Release csms-users-api in heroku
PAUSE
CALL heroku container:release web --app csms-users-api
ECHO.

ECHO Step 5/5: View log of csms-users-api in Heroku
PAUSE
CALL heroku logs --tail --app csms-users-api
ECHO.
PAUSE
EXIT