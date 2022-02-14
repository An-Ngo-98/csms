#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/core/aspnet:3.1-buster-slim AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/core/sdk:3.1-buster AS build
WORKDIR /src
COPY ["SystemApi/SystemApi.csproj", "SystemApi/"]
COPY ["SystemApi.Framework/SystemApi.Framework.csproj", "SystemApi.Framework/"]
COPY ["SystemApi.Data/SystemApi.Data.csproj", "SystemApi.Data/"]
COPY ["SystemApi.Common/SystemApi.Common.csproj", "SystemApi.Common/"]
COPY ["SystemApi.Business/SystemApi.Business.csproj", "SystemApi.Business/"]
COPY ["SystemApi.Constants/SystemApi.Constants.csproj", "SystemApi.Constants/"]
RUN dotnet restore "SystemApi/SystemApi.csproj"
COPY . .
WORKDIR "/src/SystemApi"
RUN dotnet build "SystemApi.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "SystemApi.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "SystemApi.dll"]