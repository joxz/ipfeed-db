export const noValidQS = () => {
  return {
    status: 400,
    body: JSON.stringify({
      errorCode: 1336,
      message: 'Not a valid query string',
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  };
};

export const noValidIP = () => {
  return {
    status: 400,
    body: JSON.stringify({
      errorCode: 1336,
      message: 'Not a valid IP or CIDR address',
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  };
};

export const entityNotFound = () => {
  return {
    status: 400,
    body: JSON.stringify({
      errorCode: 1337,
      message: 'Entity not found',
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  };
};

export const descriptionNotEmpty = () => {
  return {
    status: 400,
    body: JSON.stringify({
      errorCode: 1338,
      message: 'Description cannot be empty',
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  };
};

export const healthCheckFailed = () => {
  return {
    status: 400,
    body: JSON.stringify({
      errorCode: 1339,
      message: 'Healthcheck failed',
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  };
};

export const sendSuccess = (body) => {
  return {
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  };
};

export const sendCreated = (body) => {
  return {
    status: 201,
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  };
};

export const sendPlainText = (body) => {
  return {
    body: body,
    headers: {
      'Content-Type': 'text/plain',
    },
  };
};
