#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/core/aspnet:3.1-buster-slim AS base
RUN apt-get update && apt-get -y install libgdiplus
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/core/sdk:3.1-buster AS build
WORKDIR /src
COPY ["CdnApi/CdnApi.csproj", "CdnApi/"]
COPY ["CdnApi.Framework/CdnApi.Framework.csproj", "CdnApi.Framework/"]
COPY ["CdnApi.Business/CdnApi.Business.csproj", "CdnApi.Business/"]
COPY ["CdnApi.CrossCutting/CdnApi.CrossCutting.csproj", "CdnApi.CrossCutting/"]
COPY ["CdnApi.Data/CdnApi.Data.csproj", "CdnApi.Data/"]
COPY ["CdnApi.Common/CdnApi.Common.csproj", "CdnApi.Common/"]
COPY ["CdnApi.Constants/CdnApi.Constants.csproj", "CdnApi.Constants/"]
RUN dotnet restore "CdnApi/CdnApi.csproj"
COPY . .
WORKDIR "/src/CdnApi"
RUN dotnet build "CdnApi.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "CdnApi.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "CdnApi.dll"]