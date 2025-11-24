import React, { useState } from 'react';
import { Alert } from 'react-native';
import { View, StyleSheet, Image, TextInput, TouchableOpacity, Text } from 'react-native';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import { useFonts, Outfit_300Light } from '@expo-google-fonts/outfit';

export default function LoginScreen({navigation}) {
  const [senha, setSenha] = useState('');
  const [cpf, setCpf] = useState('');

  const handleLogin = async () => {
  console.log('Botão de login clicado');
  try {
    const response = await fetch('http://192.168.18.25:8080/api/usuarios/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cpf, senha })
    });

    if (!response.ok) throw new Error('CPF ou senha inválidos');

    const usuario = await response.json();
    navigation.navigate('Home', { usuarioLogado: usuario });
  } catch (err) {
    Alert.alert('Erro', err.message);
  }
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
          source={require('../assets/logintext.png')}
          style={styles.logintext}
          resizeMode="contain"
        />

        {/* Inputs */}
        <TextInput
          style={styles.input}
          placeholder="Digite seu CPF"
          placeholderTextColor="#ccc"
          value={cpf}
          onChangeText={setCpf}
          keyboardType="numeric"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Digite sua senha"
          placeholderTextColor="#ccc"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />

        {/* Botões */}
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => console.log('Esqueci minha senha')}>
          <Text style={styles.forgotText}>Esqueci minha senha</Text>
        </TouchableOpacity>
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
  logintext: {
    width: 110,
    height: 90,
    marginBottom: 1,
  },
  input: {
    backgroundColor: '#5A5A5A',
    color: '#fff',
    fontFamily: 'Outfit_300Light',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    width: '85%',
    minHeight: 50,
    borderWidth: 1,
    borderColor: '#333',
  },
  loginButton: {
    backgroundColor: '#5A5A5A',
    paddingVertical: 10,
    borderRadius: 8,
    width: '40%',
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 15,
    fontFamily: 'Outfit_300Light',
  },
  forgotText: {
    color: '#ccc',
    fontSize: 14,
    marginTop: 12,
    fontFamily: 'Outfit_300Light',
  },
});
