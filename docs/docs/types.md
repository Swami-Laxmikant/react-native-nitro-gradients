---
sidebar_position: 7
---

# Type Definitions

Essential types used in component props.

## PercentString

A string type for percentage-based values with multiple format options.

```typescript
type PercentString = string;
```

### Supported Formats


**Percent without specifying any dimension**

```typescript
"${number}%" // radius = "100%"
```
Calculates percent fraction of its axis (if used in Vector), otherwise percent fraction of self container's width

**Width-based Percentage**

```typescript
"${number}w%" // radius = "20w%"
```

Calculates percentage relative to the self container's width.

**Height-based Percentage**

```typescript
"${number}h%"
```

Calculates percentage relative to the self container's height.

## Vector

2D position for coordinates used in props.

```typescript
interface Vector {
  x: number | PercentString;
  y: number | PercentString;
}

const example1: Vector = {
  x: 500,
  y: '100%'
}

const example2: Vector = {
  x: '20h%',
  y: '30w%'
}

const example3: Vector = {
  x: '20w%',
  y: 30,
}

```
Both absolute pixel values and percentage-based values can be mixed within the same Vector, allowing flexible positioning across different screen sizes.

## ColorValue

Similar to [React Native's standard color format](https://reactnative.dev/docs/colors).
