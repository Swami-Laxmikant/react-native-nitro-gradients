---
sidebar_position: 9
---

# Under the Hood (Nitro)

Brief architecture overview.

## Modules

- Nitro Modules provide native bindings used by the gradient views.
- Data is passed in a format suited for native rendering APIs.

## Rendering

- iOS: Metal-backed rendering.
- Android: hardware-accelerated rendering.

## Data flow

1. JS props → normalized (colors, positions, vectors)
2. Bridge → native layer (zero-copy where possible)
3. Native draws gradient to a backing surface

## Reanimated

Animated variants accept shared values; updates are applied on the UI thread.

## Notes

- Web is not supported.
- Percentage coordinates are resolved against view bounds.

