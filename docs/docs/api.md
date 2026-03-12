---
sidebar_position: 2
---

# API Index

This page summarizes the public surface area and points to the detailed pages for each part of the library.

## Components

- `LinearGradient`
  See [LinearGradient](./linear-gradient.md) for `start`, `end`, `angle`, `positions`, `blur`, and `tileMode`. All props accept Reanimated SharedValues directly.
- `RadialGradient`
  See [RadialGradient](./radial-gradient.md) for `center`, `radius`, `positions`, `blur`, and `tileMode`. All props accept Reanimated SharedValues directly.
- `SweepGradient`
  See [SweepGradient](./sweep-gradient.md) for `center`, `positions`, `blur`, and `tileMode`. All props accept Reanimated SharedValues directly.

## Shared props

- `colors: ColorValue[]`
- `positions?: number[]`
- `blur?: number`
- `tileMode?: TileMode`

## Types

- `Vector`
- `PercentString`
- `RadiusValue`
- `ColorValue`

## Guides

- [Reanimated Integration](./animations.md) for shared-value updates.
<!-- - [Without Reanimated](./without-reanimated.md) for plain React Native usage. -->
