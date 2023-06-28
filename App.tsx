/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useState} from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
  Image,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {Authenticator, useAuthenticator} from '@aws-amplify/ui-react-native';
import {Storage} from 'aws-amplify';
import * as ImagePicker from 'react-native-image-picker';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): JSX.Element {
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
}

const SignOutButton = () => {
  const {signOut} = useAuthenticator();
  return <Button title="Sign Out" onPress={signOut} />;
}

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <Authenticator.Provider>
          <Authenticator>
            <Text>My App</Text>
            <MyImagePicker />
            <SignOutButton />
          </Authenticator>
        </Authenticator.Provider>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="Step One">
            Edit <Text style={styles.highlight}>App.tsx</Text> to change this
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
}

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

function MyImagePicker() {
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibrary({
        mediaType: 'photo',
        // allowsEditing: true,
        includeBase64: false,
        // aspect: [3, 3],
        quality: 1,
      });

      console.log(result.assets[0].uri);

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
      // setImage(result);
    } catch (err) {
      console.log(err);
    }
  };

  const uploadImage = async () => {
    try {
      const response = await fetch(image);
      console.log(response);
      const blob = await response.blob();
      const res = await Storage.put('my-test.jpg', blob, {
        contentType: 'image/jpeg',
        // resumable: true,
        // completeCallback: event => {
        //   console.log('completeCallback', event);
        // },
        // progressCallback: event => {
        //   console.log('progressCallback', event);
        // },
        // errorCallback: event => {
        //   console.log('errorCallback', event);
        // },
      });
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  };


  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      <Text>{JSON.stringify(image)}</Text>
      <Button title="Upload" onPress={uploadImage} />
      {image && (
        // eslint-disable-next-line react-native/no-inline-styles
        <Image source={{uri: image}} style={{width: 200, height: 200}} />
      )}
    </View>
  );
}
