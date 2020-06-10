export const normalizePort = (port: any): number => {
  const parsed: any = parseInt(port, 10);

  if (isNaN(parsed)) {
    return port;
  }

  if (parsed >= 0) {
    return parsed;
  }

  return port;
};
