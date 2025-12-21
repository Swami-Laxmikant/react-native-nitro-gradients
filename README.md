# React Native Nitro Gradients

High-performance gradient components for React Native, built with [Nitro Modules](https://github.com/mrousavy/nitro) ⚡

> [!WARNING]
> **🚧 Under Active Development**
> 
> This library is currently in early development and **not recommended for production use**

## Features

- 🎨 **Three gradient types** - Linear, Radial, and Sweep gradients
- 🎭 **First-class Reanimated support** - Use shared values as gradient props

## Installation

```bash
npm install react-native-nitro-gradients
npm install react-native-nitro-modules react-native-reanimated react-native-worklets
cd ios && pod install
```

> Requires React Native 0.78.0+ with New Architecture enabled

## Quick Example

```tsx
import { LinearGradient } from 'react-native-nitro-gradients';

function App() {
  return (
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ width: 200, height: 200 }}
    />
  );
}
```

## Documentation

📖 **[Read the full documentation](https://Swami-Laxmikant.github.io/react-native-nitro-gradients/docs/intro)**

- [Installation Guide](https://Swami-Laxmikant.github.io/react-native-nitro-gradients/docs/installation)
- [Linear Gradient](https://Swami-Laxmikant.github.io/react-native-nitro-gradients/docs/linear-gradient)
- [Radial Gradient](https://Swami-Laxmikant.github.io/react-native-nitro-gradients/docs/radial-gradient)
- [Sweep Gradient](https://Swami-Laxmikant.github.io/react-native-nitro-gradients/docs/sweep-gradient)
- [Animations with Reanimated](https://Swami-Laxmikant.github.io/react-native-nitro-gradients/docs/animations)

## License

MIT
