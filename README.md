
# React Native A11y

This is a React Native A11y Library with following main features

- 🤖 Reader features: Focus, Order, Reader </br>
- ⌨️ Keyboard features: Focus </br>
- 🙌 Others features soon </br>

| iOS reader    | Android reader |
| ------------- | -------------- |
| <img src="/.github/images/ios-reader.gif" height="500" />| <img src="/.github/images/android-reader.gif" height="500" />|


| iOS Keyboard  | Android Keyboard |
| ------------- | ---------------- |
| <img src="/.github/images/ios-keyboard.gif" height="500" />| <img src="/.github/images/android-keyboard.gif" height="500" />|

A11y is important, there are a lot of reasons to support and be compliant with it. First of all, it helps people with disabilities work and use your application easily and live a better life. Banks, medication, shops, and delivery is a small list of what people are usually interested in, and it can be more important for people with limitations.

There are can be other reasons, customer requirements, laws and requirements for specific groups of apps, 
remote control, etc. Based on this you can find a lot of advantages and benefits to supporting A11y.

## Versioning 
| React Native version       | Android       | iOS       | New arch  |
| ------------- | ------------- | --------- | --------- |
| 0.71.7        | Supported     | Supported | Supported |
| 0.70.9        | Supported     | Supported | Supported |
| 0.69.9        | Supported     | Supported | Not supported |
| 0.68.2        | Supported     | Supported | Not supported |
| 0.67.2        | Supported     | Supported | X             |
| 0.66.1        | Supported     | Supported | X             |
| 0.65.1        | "0.3.0-android.2"     | Supported (use "0.3.0-android.2" to support android) | X             |
| 0.64.2        | "0.3.0-android.2"     | Supported (use "0.3.0-android.2" to support android) | X             |
| <0.63.4       | X             | X         | X             |

ReactNative (0.65*, 0.64.*) has different API for Android, if you have these version you can use 
 "0.3.0-android.2". Version  "0.3.0-android.2" supports iOS.

## Installation
This library is not finished yer and currently on beta stage. We will be glad to issues, questions, and help.

1. Download package with npm or yarn

```
npm i react-native-a11y
```
```
yarn add react-native-a11y
```

2. Install pods
cd ios && pod install

3. Android only

Add to the  `MainActivity.java` lines:

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

4. iOS only
Link keyboard(Game) binary with libraries

- Open xcode
- Select folder in the project bar
- Select target project
- Select `Build Phases`
- Expand `Link Binary With Libraries`
- Press plus icon
- You can search for `Game`
- Select `GameController.framework`, `GameKit.framework`, `GameplayKit.framework`

See screenshot below:
<img src="/.github/images/ios-link-binary-with-libraries.png" height="500" />

Hope that we will found solution for work around, or create separate library for work with keyboard. 


5. Add provider to root of your app:

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

## Usage

A11y library consists of different components and hooks, to start work with `react-native-a11y` you can get familiar with an example app in `examples/A11ySample`.

### A11yModule

The core of the library is `A11yModule`, `A11yModule` provides additional functions to work with a11y such as order, reader focus, keyboard focus, announcements, etc


| Function      | Description   | Interface |
| ------------- | ------------- | --------- |
| `isA11yReaderEnabled` | return promise with status of a11y reader (TalkBack or VoiceOver)  true(enabled)/false(disabled) |  `() => Promise<boolean>` |
| `isKeyboardConnected` | return promise with status of keyboard connection, true(connected)/false(disconnected) | `() => Promise<boolean>` |
| `a11yStatusListener` | listener for a11y reader status | `((e: { status: boolean }) => void) => void;` |
| `keyboardStatusListener` | listener for keyboard connection status | `((e: { status: boolean }) => void) => void;` |
| `announceForAccessibility` | Post a string to be announced by the screen reader. Android default, ios specific. | `(announcement: string) => void;` |
| `announceScreenChange` | Announces new screen name. | `(announcement: string) => void;` |
| `setA11yFocus` | Set a11y reader focus to the component | `(ref: React.RefObject<React.Component>) => void;` |
| `setKeyboardFocus` | Set keyboard focus to the component | `(ref: React.RefObject<React.Component>) => void;` |
| `setPreferredKeyboardFocus` | `iOS` only, set redirection of keyboard from one component to another one | `(nativeTag: number, nextTag: number) => void;` |
| `focusFirstInteractiveElement` | Focus first interactive element on a screen | `(ref: React.RefObject<React.Component>) => void;` |
| `setA11yElementsOrder` | Set a11y reader focus order | `setA11yElementsOrder: <T>(info: { tag?: RefObject<T>; views: T[]; }) => void;` |

