/**
 * Credit - Angular Material
 */

/** Creates a browser MouseEvent with the specified options. */
export function createMouseEvent(type: string, x: number = 0, y: number = 0, button: number = 0): MouseEvent {
  const event = document.createEvent('MouseEvent');

  event.initMouseEvent(type, true, false, window, 0, x, y, x, y, false, false, false, false, button, null);

  // `initMouseEvent` doesn't allow us to pass the `buttons` and
  // defaults it to 0 which looks like a fake event.
  Object.defineProperty(event, 'buttons', { get: () => 1 });

  return event;
}

/**
 * Creates a browser TouchEvent with the specified pointer coordinates.
 */
export function createTouchEvent(type: string, pageX: number = 0, pageY: number = 0): UIEvent {
  // In favor of creating events that work for most of the browsers, the event is created
  // as a basic UI Event. The necessary details for the event will be set manually.
  const event = document.createEvent('UIEvent');

  event.initUIEvent(type, true, true, window, 0);

  // Most of the browsers don't have a "initTouchEvent" method that can be used to define
  // the touch details.
  Object.defineProperties(event, {
    touches: { value: [{ pageX, pageY }] }
  });

  return event;
}

/** Dispatches a keydown event from an element. */
export function createKeyboardEvent(type: string, keyOrKeyCode: string | number, target?: Element): KeyboardEvent {
  const key = typeof keyOrKeyCode === 'string' && keyOrKeyCode;
  const keyCode = typeof keyOrKeyCode === 'number' && keyOrKeyCode;

  const event = document.createEvent('KeyboardEvent') as any;
  const originalPreventDefault = event.preventDefault;

  // Firefox does not support `initKeyboardEvent`, but supports `initKeyEvent`.
  if (event.initKeyEvent) {
    event.initKeyEvent(type, true, true, window, 0, 0, 0, 0, 0, keyCode);
  } else {
    event.initKeyboardEvent(type, true, true, window, 0, key, 0, '', false);
  }

  // Webkit Browsers don't set the keyCode when calling the init function.
  // See related bug https://bugs.webkit.org/show_bug.cgi?id=16735
  Object.defineProperties(event, {
    keyCode: { get: () => keyCode },
    key: { get: () => key },
    target: { get: () => target }
  });

  // IE won't set `defaultPrevented` on synthetic events so we need to do it manually.
  // tslint:disable-next-line
  event.preventDefault = function() {
    Object.defineProperty(event, 'defaultPrevented', { get: () => true });

    return originalPreventDefault.apply(this, arguments);
  };

  return event;
}

/** Creates a fake event object with any desired event type. */
export function createFakeEvent(type: string, canBubble: boolean = false, cancelable: boolean = true): Event {
  const event = document.createEvent('Event');
  event.initEvent(type, canBubble, cancelable);

  return event;
}
