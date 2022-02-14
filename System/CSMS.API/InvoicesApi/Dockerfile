#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/core/aspnet:3.1-buster-slim AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/core/sdk:3.1-buster AS build
WORKDIR /src
COPY ["InvoicesApi/InvoicesApi.csproj", "InvoicesApi/"]
COPY ["InvoicesApi.Data/InvoicesApi.Data.csproj", "InvoicesApi.Data/"]
COPY ["InvoicesApi.Common/InvoicesApi.Common.csproj", "InvoicesApi.Common/"]
COPY ["InvoicesApi.Constants/InvoicesApi.Constants.csproj", "InvoicesApi.Constants/"]
COPY ["InvoicesApi.Framework/InvoicesApi.Framework.csproj", "InvoicesApi.Framework/"]
RUN dotnet restore "InvoicesApi/InvoicesApi.csproj"
COPY . .
WORKDIR "/src/InvoicesApi"
RUN dotnet build "InvoicesApi.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "InvoicesApi.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "InvoicesApi.dll"]