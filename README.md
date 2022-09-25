
# React Native A11y

**_NOTE:_**   
0.67.* - checked only, old architecture.
Unfortunately, it is currently only for old architecture, we are working on updating to the new one.
---

A11y components and utils for RN. A11y is important, there are a lot of reasons to make your application accessible, at least requirements from customers.

`react-native-a11y` is a set of tools and components that will help make your application more accessible and provides additional solutions for working with `reader` (TalkBack/VoiceOver) and hardware `keyboard focus`. 


The components and utils of this library were developed to achieve WCAG 2.1 AA which can be different from standard mobile accessibility.

This library does not change standard components, it only extends functionally, so you can install it to use some features in an already existing project or a new one.

## Installation
This library is quite alfa, and needs to be tested a lot. Solutions of this library was tested a lot by different people a11y specialist and QAs, but there are some changes which are new one and we need some time to check and implement everything, to try and help you can follow the gide below. We will be glad to issues, questions, and help.

```
npm i react-native-a11y
```
or
```
yarn add react-native-a11y
```

### Additional for Android 

To listen to android changes the Android Intent is used, you need to add additional lines to your `MainActivity.java` file

```
  //android/app/src/main/java/com/project-name/MainActivity.java

  ...
  import android.content.Intent;
  import android.content.res.Configuration;
  ...
  
  @Override
  public void onConfigurationChanged(Configuration newConfig) {
    super.onConfigurationChanged(newConfig);
    Intent intent = new Intent("onConfigurationChanged");
    intent.putExtra("newConfig", newConfig);
    this.sendBroadcast(intent);
  }

```

## Usage

A11y library consists of different components and hooks, to start work with `react-native-a11y` you can get familiar with an example app in `examples/A11ySample`.

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
The core of this library is `A11yModule` that provides additional functions to work with a11y such as a11y order, keyboard and reader focus, keyboard focus view, etc

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

A11yModule is a facade of functions that call different native methods.

`setA11yFocus` and `setKeyboardFocus` works similar to ` AccessibilityInfo.setAccessibilityFocus` but allows set focus on iOS and for keyboard, one additional difference is they request refs instead of tags and you don't need use `findNodeHandle` we use it inside.


#### setA11yFocus
```
watch: examples/A11ySample/src/screens/ReaderFocusScreen

import { A11yModule } from "react-native-a11y";
...

const App = () => {
  const ref1 = useRef(null);
  const ref3 = useRef(null);
...

return (
 ...
 <Button
    ref={ref1}
    onPress={() => A11yModule.setA11yFocus(ref3)}
    title="1. Set focus to third"
 />
 ...
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

import { A11yModule, KeyboardProvider } from "react-native-a11y";
...

const App = () => {
  const ref1 = useRef(null);
  const ref3 = useRef(null);
...

return (
 ...
 <Button
    ref={ref1}
    onPress={() => A11yModule.setKeyboardFocus(ref3)}
    title="1. Set focus to third"
 />
 ...
  <Button
    ref={ref3}
    onPress={() => A11yModule.setKeyboardFocus(ref2)}
    title="3. Set focus to second"
  />
}
```

I don't provide an example of `A11yModule.setA11yElementsOrder` here because we have a better solution than a direct call.
### useFocusOrder and useDynamicFocusOrder
To set an order for components we have `useFocusOrder`, `useDynamicFocusOrder` and `A11yModule.setA11yElementsOrder`

`A11yModule.setA11yElementsOrder` is more direct one we just pass refs to components and set order, but there are a lot of problems with understanding when this function have to be called, to solve these problems we use two similar hooks `useFocusOrder` and `useDynamicFocusOrder`

#### useDynamicFocusOrder
`useDynamicFocusOrder` returns target ref, trigger function, and function to register your components.

```
soon
```

#### useFocusOrder
`useFocusOrder` is based on `useDynamicFocusOrder` but more static and predictable.

```
watch: examples/A11ySample/src/screens/A11yOrderScreen
 
import { A11yOrder, useFocusOrder } from "react-native-a11y";
...

const App = () => {

 const { a11yOrder, refs } = useFocusOrder(3); // 3 number of wanted refs

...

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
This code set a new order for components, instead of a direct one it will follow 1 -> 3 -> 2

You also can find a new `A11yOrder` component it's just shorts for `<View {...a11yOrder} />` 

## Roadmap 
- Add examples and update samples
- Add tests
- Migrate to the new architecture
- Check React Navigation for A11y and make examples 

## Problems

#### iOS
- remove halo effect for ios keyboard focus, focusEffect = nil doesn't work, overriding to. Note: tested on iphone 8 - 15.5, try to a new one

#### Android
- a11y listener for talk back doesn't work perfect, we can not listen TalkBack only, it listen the whole a11y functional in android and can return wrong results. 

## Contributing

Soon

## Acknowledgements
I really appreciate the work and solutions provided by [Andrii Koval](https://github.com/ZioVio), [Michail Chavkin](https://github.com/mchavkin), [Dzmitry Khamitsevich](https://github.com/bulletxenus). I think there was not this library without them, I also want to thank [Aliaksei Kisel](https://github.com/ziginsider) and [Herman Tseranevich](https://github.com/lollegend) for help with publishing and reviewing.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
