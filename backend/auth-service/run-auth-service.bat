@echo off
echo Starting Auth Service...

REM Set Java classpath
set CLASSPATH=target/classes;target/dependency/*

REM Set Spring Boot main class
set MAIN_CLASS=com.smartoutlet.auth.AuthServiceApplication

REM Set Spring profile
set SPRING_PROFILES_ACTIVE=dev

REM Run the application
java -cp %CLASSPATH% -Dspring.profiles.active=%SPRING_PROFILES_ACTIVE% %MAIN_CLASS%

pause 