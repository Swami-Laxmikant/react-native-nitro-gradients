import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStaticNavigation, useIsFocused } from '@react-navigation/native';
import { LinearGradientScreen } from './LinearGradientScreen';
import { RadialGradientScreen } from './RadialGradientScreen';
import { SweepGradientScreen } from './SweepGradientScreen';
import Animated, { useAnimatedStyle, withSpring, useSharedValue } from 'react-native-reanimated';
import { useEffect } from 'react';

const icons = {
  linear: require('./icons/linear.png'),
  radial: require('./icons/circular.png'),
  sweep: require('./icons/angular.png'),
}

const Icon = ({name, size}: {
  name: keyof typeof icons;
  size: number;
}) => {
  const isFocused = useIsFocused();
  const progress = useSharedValue(isFocused ? 0 : 1);
  useEffect(()=>{
    progress.value = withSpring(isFocused ? 1 : 0);
  }, [isFocused])

  const animatedStyles = useAnimatedStyle(()=> ({
    opacity: 0.3 + progress.value * 0.7,
    transform: [{scale: 0.8 + progress.value * 0.2}, {rotate: `${progress.value * 90}deg`}],
  }));

  return <Animated.Image source={icons[name]} style={[{ width: size, height: size }, animatedStyles]} />
}

const Tabs = createBottomTabNavigator({
  detachInactiveScreens: false,
  screens: {
    Linear: {
      screen: LinearGradientScreen,
      options: {
        title: 'Linear',
        headerTitle: 'Linear Gradient',
        tabBarIcon: ({size}) => <Icon name="linear" size={size} />,
      },
    },
    Radial: {
      screen: RadialGradientScreen,
      options: {
        title: 'Radial',
        headerTitle: 'Radial Gradient',
        tabBarIcon: ({size}) => <Icon name="radial" size={size} />,
      },
    },
    Sweep: {
      screen: SweepGradientScreen,
      options: {
        title: 'Sweep',
        headerTitle: 'Sweep Gradient',
        tabBarIcon: ({size}) => <Icon name="sweep" size={size} />,
      },
    },
  },
});

const Navigation = createStaticNavigation(Tabs);

function App(): React.JSX.Element {

  return <Navigation />;
}

export default App;
