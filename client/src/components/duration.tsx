import { useEffect, useState } from 'react';
import type { Duration as DurationType } from '../types';
import { timeDuration } from '../until';

type ActiveDurationProps = {
  lastTime: Date;
  secondsDuration: number;
};
function ActiveDuration({ lastTime, secondsDuration }: ActiveDurationProps) {
  const [dur, setDur] = useState<number>(
    secondsDuration * 1000 + (new Date().getTime() - lastTime.getTime())
  );
  useEffect(() => {
    const interval = setInterval(() => {
      setDur((prev) => {
        return prev + 1000;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return <Duration duration={timeDuration(dur)} />;
}

type DurationValueProps = {
  value: number | null | undefined;
  type: string;
};
function DurationValue({ value, type }: DurationValueProps) {
  if (value == null || value == 0) return;

  return (
    <>
      {value}
      <sup className="font-bold">{type}</sup>
    </>
  );
}

type Duration = {
  milliseconds: number;
  seconds: number;
  minutes: number;
  hours: number;
  days: number;
  years: number;
};

type DurationProps = {
  duration: DurationType | undefined;
};
function Duration({ duration }: DurationProps) {
  if (!duration) return;
  return (
    <>
      <DurationValue value={duration.years} type="y" />
      &nbsp;
      <DurationValue value={duration.days} type="d" />
      &nbsp;
      <DurationValue value={duration.hours} type="h" />
      &nbsp;
      <DurationValue value={duration.minutes} type="m" />
      &nbsp;
      <DurationValue value={duration.seconds} type="s" />
      &nbsp;
    </>
  );
}

export { Duration, ActiveDuration };
