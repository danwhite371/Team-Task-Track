import React from 'react';
import type { Duration as DurationType } from '../types';

interface DurationValueType {
  value: number;
  type: string;
}

const durationToValueTypes = (duration: DurationType) => {
  const valueTypes: DurationValueType[] = [];
  if (duration.years) valueTypes.push({ value: duration.years, type: 'y' });
  if (duration.days) valueTypes.push({ value: duration.days, type: 'd' });
  if (duration.hours) valueTypes.push({ value: duration.hours, type: 'h' });
  if (duration.minutes) valueTypes.push({ value: duration.minutes, type: 'm' });
  if (duration.seconds) valueTypes.push({ value: duration.seconds, type: 's' });
  return valueTypes;
};

function DurationValue({ valueType }: { valueType: DurationValueType }) {
  return (
    <>
      {valueType.value}
      <sup className="font-bold">{valueType.type}</sup>
    </>
  );
}

type DurationProps = {
  duration: DurationType | undefined;
};

function Duration({ duration }: DurationProps) {
  if (!duration) return;

  const valueTypes = durationToValueTypes(duration);
  const result = valueTypes.flatMap((valueType, index) => {
    if (index == 0) {
      return [<DurationValue key={valueType.type} valueType={valueType} />];
    }

    return [
      <React.Fragment key={`space-${index}`}> </React.Fragment>,
      [<DurationValue key={valueType.type} valueType={valueType} />],
    ];
  });
  return result;
}
{
  /* <React.Fragment key={`nbsp-${index}`}> </React.Fragment>, */
}
export default Duration;
