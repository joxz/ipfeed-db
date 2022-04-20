import { getEntities, getOneEntity } from '../lib/table.mjs';
import { client } from '../lib/connection.mjs';
import { sendSuccess, entityNotFound } from '../lib/responses.mjs';

export default async function (context, req) {
  try {
    let body = '';

    /* if request params have a collection and NO ID then get collection */
    if (!context.bindingData.id && context.bindingData.collection) {
      body = await getEntities(client, {
        queryOptions: {
          filter: `PartitionKey eq '${context.bindingData.collection}'`,
        },
      });
    } else if (!context.bindingData.id && !context.bindingData.collection) {
      /* if request params have NO collection and NO ID then get all */
      body = await getEntities(client);
    } else {
      /* if request params have a collection and an ID then get one */
      body = await getOneEntity(client, context.bindingData.collection, context.bindingData.id);
    }

    return sendSuccess(body);
  } catch (err) {
    return entityNotFound();
  }
}
