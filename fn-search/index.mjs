import { findIP } from '../lib/table.mjs';
import { client } from '../lib/connection.mjs';
import { entityNotFound, sendSuccess, noValidIP, noValidQS } from '../lib/responses.mjs';
import { isIP } from 'is-ip';
import checkCidr from 'is-cidr';

export default async function (context, req) {
  try {
    let body = '';
    if (context.bindingData.query.q) {
      if (
        isIP(context.bindingData.query.q) ||
        checkCidr.v4(context.bindingData.query.q) ||
        checkCidr.v6(context.bindingData.query.q)
      ) {
        body = await findIP(client, context.bindingData.query.q);
      } else {
        return noValidIP();
      }
    } else {
      return noValidQS();
    }

    return sendSuccess(body);
  } catch (err) {
    return entityNotFound();
  }
}
