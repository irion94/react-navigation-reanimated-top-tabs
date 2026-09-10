import { AnimationHelper } from '../components/ReanimatedTopTab/AnimationHelper';

const width = 400;
const minimum = width * 0.4;
const maxOffset = -width * 2; // 3 routes

const changeEvent = (changeX: number) => ({ changeX }) as any;
const endEvent = (translationX: number, velocityX: number) =>
  ({ translationX, velocityX }) as any;

describe('AnimationHelper.onChange', () => {
  const state = { index: 0, routesCount: 3 };

  it('adds changeX to the current value', () => {
    expect(AnimationHelper.onChange(changeEvent(-50), -100, width, state)).toBe(
      -150
    );
  });

  it('clamps at 0 when dragged past the first route', () => {
    expect(AnimationHelper.onChange(changeEvent(30), 10, width, state)).toBe(0);
  });

  it('clamps at -width*(routesCount-1) past the last route', () => {
    expect(
      AnimationHelper.onChange(changeEvent(-30), maxOffset - 10, width, state)
    ).toBe(maxOffset);
  });
});

describe('AnimationHelper.onEnd', () => {
  const state = { index: 1, routesCount: 3 };

  it('increments on fast left fling', () => {
    expect(
      AnimationHelper.onEnd(endEvent(-10, -300), minimum, width, state)
    ).toEqual({ index: 2, value: -width * 2 });
  });

  it('increments when translation exceeds the minimum', () => {
    expect(
      AnimationHelper.onEnd(endEvent(-minimum - 1, 0), minimum, width, state)
    ).toEqual({ index: 2, value: -width * 2 });
  });

  it('decrements on fast right fling', () => {
    expect(
      AnimationHelper.onEnd(endEvent(10, 300), minimum, width, state)
    ).toEqual({ index: 0, value: -0 });
  });

  it('decrements when translation exceeds the minimum', () => {
    expect(
      AnimationHelper.onEnd(endEvent(minimum + 1, 0), minimum, width, state)
    ).toEqual({ index: 0, value: -0 });
  });

  it('stays on small moves', () => {
    expect(
      AnimationHelper.onEnd(endEvent(-20, -50), minimum, width, state)
    ).toEqual({ index: 1, value: -width });
  });

  it('clamps at the last route', () => {
    expect(
      AnimationHelper.onEnd(endEvent(-10, -300), minimum, width, {
        index: 2,
        routesCount: 3,
      })
    ).toEqual({ index: 2, value: -width * 2 });
  });

  it('clamps at the first route', () => {
    expect(
      AnimationHelper.onEnd(endEvent(10, 300), minimum, width, {
        index: 0,
        routesCount: 3,
      })
    ).toEqual({ index: 0, value: -0 });
  });
});
