/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect} from 'react';
import {NativeModules} from 'react-native';
import type {Node} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  NativeEventEmitter,
  requireNativeComponent,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {RCA11yFocusWrapper} from './RCA11';

// const {RCA11yModule} = NativeModules;

console.log('lol', RCA11yFocusWrapper);
const Section = ({children, title}): Node => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

const App: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  useEffect(() => {
    // console.log(RCA11yModule);
    // RCA11yModule.announceForAccessibility('test');
    // RCA11yModule.setA11yOrder([1, 2, 3], 1);

    const eventEmitter = new NativeEventEmitter(NativeModules.RCA11yModule);
    const eventListener = eventEmitter.addListener('keyboardStatus', value =>
      console.log('keyboard', value),
    );
    return eventListener.remove;
  }, []);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <RCA11yFocusWrapper
            canBeFocused={true}
            onFocusChange={v =>
              console.log('changed', v.nativeEvent.isFocused)
            }>
            <Text>works</Text>
          </RCA11yFocusWrapper>
          <RCA11yFocusWrapper
            canBeFocused={true}
            onFocusChange={v =>
              console.log('changed', v.nativeEvent.isFocused)
            }>
            <Text>works2</Text>
          </RCA11yFocusWrapper>
          <RCA11yFocusWrapper
            canBeFocused={true}
            onFocusChange={v =>
              console.log('changed', v.nativeEvent.isFocused)
            }>
            <Text>works3</Text>
          </RCA11yFocusWrapper>
          {/* <RCA11yFocusWrapper onFocusChange={v => console.log('changed', v)}>
            <Text>works</Text>
          </RCA11yFocusWrapper>
          <RCA11yFocusWrapper onFocusChange={v => console.log('changed', v)}>
            <Text>works2</Text>
          </RCA11yFocusWrapper>
          <RCA11yFocusWrapper
            canBeFocused={false}
            onFocusChange={v => console.log('changed', v)}>
            <Text>works3</Text>
          </RCA11yFocusWrapper> */}
          <Section title="Step One">
            Edit <Text style={styles.highlight}>App.js</Text> to change this
            screen and then come back to see your edits.
          </Section>
          <Section title="See Your Changes">
            <ReloadInstructions />
          </Section>
          <Section title="Debug">
            <DebugInstructions />
          </Section>
          <Section title="Learn More">
            Read the docs to discover what to do next:
          </Section>
          <LearnMoreLinks />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
