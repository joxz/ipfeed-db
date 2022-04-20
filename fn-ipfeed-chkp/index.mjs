import { getEntities } from '../lib/table.mjs';
import { client } from '../lib/connection.mjs';
import { sendSuccess, entityNotFound } from '../lib/responses.mjs';
import { formatCheckpoint } from '../lib/format.mjs';

export default async function (context, req) {
  try {
    const entities = await getEntities(client);
    const body = await formatCheckpoint(entities);

    return sendSuccess(body);
  } catch (err) {
    return entityNotFound();
  }
}
