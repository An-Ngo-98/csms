@ECHO OFF
TITLE "DEPLOY - RUN - PUSH | CSMS.OMS Gateway, Docker, Docker hub | Loading ..."

CD %~dp0

set DnsServer="ec2-52-74-41-113.ap-southeast-1.compute.amazonaws.com"
SET Port=3001
SET Url="C:\Users\thuyd\Desktop\CSMS\Deploy\secret-key\thuydao.pem"

ECHO 1. Public DNS Server is: ec2-52-74-41-113.ap-southeast-1.compute.amazonaws.com
ECHO 2. Docker desktop is running
ECHO 3. OMS System will run on port %Port%
ECHO 4. Have secret key at path: %Url%
ECHO.

:CHOICE
SET /P result=Is all information true[Y/N]? 
ECHO.
IF /I "%result%" EQU "Y" GOTO :START-PROGRAM
IF /I "%result%" EQU "N" GOTO :INPUT-DATA
GOTO :CHOICE





REM Start INPUT-DATA Function

:INPUT-DATA
ECHO.
SET /P DnsServer=Step 1/4: Enter DNS Server: 
ECHO Step 2/4: Run Docker Desktop
ECHO           Waiting to run Docker Desktop. Press any key to continue ...
PAUSE > NUL
SET /P Port=Step 3/4: Enter PORT number for CSMS.OMS Gateway: 
SET /P Url=Step 4/4: Enter the PATH to "thuydao.pem" file: 
SET Url = Url & "\thuydao.pem"
GOTO :START-PROGRAM





:START-PROGRAM
:CHOICE
ECHO Step 1: Built CSMS.OMS.UI
ECHO Step 2: Create csms.oms image in Docker
ECHO Step 3: Run csms.oms container in Docker of OS
ECHO Step 4: Push csms.oms image to Docker hub
ECHO Step 5: Connect to Ubuntu Server and start OMS System
SET /P result=Which step for begin [1/2/3/4/5]? 

ECHO.
SET /P isDeleteUIFolder=Do you want to delete wwwroot folder which will be generated from CSMS.OMS.UI[Y/N]? 

IF /I "%result%" EQU "1" GOTO :STEP-1
IF /I "%result%" EQU "2" GOTO :STEP-2
IF /I "%result%" EQU "3" GOTO :STEP-3
IF /I "%result%" EQU "4" GOTO :STEP-4
IF /I "%result%" EQU "5" GOTO :STEP-5
GOTO :CHOICE

:STEP-1
ECHO. 
ECHO Step 1/5: Built CSMS.OMS.UI
CD ..\System\CSMS.OMS\CSMS.OMS.UI
ECHO ----- Build CSMS.OMS.UI with product environment
CALL ng build --prod --output-path=../CSMS.OMS.GatewayApi/wwwroot
CD ..
ECHO. 
ECHO ----- Deleting 3rdpartylicenses.txt file
DEL CSMS.OMS.GatewayApi\wwwroot\3rdpartylicenses.txt
CD ..\..\Deploy
ECHO. 
GOTO :STEP-2


:STEP-2
ECHO Step 2/5: Create csms.oms image in Docker **Make sure Docker is running**
ECHO ----- Filter all containers with image name is csms.oms
CALL docker ps -aq --filter ancestor=csms.oms
ECHO ----- Stop old containers
FOR /f "tokens=*" %%i IN ('docker ps -aq --filter "ancestor=csms.oms"') DO docker stop %%i
ECHO ----- Remove old containers
FOR /f "tokens=*" %%i IN ('docker ps -aq --filter "ancestor=csms.oms"') DO docker rm %%i
ECHO ----- Remove old image with name is csms.oms
CALL docker rmi csms.oms --force
ECHO ----- Build CSMS.OMS.GatewayApi in Docker
CD ..\System\CSMS.OMS\CSMS.OMS.GatewayApi
CALL docker build -t "csms.oms" -f "Dockerfile" .
ECHO.


IF /I "%isDeleteUIFolder%" EQU "Y" ECHO ----- Deleting wwwroot folder of CSMS.OMS.UI output && rmdir /s /q "wwwroot"

ECHO.
GOTO :STEP-3


:STEP-3
ECHO Step 3/5: Run csms.oms container on port 80 in Docker and on port %Port% in OS
CALL docker run -d -p %Port%:80 --name csms.oms csms.oms
ECHO.
GOTO :STEP-4


:STEP-4
ECHO Step 4/5: Push csms.oms image to Docker hub
CALL docker tag csms.oms thuydx9598/csms.oms
CALL docker push thuydx9598/csms.oms
ECHO.
GOTO :STEP-5


:STEP-5
REM  Limit memory - RAM : 200 MB
REM Always restart container when errors/down/reboot server
ECHO Step 5/5: Connect to Ubuntu Server and start OMS System
CALL ssh -i "%Url%" ubuntu@%DnsServer% "sudo docker rm csms.oms --force; sudo docker rmi thuydx9598/csms.oms --force; sudo docker run -m 200M -e TZ=Asia/Phnom_Penh -d --restart always -p %Port%:80 --name csms.oms thuydx9598/csms.oms"
ECHO.
PAUSE
EXIT