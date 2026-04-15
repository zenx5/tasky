FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY ["TodoListApi.csproj", "./"]
RUN dotnet restore
COPY . .
RUN dotnet publish -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=build /app/publish .
RUN touch tasks.db && chmod 666 tasks.db
# Forzamos a que escuche en el puerto 80 interno
ENV ASPNETCORE_URLS=http://+:80 
EXPOSE 80
ENTRYPOINT ["dotnet", "TodoListApi.dll"]