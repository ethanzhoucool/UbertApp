/**
 * @format
 */

import React, {useEffect, useState} from 'react';
import ReactTestRenderer from 'react-test-renderer';
import {SafeAreaInsetsContext} from 'react-native-safe-area-context';
import {Toast} from '../src/components/common/Toast';

const INSETS = {top: 0, right: 0, bottom: 0, left: 0};

/**
 * Mirrors how screens use <Toast>: visibility lives in the parent and
 * `onHide` is an inline arrow, so it is a new function on every render.
 * `rerenderEveryMs` simulates a parent that re-renders on a timer (e.g. the
 * ride screens, which re-render while the car marker animates).
 */
function Host({
  message = 'Trip link copied',
  rerenderEveryMs,
  onHidden,
}: {
  message?: string;
  rerenderEveryMs?: number;
  onHidden: () => void;
}) {
  const [visible, setVisible] = useState(true);
  const [, setTick] = useState(0);
  useEffect(() => {
    if (!rerenderEveryMs) {
      return;
    }
    const id = setInterval(() => setTick(t => t + 1), rerenderEveryMs);
    return () => clearInterval(id);
  }, [rerenderEveryMs]);
  return (
    <SafeAreaInsetsContext.Provider value={INSETS}>
      <Toast
        message={message}
        visible={visible}
        onHide={() => {
          setVisible(false);
          onHidden();
        }}
      />
    </SafeAreaInsetsContext.Provider>
  );
}

function isShowing(
  renderer: ReactTestRenderer.ReactTestRenderer,
  message = 'Trip link copied',
) {
  return renderer.root.findAllByProps({children: message}).length > 0;
}

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

async function mount(element: React.ReactElement) {
  let renderer: ReactTestRenderer.ReactTestRenderer | undefined;
  await ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(element);
  });
  return renderer!;
}

// Advance in small steps, each in its own act(), so React commits the
// parent's re-renders as they happen instead of batching them at the end.
async function advance(ms: number, stepMs = 50) {
  for (let elapsed = 0; elapsed < ms; elapsed += stepMs) {
    await ReactTestRenderer.act(() => {
      jest.advanceTimersByTime(stepMs);
    });
  }
}

test('hides itself after the default duration', async () => {
  const onHidden = jest.fn();
  const renderer = await mount(<Host onHidden={onHidden} />);
  expect(isShowing(renderer)).toBe(true);

  await advance(2500);

  expect(onHidden).toHaveBeenCalledTimes(1);
  expect(isShowing(renderer)).toBe(false);
});

test('still hides on time when the parent keeps re-rendering', async () => {
  const onHidden = jest.fn();
  const renderer = await mount(
    <Host rerenderEveryMs={100} onHidden={onHidden} />,
  );
  expect(isShowing(renderer)).toBe(true);

  await advance(2500);

  expect(onHidden).toHaveBeenCalledTimes(1);
  expect(isShowing(renderer)).toBe(false);

  await ReactTestRenderer.act(() => {
    renderer.unmount();
  });
});

test('a new message shown while visible gets its own full duration', async () => {
  const onHidden = jest.fn();
  const renderer = await mount(<Host message="Dark mode" onHidden={onHidden} />);

  await advance(1500);
  await ReactTestRenderer.act(() => {
    renderer.update(<Host message="Light mode" onHidden={onHidden} />);
  });

  // 1.5s after the swap the original timer would already have fired.
  await advance(1500);
  expect(onHidden).not.toHaveBeenCalled();
  expect(isShowing(renderer, 'Light mode')).toBe(true);

  await advance(1000);
  expect(onHidden).toHaveBeenCalledTimes(1);
  expect(isShowing(renderer, 'Light mode')).toBe(false);
});
