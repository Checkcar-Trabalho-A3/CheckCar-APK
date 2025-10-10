import React from 'react';
import { View, Text, Button } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Bem-vindo ao CheckCar</Text>
      <Button title="Iniciar Checklist" onPress={() => navigation.navigate('Checklist')} />
    </View>
  );
}
