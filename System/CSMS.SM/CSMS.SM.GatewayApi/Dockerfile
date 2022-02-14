FROM mcr.microsoft.com/dotnet/core/aspnet:2.2-stretch-slim AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/core/sdk:2.2-stretch AS build
WORKDIR /src
COPY ["StoreGateway/StoreGateway.csproj", "StoreGateway/"]
RUN dotnet restore "StoreGateway/StoreGateway.csproj"
COPY . .
WORKDIR "/src/StoreGateway"
RUN dotnet build "StoreGateway.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "StoreGateway.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "StoreGateway.dll"]