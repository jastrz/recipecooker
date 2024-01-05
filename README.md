# RecipeCooker

Simple web project that aims to simplify choosing and generating recipes for users' taste.

Stack: .NET 7, EF, PostgreSQL, Angular 15

# How to run

development:

```
0. docker-compose up (or run postgres in another way)
1. cd client && ng serve
2. cd API && dotnet run

```

build:

```
1. run postgres
2. start .NET app using .exe or .dll on port 5002
```

To be able to generate recipes you need to specify your OpenAI secret before running project. This can be done by adding "OpenAI:Secret" in appsettings.json or by using e.g. safe storage.

To be able to sign in using Google you need to create project in google console, assign client secret/id inside source code:\
client: environment.ts\
backend: "GoogleAuthentication:ClientId" in appsetting.json or e.g. safe storage.

and configure credentials to run for desired addresses.

# How to build

Build client project first - it will be placed in wwwroot in API project, then build .NET project (API is entry point)

```
cd client && ng build
dotnet publish -c Release -o publish recipecooker.sln
```

Happy cooking!
