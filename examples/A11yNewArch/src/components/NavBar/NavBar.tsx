import React from 'react';
import {StyleSheet, View} from 'react-native';

import {Button} from '../Button';

type Props = {
  back?: () => void;
  next?: () => void;
};

export const NavBar: React.FC<Props> = ({back, next}) => {
  return (
    <View style={styles.container}>
      {back && <Button title="Back" onPress={back} />}
      {back && next && <View style={styles.divider} />}
      {next && <Button title="Next" onPress={next} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  divider: {
    marginRight: 10,
  },
});
