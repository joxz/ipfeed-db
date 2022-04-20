import { addEntity } from '../lib/table.mjs';
import { client } from '../lib/connection.mjs';
import { v4 as uuidv4 } from 'uuid';
import { sendCreated, noValidIP } from '../lib/responses.mjs';
import { isIP } from 'is-ip';
import checkCidr from 'is-cidr';

export default async function (context, req) {
  try {
    const uuid = uuidv4();
    let body = '';

    /* check for valid IP or CIDR address in request body */
    if (
      isIP(context.bindingData.ip) ||
      checkCidr.v4(context.bindingData.ip) ||
      checkCidr.v6(context.bindingData.ip)
    ) {
      const entity = {
        partitionKey: context.bindingData.collection,
        rowKey: uuid,
        ip: context.bindingData.ip,
        description: context.bindingData.description,
      };
      await addEntity(client, entity);
      body = entity;
    } else {
      return noValidIP();
    }

    return sendCreated(body);
  } catch (err) {
    throw err;
  }
}
