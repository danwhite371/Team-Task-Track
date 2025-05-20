const stringify = (obj: any) => JSON.stringify(obj, null, 2);

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export { stringify, sleep };
