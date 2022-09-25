
# React Native A11y

**_NOTE:_**   
0.67.* - checked only, old architecture, 0.66.* probably
Unfortunately, it is currently only for old architecture, we are working on migration to the new one.
---

A11y components and utils for RN. A11y is important, there are a lot of reasons to make your application accessible, at least requirements from customers.

`react-native-a11y` is a set of tools and components that will help make your application more accessible and provides additional solutions for working with `reader` (TalkBack/VoiceOver) and hardware `keyboard focus`. 


The components and utils of this library were developed to achieve WCAG 2.1 AA which can be different from standard mobile accessibility (especially for IOS).

 
This library does not change standard components , it only extends functionally, so you can install it to use some features in an already existing project or a new one.

## Installation
This library has not been published yet, but we plan to do it as soon as possible, right for now you can test the A11ySample app in the examples folder.

```
npm i react-native-a11y
or
yarn add react-native-a11y
```

### Android additional

To listen android changes the Android Intent is used, you need add additional lines to your `MainActivity.java` file

```
  //android/app/src/main/java/com/project-name/MainActivity.java
  
  @Override
  public void onConfigurationChanged(Configuration newConfig) {
    super.onConfigurationChanged(newConfig);
    Intent intent = new Intent("onConfigurationChanged");
    intent.putExtra("newConfig", newConfig);
    this.sendBroadcast(intent);
  }

```

## Roadmap 
- Publish on npm
- Add examples and update samples
- Add tests
- Migrate to the new architecture
- Check React Navigation for A11y and make examples 

## Usage

A11y library consists of different components and hooks, to start work with `react-native-a11y` you can get familiar with an example app in examples it is called `A11ySample`.

First of all providers: 

```
watch: examples/A11ySample/App.tsx

export const App = () => {
  return (
    <A11yProvider>
        // content here
    </A11yProvider>
  );
};
```

### A11yModule
The core of this library is `A11yModule` that provides additional functions to work with a11y such as a11y order, keyboard and reader focus, keyboard focus view, ets

Usually you will use `setA11yFocus` | `setKeyboardFocus` | `announceForAccessibility` and probably `announceScreenChange`, you can find a list of all functions with description bellow.


| Function      | Description   |
| ------------- | ------------- |
| isA11yReaderEnabled  | Check whether an a11y reader (TalkBack or VoiceOver) is enabled  |
| isKeyboardConnected | Check whether a keyboard is connected  |
|a11yStatusListener | listener for a11y reader status change |
|keyboardStatusListener| listener to keyboard connection status changes |
|announceForAccessibility | soon |
|announceScreenChange | soon |
|setA11yFocus| set a11y reader focus |
|setKeyboardFocus | set keyboard focus |
|setPreferredKeyboardFocus| soon  |
|focusFirstInteractiveElement| focus first interactive element on a screen |
|setA11yElementsOrder| set a11y reader focus |

A11yModule is a facade of functions which call different native methods mostly.

`setA11yFocus` and `setKeyboardFocus` works similar to ` AccessibilityInfo.setAccessibilityFocus` but allows set focus on iOS and for keyboard, one additional difference is they request refs instead of tags and you don't need use `findNodeHandle` we use it inside.


#### setA11yFocus
```
watch: examples/A11ySample/src/screens/ReaderFocusScreen

const App = () => {
///
  const ref1 = useRef(null);
  const ref3 = useRef(null);
///

return (
 ///
 <Button
    ref={ref1}
    onPress={() => A11yModule.setA11yFocus(ref3)}
    title="1. Set focus to third"
 />
 ///
  <Button
    ref={ref3}
    onPress={() => A11yModule.setA11yFocus(ref2)}
    title="3. Set focus to second"
  />
}
```



#### setKeyboardFocus
```
watch: examples/A11ySample/src/screens/KeyboardFocusScreen

const App = () => {
///
  const ref1 = useRef(null);
  const ref3 = useRef(null);
///

return (
 ///
 <Button
    ref={ref1}
    onPress={() => A11yModule.setKeyboardFocus(ref3)}
    title="1. Set focus to third"
 />
 ///
  <Button
    ref={ref3}
    onPress={() => A11yModule.setKeyboardFocus(ref2)}
    title="3. Set focus to second"
  />
}
```

I don't provide an example of `A11yModule.setA11yElementsOrder` here because we have a better solution that direct call.

### useFocusOrder and useDynamicFocusOrder
To set an order for components we have `useFocusOrder`, `useDynamicFocusOrder` and `A11yModule.setA11yElementsOrder`

`A11yModule.setA11yElementsOrder` is more direct one we just pass refs to components and set order, but there are a lot of problems with understanding when this function have to be called, to solve this problems we use two similar hooks `useFocusOrder` and `useDynamicFocusOrder`

#### useDynamicFocusOrder
`useDynamicFocusOrder` returns target ref, trigger function and function to register your components.

```
soon
```

#### useFocusOrder
`useFocusOrder` is based on `useDynamicFocusOrder` but more static and predictable.

```
watch: examples/A11ySample/src/screens/A11yOrderScreen
 
const App = () => {

 const { a11yOrder, refs } = useFocusOrder(3); // 3 number of wanted refs

///

return (
    <A11yOrder onLayout={onLayoutHandler} a11yOrder=  {a11yOrder}>
        <Text style={styles.font} ref={refs[0]}>
        First
        </Text>
        <Text style={styles.font} ref={refs[2]}>
        Third
        </Text>
        <Text style={styles.font} ref={refs[1]}>
        Second
        </Text>
    </A11yOrder>
)

}
```
This code set a new order for components, instead of direct one it will follow 1 -> 3 -> 2

You can find a new `A11yOrder` component it's just shorts for `<View {...a11yOrder} />` 

## Contributing

Soon

## Acknowledgements
I really appreciate the work and solutions provided by Andrii Koval (https://github.com/ZioVio), Michail Chavkin (https://github.com/mchavkin), Dzmitry Khamitsevich (https://github.com/bulletxenus). I think there was not this library without them, I also want to thank Aliaksei Kisel (https://github.com/ziginsider) and Herman Tseranevich (https://github.com/lollegend) for help with publishing and reviewing.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
