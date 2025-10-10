import React from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';

export default function SummaryScreen({ route, navigation }) {
  const { respostas } = route.params;

  const enviarChecklist = () => {
    // Aqui você faria a chamada POST para /respostas-checklist/lote
    console.log('Checklist enviado:', respostas);
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Resumo do Checklist</Text>
      <FlatList
        data={respostas}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text>Item: {item.item.nome}</Text>
            <Text>Status: {item.status}</Text>
            <Text>Observação: {item.observacao}</Text>
          </View>
        )}
      />
      <Button title="Finalizar Checklist" onPress={enviarChecklist} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  card: { marginBottom: 15, padding: 10, backgroundColor: '#eee', borderRadius: 5 },
});
