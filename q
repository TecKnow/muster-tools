[1mdiff --git a/muster_react/public/index.html b/muster_react/public/index.html[m
[1mindex d47601b..d2305e0 100644[m
[1m--- a/muster_react/public/index.html[m
[1m+++ b/muster_react/public/index.html[m
[36m@@ -1,15 +1,18 @@[m
[31m-<!doctype html>[m
[32m+[m[32m<!DOCTYPE html>[m
 <html lang="en">[m
   <head>[m
[31m-    <meta charset="utf-8">[m
[31m-    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">[m
[31m-    <meta name="theme-color" content="#000000">[m
[32m+[m[32m    <meta charset="utf-8" />[m
[32m+[m[32m    <meta[m
[32m+[m[32m      name="viewport"[m
[32m+[m[32m      content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"[m
[32m+[m[32m    />[m
[32m+[m[32m    <meta name="theme-color" content="#000000" />[m
     <!--[m
       manifest.json provides metadata used when your web app is added to the[m
       homescreen on Android. See https://developers.google.com/web/fundamentals/engage-and-retain/web-app-manifest/[m
     -->[m
[31m-    <link rel="manifest" href="%PUBLIC_URL%/manifest.json">[m
[31m-    <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">[m
[32m+[m[32m    <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />[m
[32m+[m[32m    <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico" />[m
     <!--[m
       Notice the use of %PUBLIC_URL% in the tags above.[m
       It will be replaced with the URL of the `public` folder during the build.[m
[36m@@ -19,7 +22,6 @@[m
       work correctly both with client-side routing and a non-root public URL.[m
       Learn how to configure a non-root public URL by running `npm run build`.[m
     -->[m
[31m-    <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" rel="stylesheet">[m
     <title>React App</title>[m
   </head>[m
   <body>[m
