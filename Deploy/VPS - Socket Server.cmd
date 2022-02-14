@ECHO OFF
TITLE "DEPLOY - RUN - PUSH | CSMS.Socket System, Docker, Docker hub | Loading ..."

CD %~dp0

set DnsServer="ec2-52-74-41-113.ap-southeast-1.compute.amazonaws.com"
SET Port=4444
SET Url="secret-key\thuydao.pem"

ECHO 1. Public DNS Server is: ec2-52-74-41-113.ap-southeast-1.compute.amazonaws.com
ECHO 2. Docker desktop is running
ECHO 3. CSMS.Socket will run on port %Port%
ECHO 4. Have secret key at path: "secret-key\thuydao.pem"
ECHO.

:CHOICE
SET /P result=Is all information true[Y/N]? 
ECHO.
IF /I "%result%" EQU "Y" GOTO :START-PROGRAM
IF /I "%result%" EQU "N" GOTO :INPUT-DATA
GOTO :CHOICE





:INPUT-DATA
ECHO.
SET /P DnsServer=Step 1/4: Enter DNS Server: 
ECHO Step 2/4: Run Docker Desktop
ECHO           Waiting to run Docker Desktop. Press any key to continue ...
PAUSE > NUL
SET /P Port=Step 3/4: Enter PORT number for CSMS.Socket: 
SET /P Url=Step 4/4: Enter the PATH to "thuydao.pem" file: 
SET Url = Url & "\thuydao.pem"
GOTO :START-PROGRAM





:START-PROGRAM
:CHOICE
ECHO Step 1: Create csms.socket image in Docker
ECHO Step 2: Run csms.socket container in Docker of OS
ECHO Step 3: Push csms.socket image to Docker hub
ECHO Step 4: Connect to Ubuntu Server and start Socket System
SET /P result=Which step for begin [1/2/3/4/5]? 


IF /I "%result%" EQU "1" GOTO :STEP-1
IF /I "%result%" EQU "2" GOTO :STEP-2
IF /I "%result%" EQU "3" GOTO :STEP-3
IF /I "%result%" EQU "4" GOTO :STEP-4
GOTO :CHOICE

:STEP-1
ECHO.
ECHO Step 1/4: Create csms.socket image in Docker **Make sure Docker is running**
ECHO ----- Filter all containers with image name is csms.socket
CALL docker ps -aq --filter ancestor=csms.socket
ECHO ----- Stop old containers
FOR /f "tokens=*" %%i IN ('docker ps -aq --filter "ancestor=csms.socket"') DO docker stop %%i
ECHO ----- Remove old containers
FOR /f "tokens=*" %%i IN ('docker ps -aq --filter "ancestor=csms.socket"') DO docker rm %%i
ECHO ----- Remove old image with name is csms.socket
CALL docker rmi csms.socket --force
ECHO ----- Build CSMS.SOCKET in Docker
CD ..\System\socket-server
CALL docker build -t "csms.socket" -f "Dockerfile" .
ECHO.


ECHO.
GOTO :STEP-2


:STEP-2
ECHO Step 2/4: Run csms.socket container on port 80 in Docker and on port %Port% in OS
CALL docker run -d -p %Port%:80 --name csms.socket csms.socket
ECHO.
GOTO :STEP-3


:STEP-3
ECHO Step 3/4: Push csms.socket image to Docker hub
CALL docker tag csms.socket thuydx9598/csms.socket
CALL docker push thuydx9598/csms.socket
ECHO.
GOTO :STEP-4


:STEP-4
REM  Limit memory - RAM : 128 MB
REM Always restart container when errors/down/reboot server
ECHO Step 4/4: Connect to Ubuntu Server and start CSMS.SOCKET
CALL ssh -i "%Url%" ubuntu@%DnsServer% "sudo docker rm csms.socket --force; sudo docker rmi thuydx9598/csms.socket --force; sudo docker run -m 128M -e TZ=Asia/Phnom_Penh -d --restart always -p %Port%:80 --name csms.socket thuydx9598/csms.socket"
ECHO.
PAUSE
EXIT