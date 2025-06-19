import { render, cleanup, screen, within } from '@testing-library/react';
import Duration from '../duration';
import type { Duration as DurationType } from '@/types';

function testDurationTypeValue(
  element: HTMLElement,
  value: string,
  type: string
) {
  console.log(
    'element.childNodes',
    Array.from(element.childNodes).map((cn) =>
      cn.nodeType === Node.ELEMENT_NODE
        ? (cn as HTMLElement).outerHTML
        : cn.textContent
    )
  );
  const valueNode = Array.from(element.childNodes).find(
    (node) =>
      node.nodeType === Node.TEXT_NODE &&
      node.textContent === value &&
      node.nextSibling?.textContent === type
  );
  if (!valueNode) {
    throw new Error(`Text node '${value}' not found within element`);
  }
  expect(valueNode.textContent).toBe(value);
  const durationType = within(element).getByText(type, {
    selector: 'sup',
  });
  expect(durationType).toBeInTheDocument();
  expect(durationType.tagName).toBe('SUP');
  expect(durationType.textContent).toBe(type);
  expect(valueNode.nextSibling).toBe(durationType);
}

afterEach(() => {
  cleanup();
});

describe('Duration component', () => {
  it('should render seconds correctly', async () => {
    const durationValue: DurationType = {
      milliseconds: 700,
      seconds: 50,
      minutes: null,
      hours: null,
      days: null,
      years: null,
    };
    render(
      <div data-testid="test-div">
        <Duration duration={durationValue} />
      </div>
    );
    const testDiv = screen.getByTestId('test-div');
    console.log('testDiv', testDiv.outerHTML);
    testDurationTypeValue(testDiv, '50', 's');
    expect(testDiv.textContent).toBe('50s');
  });

  it('should not render only milliseconds', async () => {
    const durationValue: DurationType = {
      milliseconds: 700,
      seconds: null,
      minutes: null,
      hours: null,
      days: null,
      years: null,
    };
    render(
      <div data-testid="test-div">
        <Duration duration={durationValue} />
      </div>
    );
    const testDiv = screen.getByTestId('test-div');
    expect(testDiv).toBeEmptyDOMElement();
  });

  it('should not render a Duration with a undefined duration', async () => {
    render(
      <div data-testid="test-div">
        <Duration duration={undefined} />
      </div>
    );
    const testDiv = screen.getByTestId('test-div');
    expect(testDiv).toBeEmptyDOMElement();
  });

  it('should render multiple duration types, no years correctly', async () => {
    const durationValue: DurationType = {
      milliseconds: 700,
      seconds: 50,
      minutes: 45,
      hours: 9,
      days: 2,
      years: null,
    };
    render(
      <div data-testid="test-div">
        <Duration duration={durationValue} />
      </div>
    );

    const testDiv = screen.getByTestId('test-div');
    console.log(`testDiv.textContent: '${testDiv.textContent}'`);

    testDurationTypeValue(testDiv, '50', 's');
    testDurationTypeValue(testDiv, '45', 'm');
    testDurationTypeValue(testDiv, '9', 'h');
    testDurationTypeValue(testDiv, '2', 'd');

    expect(testDiv.textContent).toBe('2d 9h 45m 50s');
  });

  it('should render all duration types.', async () => {
    const durationValue: DurationType = {
      milliseconds: 654,
      seconds: 6,
      minutes: 8,
      hours: 13,
      days: 15,
      years: 2,
    };
    render(
      <div data-testid="test-div">
        <Duration duration={durationValue} />
      </div>
    );

    const testDiv = screen.getByTestId('test-div');
    console.log(`testDiv.textContent: '${testDiv.textContent}'`);

    testDurationTypeValue(testDiv, '6', 's');
    testDurationTypeValue(testDiv, '8', 'm');
    testDurationTypeValue(testDiv, '13', 'h');
    testDurationTypeValue(testDiv, '15', 'd');
    testDurationTypeValue(testDiv, '2', 'y');

    expect(testDiv.textContent).toBe('2y 15d 13h 8m 6s');
  });
});
