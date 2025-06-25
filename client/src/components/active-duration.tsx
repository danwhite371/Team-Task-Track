import { useEffect, useState } from 'react';
import { timeDuration } from '../util';
import Duration from './duration';

type ActiveDurationProps = {
  lastTime: Date;
  secondsDuration: number | null;
};
function ActiveDuration({ lastTime, secondsDuration }: ActiveDurationProps) {
  if (secondsDuration == null) {
    secondsDuration = 0;
  }
  const [dur, setDur] = useState<number>(
    secondsDuration * 1000 + (new Date().getTime() - lastTime.getTime())
  );
  useEffect(() => {
    const interval = setInterval(() => {
      setDur(
        secondsDuration * 1000 + (new Date().getTime() - lastTime.getTime())
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return <Duration duration={timeDuration(dur)} />;
}

export default ActiveDuration;
