const stringify = (obj: any) => JSON.stringify(obj, null, 2);

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function range(size: number, startAt: number = 0): ReadonlyArray<number> {
  return [...Array(size).keys()].map((i) => i + startAt);
}

export { stringify, sleep, range };
