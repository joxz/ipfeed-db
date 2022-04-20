import { healthcheck } from '../lib/table.mjs';
import { client } from '../lib/connection.mjs';
import { healthCheckFailed } from '../lib/responses.mjs';

export default async function (context, req) {
  try {
    await healthcheck(client);
    return {
      status: 204,
    };
  } catch (err) {
    return healthCheckFailed();
  }
}
