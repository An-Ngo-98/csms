#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/core/aspnet:3.1-buster-slim AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/core/sdk:3.1-buster AS build
WORKDIR /src
COPY ["UsersApi/UsersApi.csproj", "UsersApi/"]
COPY ["UsersApi.Business/UsersApi.Business.csproj", "UsersApi.Business/"]
COPY ["UsersApi.Constants/UsersApi.Constants.csproj", "UsersApi.Constants/"]
COPY ["UsersApi.Data/UsersApi.Data.csproj", "UsersApi.Data/"]
COPY ["UsersApi.Common/UsersApi.Common.csproj", "UsersApi.Common/"]
COPY ["UsersApi.Framework/UsersApi.Framework.csproj", "UsersApi.Framework/"]
RUN dotnet restore "UsersApi/UsersApi.csproj"
COPY . .
WORKDIR "/src/UsersApi"
RUN dotnet build "UsersApi.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "UsersApi.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "UsersApi.dll"]