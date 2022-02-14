@ECHO OFF
TITLE "CONNECT TO AWS UBUNTUN VPS SERVER | Loading ..."

CD %~dp0

set DnsServer="ec2-52-74-41-113.ap-southeast-1.compute.amazonaws.com"
SET Url="secret-key\thuydao.pem"

CALL ssh -i "%Url%" ubuntu@%DnsServer%