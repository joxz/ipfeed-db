export const getEntities = async (client, query) => {
  try {
    const entities = !query ? await client.listEntities() : await client.listEntities(query);
    const result = [];
    for await (const entity of entities) {
      const formattedentity = {
        partitionKey: entity.partitionKey,
        rowKey: entity.rowKey,
        ip: entity.ip,
        description: entity.description,
        timestamp: entity.timestamp,
      };
      result.push(formattedentity);
    }

    return result;
  } catch (err) {
    throw err;
  }
};

export const getOneEntity = async (client, pkey, rkey) => {
  try {
    const entity = await client.getEntity(pkey, rkey);

    return {
      partitionKey: entity.partitionKey,
      rowKey: entity.rowKey,
      ip: entity.ip,
      description: entity.description,
      timestamp: entity.timestamp,
    };
  } catch (err) {
    throw err;
  }
};

export const getPartitionKeys = async (client) => {
  try {
    const result = new Set();
    const keys = await client.listEntities({
      queryOptions: {
        select: ['PartitionKey'],
      },
    });
    for await (const key of keys) {
      result.add(key.partitionKey);
    }

    return [...result];
  } catch (err) {
    throw err;
  }
};

export const addEntity = async (client, obj) => {
  try {
    return await client.createEntity(obj);
  } catch (err) {
    throw err;
  }
};

export const rmEntity = async (client, pkey, rkey) => {
  try {
    return await client.deleteEntity(pkey, rkey);
  } catch (err) {
    throw err;
  }
};

export const updEntity = async (client, obj) => {
  try {
    return await client.updateEntity(obj, 'Replace');
  } catch (err) {
    throw err;
  }
};

export const findIP = async (client, ip) => {
  try {
    const entities = await client.listEntities({
      queryOptions: {
        filter: `ip eq '${ip}'`,
      },
    });
    const result = [];
    for await (const entity of entities) {
      const formattedentity = {
        partitionKey: entity.partitionKey,
        rowKey: entity.rowKey,
        ip: entity.ip,
        description: entity.description,
        timestamp: entity.timestamp,
      };
      result.push(formattedentity);
    }

    return result;
  } catch (err) {
    throw err;
  }
};

export const healthcheck = async (client) => {
  try {
    /*
      Two actions, because creating and deleting entities in one transaction works in Azurite, but fails in Azure functions
      Error Message: Two actions with the same rowKeys can't be used in one transaction
    */
    const actions1 = [
      ['create', { partitionKey: 'healthcheck', rowKey: '2599bf3d-2d6d-4963-8c89-b30b4662ae94' }],
      ['create', { partitionKey: 'healthcheck', rowKey: '6e4cd843-5f2d-4ba5-bd5f-2ce6bda2797c' }],
    ];
    const actions2 = [
      ['delete', { partitionKey: 'healthcheck', rowKey: '2599bf3d-2d6d-4963-8c89-b30b4662ae94' }],
      ['delete', { partitionKey: 'healthcheck', rowKey: '6e4cd843-5f2d-4ba5-bd5f-2ce6bda2797c' }],
    ];

    await client.submitTransaction(actions1);
    await client.submitTransaction(actions2);

    return void true;
  } catch (err) {
    throw err;
  }
};
