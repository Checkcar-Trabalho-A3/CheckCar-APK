import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Modal, Text, TextInput } from 'react-native';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import { useFonts, Outfit_300Light } from '@expo-google-fonts/outfit';

export default function MenuChecklistScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [tipoSelecionado, setTipoSelecionado] = useState('');
  const [placa, setPlaca] = useState('');

  const abrirModal = (tipo) => {
    setTipoSelecionado(tipo);
    setModalVisible(true);
  };

  const continuar = () => {
    setModalVisible(false);
    navigation.navigate('ChecklistScreen', { tipo: tipoSelecionado, placa });
  };

  const [fontsLoaded] = useFonts({
    Outfit_300Light,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Fundo radial */}
      <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
        <Defs>
          <RadialGradient
            id="grad"
            cx="50%"
            cy="50%"
            rx="50%"
            ry="50%"
            fx="50%"
            fy="50%"
          >
            <Stop offset="0%" stopColor="#474747" stopOpacity="1" />
            <Stop offset="100%" stopColor="#0F0F0F" stopOpacity="1" />
          </RadialGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#grad)" />
      </Svg>

      {/* Imagem no topo esquerdo */}
      <View style={styles.topLeftImage}>
        <Image
          source={require('../assets/car.png')}
          style={styles.carImage}
          resizeMode="contain"
        />
      </View>

      {/* Conteúdo da tela */}
      <View style={styles.content}>
        <Image
          source={require('../assets/checklist.png')}
          style={styles.checklist}
          resizeMode="contain"
        />

        <Text style={styles.title}>Escolha o tipo de checklist</Text>

        <View style={styles.cardContainer}>
          <TouchableOpacity style={styles.card} onPress={() => abrirModal('MOTO')}>
            <Text style={styles.cardText}>Moto</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={() => abrirModal('CARRO')}>
            <Text style={styles.cardText}>Carro</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={() => abrirModal('CAMINHAO')}>
            <Text style={styles.cardText}>Caminhão</Text>
          </TouchableOpacity>
        </View>

        {/* Modal para digitar a placa */}
        <Modal
  visible={modalVisible}
  transparent
  animationType="slide"
  onRequestClose={() => setModalVisible(false)}
>
  <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
    <View style={styles.modalContainer}>
      <TouchableWithoutFeedback onPress={() => {}}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            Digite a placa do {tipoSelecionado.toLowerCase()}
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: ABC1234"
            placeholderTextColor="#ccc"
            value={placa}
            onChangeText={setPlaca}
            autoCapitalize="characters"
          />
          <TouchableOpacity style={styles.continueButton} onPress={continuar}>
            <Text style={styles.continueText}>Continuar</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </View>
  </TouchableWithoutFeedback>
</Modal>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  topLeftImage: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
  },
  carImage: {
    width: 50,
    height: 100,
    marginLeft: 10,
  },
  content: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingTop: 280,
  },
  checklist: {
    width: 200,
    height: 80,
    marginBottom: 20,
    marginTop: -150,
  },
  title: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 30,
    fontFamily: 'Outfit_300Light',
  },
  cardContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#5A5A5A',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: 15,
    width: 200,
    alignItems: 'center',
  },
  cardText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Outfit_300Light',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1F1F1F',
    padding: 30,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 15,
    fontFamily: 'Outfit_300Light',
  },
  input: {
    backgroundColor: '#5A5A5A',
    color: '#fff',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: 20,
    fontFamily: 'Outfit_300Light',
  },
  continueButton: {
    backgroundColor: '#5A5A5A',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  continueText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Outfit_300Light',
  },
});
