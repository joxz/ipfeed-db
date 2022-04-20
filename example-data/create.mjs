import { TableClient, TableServiceClient } from '@azure/data-tables';
import { v4 as uuidv4 } from 'uuid';
import 'dotenv/config';

const connectionString =
  process.env.ENV === 'DEV' ? 'UseDevelopmentStorage=true' : 'process.env.CONNECTIONSTRING';

const tablesvc = TableServiceClient.fromConnectionString(connectionString);
const tableName = 'ipdb';

const cftestdata = [
  '1.1.1.1',
  '103.21.244.0/22',
  '103.22.200.0/22',
  '103.31.4.0/22',
  '104.16.0.0/13',
  '104.24.0.0/14',
  '108.162.192.0/18',
  '2400:cb00::/32',
];

const aztestdata = [
  '13.65.107.32/28',
  '13.65.160.16/28',
  '20.60.0.0/16',
  '23.98.49.0/26',
  '40.83.225.32/28',
  '52.165.104.64/27',
  '137.116.2.0/25',
];

const zstestdata = [
  '165.225.72.0/22',
  '165.225.80.0/22',
  '147.161.166.0/23',
  '165.225.26.0/23',
  '104.129.193.65',
  '104.129.197.103',
];

(async function () {
  try {
    await tablesvc.deleteTable(tableName);
    await tablesvc.createTable(tableName);

    const client = TableClient.fromConnectionString(connectionString, tableName);

    const createExampleData = async (pkey, ip, descr) =>
      client.createEntity({
        PartitionKey: pkey,
        RowKey: uuidv4(),
        ip: ip,
        description: descr,
      });

    cftestdata.map((ip) => createExampleData('cloudflare', ip, 'cloudflare ips'));
    aztestdata.map((ip) => createExampleData('azure', ip, 'azure storage ips'));
    zstestdata.map((ip) => createExampleData('zscaler', ip, 'zscaler ips'));
  } catch (err) {
    throw err;
  }
})();
