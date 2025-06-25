import React from 'react';
import type { Duration as DurationType, DurationValueType } from '../types';
import { durationToValueTypes } from '@/util';

function DurationValue({ valueType }: { valueType: DurationValueType }) {
  return (
    <>
      {valueType.value}
      <sup className="font-bold">{valueType.type}</sup>
    </>
  );
}

type DurationProps = {
  duration: DurationType | undefined | null;
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
