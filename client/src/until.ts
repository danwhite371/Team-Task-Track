function formatDatetime(value: string | undefined): string | undefined {
  if (value == undefined) return;
  const date = new Date(Number(value));
  return date.toLocaleString();
}

const nullToZero = (value: number | undefined | null) =>
  value == null ? 0 : value;

const timeDuration = (diffInMs: number) => {
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const years = diffInDays / 365;
  const milliseconds = diffInMs % 1000;
  const seconds = diffInSeconds % 60;
  const minutes = diffInMinutes % 60;
  const hours = diffInHours % 24;
  const days = diffInDays % 365;

  const duration = {
    milliseconds,
    seconds,
    minutes,
    hours,
    days,
    years,
  };
  return duration;
};

export { formatDatetime, nullToZero, timeDuration };
