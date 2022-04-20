import { TableClient } from '@azure/data-tables';
import * as tbl from './table.mjs';
import { v4 as uuidv4 } from 'uuid';
import { formatCheckpoint, formatFortigate } from './format.mjs';

const connectionString =
  process.env.ENV === 'DEV' ? 'UseDevelopmentStorage=true' : 'process.env.CONNECTIONSTRING';

const tableName = 'ipdb';
const client = TableClient.fromConnectionString(connectionString, tableName);

const res = await tbl.getEntities(client);
/*
const filtered = await tbl.getEntities(client, {
  queryOptions: {
    filter: `PartitionKey eq 'cloudflare'`,
    select: ['PartitionKey', 'ip'],
  },
});
*/
/*
const keys = await tbl.getPartitionKeys(client);

const one = await tbl.getOneEntity(client, 'cloudflare', '437a14d2-7abd-4447-a524-dca2b6554bf9');


const add = await tbl.addEntity(client, {
  partitionKey: 'xxx',
  rowKey: uuidv4(),
  ip: '8.8.8.8',
  description: 'google dns',
});

const rm = await tbl.rmEntity(client, add.partitionKey, add.rowKey);
console.log(rm);
*/
/*
const search = await tbl.findIP(client, '1.1.1.1');
console.log(search);
*/
/*
const hc = await tbl.healthcheck(client);

console.log(hc.status);
*/

const fmt = await formatCheckpoint(res);
//const fmt = await formatFortigate(filtered);
console.log(fmt);
