import { render, cleanup, screen, act } from '@testing-library/react';
import ActiveDuration from '../active-duration';

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
  cleanup();
});

interface ChangeTimeProps {
  now: Date;
  minutes?: number | undefined;
  seconds?: number | undefined;
}
function goBack({ now, minutes, seconds }: ChangeTimeProps) {
  if (!minutes && !seconds) throw new Error('goBack needs minutes or seconds');
  const back = new Date(now);
  if (minutes) {
    back.setMinutes(back.getMinutes() - minutes);
  }
  if (seconds) {
    back.setSeconds(back.getSeconds() - seconds);
  }
  return back;
}

// create a time then go back a few minutes, add a 5 minute and some seconds duration
describe('ActiveDuration component', () => {
  it('should render using a startDate and a zero duration', async () => {
    const now = new Date();
    const back = goBack({ now, minutes: 7, seconds: 37 });

    render(
      <div data-testid="test-div">
        <ActiveDuration lastTime={back} secondsDuration={0} />
      </div>
    );
    const testDiv = screen.getByTestId('test-div');
    console.log('testDiv.textContent', testDiv.textContent);
    expect(testDiv.textContent).toBe('7m 37s');
  });

  it('should render using a startDate and a duration in seconds', async () => {
    const now = new Date();
    const back = goBack({ now, minutes: 2 });
    const durationPoint = goBack({ now, minutes: 3, seconds: 37 });
    const secondsDuration = (now.getTime() - durationPoint.getTime()) / 1000;

    render(
      <div data-testid="test-div">
        <ActiveDuration lastTime={back} secondsDuration={secondsDuration} />
      </div>
    );
    const testDiv = screen.getByTestId('test-div');
    console.log('testDiv.textContent', testDiv.textContent);
    expect(testDiv.textContent).toBe('5m 37s');
  });

  it('should increase the duration by one second each second', async () => {
    const now = new Date();
    const back = goBack({ now, minutes: 5 });
    const durationPoint = goBack({ now, minutes: 23, seconds: 6 });
    const secondsDuration = (now.getTime() - durationPoint.getTime()) / 1000;

    render(
      <div data-testid="test-div">
        <ActiveDuration lastTime={back} secondsDuration={secondsDuration} />
      </div>
    );
    let testDiv = screen.getByTestId('test-div');
    console.log('testDiv.textContent', testDiv.textContent);
    expect(testDiv.textContent).toBe('28m 6s');

    act(() => {
      jest.advanceTimersByTime(1000);
      // advance by 1 second
    });

    testDiv = screen.getByTestId('test-div');
    console.log('testDiv.textContent', testDiv.textContent);
    expect(testDiv.textContent).toBe('28m 7s');

    act(() => {
      jest.advanceTimersByTime(15000 + 60000 * 5);
      // 28m 7s +
      // 5m 15s = 33m 22s
    });

    testDiv = screen.getByTestId('test-div');
    console.log('testDiv.textContent', testDiv.textContent);
    expect(testDiv.textContent).toBe('33m 22s');
  });
});
