import { TableClient } from '@azure/data-tables';

const connectionString = process.env.CONNECTIONSTRING;

const tableName = process.env.TABLENAME;

export const client = TableClient.fromConnectionString(connectionString, tableName);
