# React Native A11y

## New Release Update
- Updated setKeyboardFocus to remove limitations. The `setKeyboardFocus` method can now be used with any focusable element via `ref`.
- Update and refactor example project with usage of `ReactNative 0.80.x`

## Roadmap:
- Update and refactor the `react-native-external-keyboard` package.
- Update and refactor the `react-native-a11y-order` package.
- Reuse and align functionality from `react-native-external-keyboard` and `react-native-a11y-order`


# 🚧 🚧 🚧

### Unfortunately, the library is outdated and uses deprecated APIs. It requires a lot of work to be done.

In spite of that, there are separate repositories you can use to achieve similar functionality:
- [react-native-a11y-order](https://www.npmjs.com/package/react-native-a11y-order) - for screen reader order control
- [react-native-external-keyboard](https://www.npmjs.com/package/react-native-external-keyboard) - for using and implementing keyboard features
- [react-native-is-keyboard-connected](https://www.npmjs.com/package/react-native-is-keyboard-connected) - for listening to keyboard connection
- [react-native-a11y-container](https://www.npmjs.com/package/react-native-a11y-container) - represents `UIAccessibilityContainer`

# 🚧 🚧 🚧

- 🤖 Reader features: Focus, Order, Reader </br>
- ⌨️ Keyboard features: Focus </br>
- 🙌 Others features soon </br>
- ⚡️ The New Arch support </br>

| iOS reader                                                | Android reader                                                |
| --------------------------------------------------------- | ------------------------------------------------------------- |
| <img src="/.github/images/ios-reader.gif" height="500" /> | <img src="/.github/images/android-reader.gif" height="500" /> |

| iOS Keyboard                                                | Android Keyboard                                                |
| ----------------------------------------------------------- | --------------------------------------------------------------- |
| <img src="/.github/images/ios-keyboard.gif" height="500" /> | <img src="/.github/images/android-keyboard.gif" height="500" /> |

A11y is important, there are a lot of reasons to support and be compliant with it. First of all, it helps people with disabilities work and use your application easily and live a better life. Banks, medication, shops, and delivery is a small list of what people are usually interested in, and it can be more important for people with limitations.

There are can be other reasons, customer requirements, laws and requirements for specific groups of apps,
remote control, etc. Based on this you can find a lot of advantages and benefits to supporting A11y.

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

3. iOS only
   > **_NOTE:_** If you don't plan to use the isKeyboardConnected or keyboardStatusListener functionality, you can skip this step. Linking the GameController framework is optional but required for the proper functioning of isKeyboardConnected and keyboardStatusListener.

Link keyboard(Game) binary with libraries

- Open xcode
- Select folder in the project bar
- Select target project
- Select `Build Phases`
- Expand `Link Binary With Libraries`
- Press plus icon
- You can search for `Game`
- Select `GameController.framework`

<details>
  <summary>Xcode screenshot</summary>
  <img src="/.github/images/ios-link-binary-with-libraries.png" height="500" />
</details>

<details>
  <summary>Why linking is needed</summary>

Unfortunately, the GameController framework is the only viable solution to obtain information about the keyboard and its connection. While there are other potential solutions, they are mostly workarounds and could be rejected by the App Store review process.

</details>

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

| Function                       | Description                                                                                     | Interface                                                                       |
| ------------------------------ | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `isA11yReaderEnabled`          | return promise with status of a11y reader (TalkBack or VoiceOver) true(enabled)/false(disabled) | `() => Promise<boolean>`                                                        |
| `isKeyboardConnected`          | return promise with status of keyboard connection, true(connected)/false(disconnected)          | `() => Promise<boolean>`                                                        |
| `a11yStatusListener`           | listener for a11y reader status                                                                 | `((e: { status: boolean }) => void) => void;`                                   |
| `keyboardStatusListener`       | listener for keyboard connection status                                                         | `((e: { status: boolean }) => void) => void;`                                   |
| `announceForAccessibility`     | Post a string to be announced by the screen reader. Android default, ios specific.              | `(announcement: string) => void;`                                               |
| `announceScreenChange`         | Announces new screen name.                                                                      | `(announcement: string) => void;`                                               |
| `setA11yFocus`                 | Set a11y reader focus to the component                                                          | `(ref: React.RefObject<React.Component>) => void;`                              |
| `setKeyboardFocus`             | Set keyboard focus to the component                                                             | `(ref: React.RefObject<React.Component>) => void;`                              |
| `setPreferredKeyboardFocus`    | `iOS` only, set redirection of keyboard from one component to another one                       | `(nativeTag: number, nextTag: number) => void;`                                 |
| `focusFirstInteractiveElement` | Focus first interactive element on a screen                                                     | `(ref: React.RefObject<React.Component>) => void;`                              |
| `setA11yElementsOrder`         | Set a11y reader focus order                                                                     | `setA11yElementsOrder: <T>(info: { tag?: RefObject<T>; views: T[]; }) => void;` |

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

`KeyboardFocusView` is view based component, has additional props and provide possibility to make component focusable by a keyboard.
Additionally, you can handle pressing events from keyboard. This system can help to handle `Enter` press or long press on `spacebar`.

| Props           | Description                                                                   |
| --------------- | ----------------------------------------------------------------------------- |
| onFocusChange?  | Event to handle focus change, `(e: event.nativeEvent.isFocused) => void`      |
| canBeFocused?   | `boolean` default true, describe whether component can be focused by keyboard |
| onKeyDownPress? | Event to handle a keyboard key down event, `(e: OnKeyPress) => void`          |
| onKeyUpPress?   | Event to handle a keyboard key up event`(e: OnKeyPress) => void`              |

Where `OnKeyPress` is:

```
type OnKeyPress = NativeSyntheticEvent<{
  keyCode: number;
  unicode: number;
  unicodeChar: string;
  isLongPress: boolean;
  isAltPressed: boolean;
  isShiftPressed: boolean;
  isCtrlPressed: boolean;
  isCapsLockOn: boolean;
  hasNoModifiers: boolean;
}>;
```

#### Note:

Latest iOS versions has a `Commands` for a11y support, which override keyboard key presses. If you open `Accessibility` -> `Keyboards` -> `Full Keyboard Access` -> `Commands`, you can find that `Spacebar` key id assigned to the `Activate` command. Because of this, all your `spacebar` presses will be ignored.

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

| Props          | Description                                                                   |
| -------------- | ----------------------------------------------------------------------------- |
| onFocusChange? | Event to handle focus change, `(e: event.nativeEvent.isFocused) => void`      |
| canBeFocused?  | `boolean` default true, describe whether component can be focused by keyboard |

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

### KeyboardFocusTextInput

`KeyboardFocusTextInput` is a TextInput with a view-based wrapper (`TextInputWrapperNative`). This wrapper helps standardize TextInput focusing behavior and also serves as a workaround for the Tab/Shift+Tab issue in Android.

| Props            | Description                                                                                                                                                                                                                                                                                                                                                          |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| TextInputProps   | Default TextInput props that are passed to the TextInput                                                                                                                                                                                                                                                                                                             |
| onFocusChange?   | Event to handle focus change, `(e: event.nativeEvent.isFocused) => void`                                                                                                                                                                                                                                                                                             |
| canBeFocused?    | `boolean` default true, describe whether component can be focused by keyboard                                                                                                                                                                                                                                                                                        |
| focusType?:      | Focus type can be default, auto, or press. Based on investigation, Android and iOS typically have different default behaviors. On Android, the TextInput is focused by default, while on iOS, you need to press to focus. auto is used for automatic focusing, while keyboard focus targets the input. With press, you need to press the spacebar to focus an input. |
| blurType?:       | Only for iOS. This defines the behavior for blurring input when focus moves away from the component. By default, iOS allows typing when the keyboard focus is on another component. You can use disable to blur input when focus moves away. (Further investigation is needed for Android.)                                                                          |
| containerStyle?: | Style property (StyleProp<ViewStyle>) for wrapper view                                                                                                                                                                                                                                                                                                               |

#### Examples

```
import { KeyboardFocusTextInput } "react-native-a11y";

const App = () => {

  return  <KeyboardFocusTextInput
      style={styles.textInput}
      containerStyle={styles.textInputContainer}
      value={inputValue}
      onChangeText={setInputValue}
      focusType="auto"
      blurType="auto"
    />
}


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

## ReactNative old versions supporting

The library provides default support for RN versions starting from v0.66.1 and up to v0.72.\*.

To enable support for versions 0.64._ and 0.65._, add `legacyVer=true` in your `gradle.properties` file

```
// root/android/gradle.properties

legacyVer=true
```

If for some reason you need support for older versions, feel free to create an issue.

## Problems

#### iOS

- remove halo effect for ios keyboard focus, focusEffect = nil doesn't work, overriding to. Note: tested on iphone 8 - 15.5, try to a new one

#### Android

- a11y listener for talk back doesn't work perfect, we can not listen TalkBack only, it listen the whole a11y functional in android and can return wrong results.

## Contributing

Any type of contribution is highly appreciated. Feel free to create PRs, raise issues, or share ideas.

## Acknowledgements

I really appreciate the work and solutions provided by [Andrii Koval](https://github.com/ZioVio), [Michail Chavkin](https://github.com/mchavkin), [Dzmitry Khamitsevich](https://github.com/bulletxenus). I think there was not this library without them, I also want to thank [Aliaksei Kisel](https://github.com/ziginsider) and [Herman Tseranevich](https://github.com/lollegend) for help with publishing and reviewing.

Many thanks to the contributors: [Boaz Poolman](https://github.com/boazpoolman), [YOEL311 Yoel Naki](https://github.com/YOEL311)

And of course, thanks to the issue reporters: [Leonardo Guarnieri de Bastiani](https://github.com/leobastiani), [David](https://github.com/deggertsen), [Summer Knight](https://github.com/ckknight),[Rick Vellinga](https://github.com/RickVellingaa), [joonmanji](https://github.com/joonmanji)

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
