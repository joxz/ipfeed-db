import { updEntity, rmEntity } from '../lib/table.mjs';
import { client } from '../lib/connection.mjs';
import { sendSuccess, descriptionNotEmpty, entityNotFound, noValidIP } from '../lib/responses.mjs';
import { isIP } from 'is-ip';
import checkCidr from 'is-cidr';

export default async function (context, req) {
  try {
    let body = '';

    const entity = {
      partitionKey: context.bindingData.collection,
      rowKey: context.bindingData.id,
      ip: context.bindingData.ip,
      description: context.bindingData.description,
    };

    /* if request method = PUT, update entity */
    if (context.bindings.req.method === 'PUT') {
      try {
        /* check for valid IP or CIDR address in request body */
        if (
          isIP(context.bindingData.ip) ||
          checkCidr.v4(context.bindingData.ip) ||
          checkCidr.v6(context.bindingData.ip)
        ) {
          /* Check if request body has a description */
          if (
            context.bindings.req.method === 'PUT' &&
            typeof context.bindingData.description === 'object'
          ) {
            return descriptionNotEmpty();
          }
        } else {
          return noValidIP();
        }

        await updEntity(client, entity);
        body = {
          partitionKey: context.bindingData.collection,
          rowKey: context.bindingData.id,
          ip: context.bindingData.ip,
          description: context.bindingData.description,
        };
      } catch (err) {
        return entityNotFound();
      }
    }

    /* if request method = DELETE, delete entity */
    if (context.bindings.req.method === 'DELETE') {
      try {
        await rmEntity(client, entity.partitionKey, entity.rowKey);
        body = {
          partitionKey: context.bindingData.collection,
          rowKey: context.bindingData.id,
        };
      } catch (err) {
        return entityNotFound();
      }
    }

    return sendSuccess(body);
  } catch (err) {
    throw err;
  }
}
