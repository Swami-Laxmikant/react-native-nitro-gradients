---
sidebar_position: 1
---

# Installation Guide

Setup and platform notes. Quick Start is in the Overview page.

## Requirements

- React Native 0.78.0+ (New Architecture enabled)
- React Native Reanimated 4.0+
- React Native Nitro Modules 0.22+

## Installation

### 1. Install dependencies

```bash
# Install the gradient library
npm install react-native-nitro-gradients

# Install required peer dependencies
npm install react-native-nitro-modules react-native-reanimated react-native-worklets

# For iOS
cd ios && pod install
```

### 2. Enable New Architecture

React Native Nitro Gradients requires the [New Architecture](https://reactnative.dev/architecture/landing-page) to be enabled.
By default its enabled in React Native 0.78.0+


### 4. Build your app

```bash
# android
yarn run android

# ios
yarn run ios
```