`setA11yFocus` and `setKeyboardFocus` works similar to ` AccessibilityInfo.setAccessibilityFocus`, difference is they request refs instead of tags and you don't need use `findNodeHandle`.


### Examples
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

You can but not really need to use `A11yModule.setA11yElementsOrder` directly, we have specific useful hooks to work with order. 

### useFocusOrder and useDynamicFocusOrder
To set an order for components we have `useFocusOrder`, `useDynamicFocusOrder`

`A11yModule.setA11yElementsOrder` is a more direct one we just pass refs to components and set order, but there are a lot of questions about when to call and set order. To make a better experience two similar hooks were created `useFocusOrder` and `useDynamicFocusOrder`

#### useDynamicFocusOrder
`useDynamicFocusOrder` returns target ref, trigger function, and function to register your components.

```
export type UseDynamicFocusOrder = () => {
  a11yOrder: { 
    ref: RefObject<View>; /// target ref, we need a target ref to a container View
    onLayout: () => void; // trigger, we use onLayout to realize when components are appear on a screen, useEffect and useLayoutEffect don't work properly
  };
  registerOrder: (order: number) => (ref: View) => void; // function to set order
  reset: () => void; // clear function
};
```

```
soon
```

#### useFocusOrder
`useFocusOrder` is based on `useDynamicFocusOrder` but more static and predictable.

```
(size: number) // count of refs
    => FocusOrderInfo<T> = {
  a11yOrder: { 
    ref: RefObject<T>; // target ref, we need a target ref to a container View
    onLayout: () => void; // trigger, we use onLayout to realize when components are appear on a screen, useEffect and useLayoutEffect don't work properly
  };
  refs: ((ref: T | null) => void)[]; // array of callback refs to use for order 
  reset: () => void; // clear function
};

```

```
watch: examples/A11ySample/src/screens/A11yOrderScreen
 
import { A11yOrder, useFocusOrder } from "react-native-a11y";

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
```
The code in example set a new order for components, instead of a direct one it will follow 1 -> 3 -> 2

You also can find a new `A11yOrder` component it's just shorts for `<View {...a11yOrder} />` 

### KeyboardFocusView

`KeyboardFocusView` is view based component, has additional props and provide possibility to make component focusable by a keyboard

| Props         | Description   |
| ------------- | ------------- |
| onFocusChange?| Event to handle focus change, `(e: event.nativeEvent.isFocused) => void` |
| canBeFocused? | `boolean` default true, describe whether component can be focused by keyboard |


#### Examples

```
import { KeyboardFocusView } "react-native-a11y";

const App = () => {

  return <KeyboardFocusView> 
    <Text>Focusable</Text>
  </KeyboardFocusView>
}


```

### Pressable

Almost original pressable, but used `KeyboardFocusView` instead of `View`

Provides additional functionality for usual `Pressable`

| Props         | Description   |
| ------------- | ------------- |
| onFocusChange?| Event to handle focus change, `(e: event.nativeEvent.isFocused) => void` |
| canBeFocused? | `boolean` default true, describe whether component can be focused by keyboard |


#### Examples

```
watch: examples/A11ySample/src/components/Button

import React, { useState } from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import { Pressable, FocusStyle, OnFocusChangeFn } from "react-native-a11y";


export const Button = React.forwardRef<View, Props>(
  ({ title, onPress, style, focusStyle, canBeFocused = true }, ref) => {
    ...

    const [focused, setFocusStatus] = useState(false);

    const onFocusChangeHandler: OnFocusChangeFn = event => {
      setFocusStatus(event.nativeEvent.isFocused);
    };

    return (
      <View style={style}>
        <Pressable
          onFocusChange={onFocusChangeHandler}
          canBeFocused={canBeFocused}
          onPress={onPress}
          style={[styles.container]}
          focusStyle={focusStyle || fStyle}
          ref={ref}
        >
          <Text style={[styles.font, focused && styles.focusedFont]}>
            {title}
          </Text>
        </Pressable>
      </View>
    );
  },
);
```

### KeyboardProvider
Specific provider, used to block all focusable views (KeyboardFocusView). Based on value props disable or not KeyboardFocusView. It can be useful to block list of components, on screen for example or on Drawer in React Navigation.

```
watch: examples/A11ySample/src/screens/KeyboardFocusScreen

const App = () => {
  return <>
     <Button
        style={styles.btn}
        title="Title"
      />
      <KeyboardProvider value={false}>
        <Button title="Disabled focus" />
        <Button title="Disabled focus" />
      </KeyboardProvider>
  </>
}
```


## Roadmap 
- Add more examples, update Readme
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
