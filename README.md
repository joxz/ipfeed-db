# ipfeed-db

Azure function to provide IP feeds for Checkpoint (Generic Data Center Object) and Fortigate (Threat feeds) firewalls

IP lists for the feeds are managed via the REST Endpoints, and grouped into collections (e.g. `azure`, `cloudflare`, `tor-nodes`, `blacklist`)

Collections are stored in Azure Table Storage (part of Azure Storage Account), which offers a NoSQL-type storage API to functions for an affordable price.

## IP feed format

### Checkpoint

The IP feed can be used with Gaia `R81+`, see [Generic Data Center feature](https://supportcenter.checkpoint.com/supportcenter/portal?eventSubmit_doGoviewsolutiondetails=&solutionid=sk167210)

Format:

- `Content-Type`: `application/json`
- UUIDs of objects are UUIDv5 with a predefined namespace and the collection name, forcing non-changing UUIDs per collection
- Feed for all collections in the Table 

Feed size limitations ([sk167210](https://supportcenter.checkpoint.com/supportcenter/portal?eventSubmit_doGoviewsolutiondetails=&solutionid=sk167210)): 

> - Policy Installation failed when maximum number dynamic objects was reached (The default value is 5000), [sk167576](https://supportcenter.checkpoint.com/supportcenter/portal?eventSubmit_doGoviewsolutiondetails=&solutionid=sk167576)
> - We recommend that you avoid more than 30,000 changes per update as it will affect user experience

### Fortigate

The IP feed can be used with FortiOS `6.2.0+`, see [Threat feeds](https://docs.fortinet.com/document/fortigate/6.2.0/cookbook/9463/threat-feeds)

Format:

- Retrievable feeds per collection (e.g. only cloudflare IPs in a feed)
- `Content-Type`: `text/plain`
- Line ending: `\n`

Feed size limitations:

> The file is limited to 10 MB or 128 × 1024 (131072) entries, whichever limit is hit first

More info: [Administration Guide - Threat feeds - 7.0.5](https://docs.fortinet.com/document/fortigate/7.0.5/administration-guide/9463/threat-feeds)

## Table Schema

| Table Schema | Convention | Examples |
| --- | --- | --- |
| partitionKey | Collection Name | azure, cloudflare, zscaler,... |
| rowKey | UUIDv4 (auto-generated) | `c6526f07-e030-4170-8829-10ef8a720215` |
| timestamp | auto-generated | `2022-04-07T12:18:38.1162658Z` | 
| ip | IPv4 or IPv6 address in IP or CIDR notation | `1.1.1.1`, `165.225.72.0/22`, `2606:4700:4700::1111`, `2c0f:f248::/32` |
| description | Description | IP Address for Service X |

## REST Endpoints

`RoutePrefix`: `/api/v1`

Function Access Level: The POST, PUT, DELETE functions require a function key either as a query string `?code=xxxxxxxxxx` or as `X-Functions-Key` header, see  [API key authorization](https://docs.microsoft.com/en-us/azure/azure-functions/functions-bindings-http-webhook-trigger?tabs=in-process%2Cfunctionsv2&pivots=programming-language-javascript#api-key-authorization)

| Operation | Endpoint | Example |
| --- | --- | --- |
| List all collections and all IPs | `GET /ipdb/` | `GET /ipdb/` |
| List all IPs in a collection | `GET /ipdb/{collection}` | `GET /ipdb/azure` |
| List specific IP in a collection | `GET /ipdb/{collection}/{uuid}` | `GET /ipdb/azure/c6526f07-e030-4170-8829-10ef8a720215` |
| Add an IP to a collection (request body has the IP and description) | `POST /ipdb/{collection}` | `POST /ipdb/cloudflare`
| Modify IPs (new info in request body) | `PUT, DELETE /ipdb/{collection}/{uuid}` | `PUT, DELETE /ipdb/azure/c6526f07-e030-4170-8829-10ef8a720215` |
| Search an IP | `GET /search?q={ip}` | `GET /search?q=165.225.72.0/22` |
| Healthcheck Endpoint (for monitoring systems) | `GET /health` | |
| Checkpoint IPfeed | `GET /ipfeed/checkpoint` | |
| Fortigate IPfeed, collection is optional | `GET /ipfeed/fortigate/{collection}` | `GET /ipfeed/fortigate/cloudflare` |

## OpenAPI Specification

OpenAPI spec included in `openapi.json`. Can be viewed in [SwaggerUI](https://petstore.swagger.io/). Just insert the URL of the Github raw `openapi.json` at the top

## Postman Collection

Postman collection included as `az-func-ipdb.postman_collection.json` in this repo.

Also available via [Run in Postman](https://learning.postman.com/docs/publishing-your-api/run-in-postman/creating-run-button/) 

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/1824740-2d0a29dc-6f09-4c75-92e2-51468df97076?action=collection%2Ffork&collection-url=entityId%3D1824740-2d0a29dc-6f09-4c75-92e2-51468df97076%26entityType%3Dcollection%26workspaceId%3D9c3d051c-90a9-4248-b950-7da4ab8c3372)

## Setup

1. Clone repo
2. Create Azure Function and Storage Account (use VSCode with the Azure Functions extension)
3. Create Table in the Storage Account
4. Create environment variables as Application Setting (Function Configuration)
5. Deploy function to Azure

> :warning: Right now, only the connectionstring is supported to connect to a storage account. With minor modifications to `lib/connection.mjs`, all the [other authentication methods](https://docs.microsoft.com/en-us/javascript/api/@azure/data-tables/tableclient?view=azure-node-latest#@azure-data-tables-tableclient-constructor-1) can be used aswell.

### Environment Variables

`CONNECTIONSTRING`: Connection string to connect to the storage account

> :warning: Storage Account -> Access keys -> Copy Connection String

`TABLENAME`: Table name to be used to store sollections. **The table needs to be created manually**

### Github Actions Deployment

Set Github Secrets for the Repo:

- `AZURE_FUNCTIONAPP_NAME`: Resource name for the Azure function
- `AZURE_FUNCTIONAPP_PUBLISH_PROFILE`: Donwload publish Profile from the Azure function and paste here

Remove Application Setting `WEBSITE_RUN_FROM_PACKAGE`

## Dev Setup

### Setup Azurite for Azure Storage Emulation

Please see [Use the Azurite emulator for local Azure Storage development](https://docs.microsoft.com/en-us/azure/storage/common/storage-use-azurite?tabs=visual-studio-code) for setup information

Start Azurite:

```bash
az-func-ipdb$ azurite

Azurite Blob service is starting at http://127.0.0.1:10000
Azurite Blob service is successfully listening at http://127.0.0.1:10000
Azurite Queue service is starting at http://127.0.0.1:10001
Azurite Queue service is successfully listening at http://127.0.0.1:10001
Azurite Table service is starting at http://127.0.0.1:10002
Azurite Table service is successfully listening at http://127.0.0.1:10002
```

### Setup Azure Functions Tools

Please see [Install the Azure Functions Core Tools](https://docs.microsoft.com/en-us/azure/azure-functions/functions-run-local?tabs=v4%2Clinux%2Ccsharp%2Cportal%2Cbash#install-the-azure-functions-core-tools)

Start functions local:

```bash
az-func-ipdb$ func start

Functions:

  fn-addentity: [POST] http://localhost:7071/api/v1/ipdb/{collection:alpha}
  fn-debug: [GET] http://localhost:7071/api/v1/debug
  fn-getentities: [GET] http://localhost:7071/api/v1/ipdb/{collection:alpha}/{id:guid}
  fn-healthcheck: [GET] http://localhost:7071/api/v1/healthcheck
  fn-ipfeed-chkp: [GET] http://localhost:7071/api/v1/ipfeed/checkpoint
  fn-ipfeed-forti: [GET] http://localhost:7071/api/v1/ipfeed/fortigate{collection:alpha}
  fn-search: [GET] http://localhost:7071/api/v1/search
  fn-updentity: [PUT,DELETE] http://localhost:7071/api/v1/ipdb/{collection:alpha}/{id:guid}

For detailed output, run func with --verbose flag.
```

### Environment Variables

`.env` file can be used to set those variables or set the variables in `local.settings.json`

> :warning: If you want to test locally, environment variables regarding functions need to be set in `local.settings.json`, if you want to test a separate script, environment variables need to be set in `.env`

`CONNECTIONSTRING`: set to `UseDevelopmentStorage=true`

`TABLENAME`: set to `ipdb`

`ENV`: set to `DEV` in `local.settings.json`

### Example Data

Insert example data into Azureite:

```
# Start Azurite first
# Set Connectionstring and Tablename in .env

ENV=DEV node example-data/create.mjs
```