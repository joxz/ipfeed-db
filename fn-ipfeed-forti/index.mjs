import { getEntities } from '../lib/table.mjs';
import { client } from '../lib/connection.mjs';
import { entityNotFound, sendPlainText } from '../lib/responses.mjs';
import { formatFortigate } from '../lib/format.mjs';

export default async function (context, req) {
  try {
    let entities = '';
    if (context.bindingData.collection) {
      entities = await getEntities(client, {
        queryOptions: {
          filter: `PartitionKey eq '${context.bindingData.collection}'`,
        },
      });
    } else {
      entities = await getEntities(client);
    }
    context.log(entities);
    const body = await formatFortigate(entities);
    return sendPlainText(body);
  } catch (err) {
    return entityNotFound();
  }
}
