import { getEntities } from '../lib/table.mjs';
import { client } from '../lib/connection.mjs';

export default async function (context, req) {
  const entities = await getEntities(client);
  const body = {
    entities: entities.length,
    context: context,
  };

  return {
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  };
}
