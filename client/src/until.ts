import type { Duration, DurationValueType } from './types';

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
  const years = Math.floor(diffInDays / 365);
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

const durationToSecondsDuration = (duration: Duration): number => {
  let result: number = 0;
  if (duration.milliseconds) {
    result = duration.milliseconds / 1000;
  }
  if (duration.seconds) {
    result += duration.seconds;
  }
  if (duration.minutes) {
    result += duration.minutes * 60;
  }
  if (duration.hours) {
    result += duration.hours * 1440;
  }
  if (duration.years) {
    result += duration.years * 525600;
  }
  return result;
};

const durationToValueTypes = (duration: Duration) => {
  const valueTypes: DurationValueType[] = [];
  if (duration.years) valueTypes.push({ value: duration.years, type: 'y' });
  if (duration.days) valueTypes.push({ value: duration.days, type: 'd' });
  if (duration.hours) valueTypes.push({ value: duration.hours, type: 'h' });
  if (duration.minutes) valueTypes.push({ value: duration.minutes, type: 'm' });
  if (duration.seconds) valueTypes.push({ value: duration.seconds, type: 's' });
  return valueTypes;
};

const durationToString = (duration: Duration) => {
  const valueTypes = durationToValueTypes(duration);
  const result = valueTypes.map((vt) => `${vt.value}${vt.type}`).join(' ');
  // const result = valueTypes.flatMap((valueType, index) => {
  //   const vtString = `${valueType.value}${valueType.type}`;
  //   if(index === 0) {
  //     return [vtString]
  //   }
  //   return [' ', vtString]
  // })
  return result;
};

function lowercaseFirstChar(str: string): string {
  if (!str) {
    throw new Error('Unexpected null or empty string:');
  }
  return str.charAt(0).toLowerCase() + str.slice(1);
}

export {
  formatDatetime,
  nullToZero,
  timeDuration,
  lowercaseFirstChar,
  durationToSecondsDuration,
  durationToValueTypes,
  durationToString,
};
