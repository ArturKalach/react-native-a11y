import { StyleSheet, Text } from 'react-native';
import { DrawerActions, CommonActions } from '@react-navigation/native';
import {
  type DrawerContentComponentProps,
  getDrawerStatusFromState,
} from '@react-navigation/drawer';
import { KeyboardProvider, Pressable } from 'react-native-a11y';

export const DrawerContent = (props: DrawerContentComponentProps) => {
  const { state, navigation, descriptors } = props;
  const isDrawerOpen = getDrawerStatusFromState(state) === 'open';
  return (
    <KeyboardProvider value={isDrawerOpen}>
      {state.routes.map((route, i) => {
        const focused = i === state.index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'drawerItemPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!event.defaultPrevented) {
            navigation.dispatch({
              ...(focused
                ? DrawerActions.closeDrawer()
                : CommonActions.navigate({
                    name: route.name,
                    merge: true,
                  })),
              target: state.key,
            });
          }
        };

        const { title = '' } = descriptors[route.key]?.options || {};

        return (
          <Pressable key={route.key} onPress={onPress} style={styles.item}>
            <Text>{title}</Text>
          </Pressable>
        );
      })}
    </KeyboardProvider>
  );
};

const styles = StyleSheet.create({
  item: { padding: 10 },
});
