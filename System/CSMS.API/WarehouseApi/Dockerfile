#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/core/aspnet:3.1-buster-slim AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/core/sdk:3.1-buster AS build
WORKDIR /src
COPY ["WarehouseApi/WarehouseApi.csproj", "WarehouseApi/"]
COPY ["WarehouseApi.Framework/WarehouseApi.Framework.csproj", "WarehouseApi.Framework/"]
COPY ["WarehouseApi.Data/WarehouseApi.Data.csproj", "WarehouseApi.Data/"]
COPY ["WarehouseApi.Common/WarehouseApi.Common.csproj", "WarehouseApi.Common/"]
COPY ["WarehouseApi.Constants/WarehouseApi.Constants.csproj", "WarehouseApi.Constants/"]
RUN dotnet restore "WarehouseApi/WarehouseApi.csproj"
COPY . .
WORKDIR "/src/WarehouseApi"
RUN dotnet build "WarehouseApi.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "WarehouseApi.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "WarehouseApi.dll"]