import { getPartitionKeys } from './table.mjs';
import { client } from './connection.mjs';
import { v5 as uuidv5 } from 'uuid';
import { validate as uuidValidate } from 'uuid';

export const formatCheckpoint = async (payload) => {
  try {
    const partitions = await getPartitionKeys(client);

    const filterByCollection = (name) => {
      let arr = [];
      payload.filter((element) => {
        if (element.partitionKey === name) {
          arr.push(element.ip);
        }
      });
      return arr;
    };

    /*
    Generates a permanent UUIDv5 from the collection name and predefined namespace, so the UUID never changes for a given collection name
    */
    const collectionUUID = (name) => {
      const namespace = 'd3486ae9-136e-5856-bc42-212385ea7970';
      const uuid = uuidv5(name, namespace);
      if (uuidValidate(uuid)) {
        return uuid;
      } else {
        throw new Error('UUID not valid');
      }
    };

    const dcobjects = partitions.map((element) => ({
      name: element,
      id: collectionUUID(element),
      description: `${element} IP feed`,
      ranges: filterByCollection(element),
    }));

    return {
      version: '1.0',
      description: 'IPDB IP feed',
      objects: dcobjects,
    };
  } catch (err) {
    throw err;
  }
};

export const formatFortigate = async (payload) => {
  try {
    return `${payload.map((el) => el.ip).join('\n')}`;
  } catch (err) {
    throw err;
  }
};
