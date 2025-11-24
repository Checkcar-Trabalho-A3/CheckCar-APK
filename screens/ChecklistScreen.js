import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';

export default function ChecklistScreen({ route, navigation }) {
  const { tipo, placa, usuarioId, veiculoId } = route.params; 

  console.log("ChecklistScreen params:", { tipo, placa, usuarioId, veiculoId });

  const [perguntas, setPerguntas] = useState([]);
  const [respostas, setRespostas] = useState({});
  const [carregandoPerguntas, setCarregandoPerguntas] = useState(true);

  useEffect(() => {
    fetch(`http://192.168.18.25:8080/api/perguntas?tipoVeiculo=${tipo?.toUpperCase()}`)
      .then(res => {
        if (!res.ok) throw new Error('Erro ao buscar perguntas');
        return res.json();
      })
      .then(data => {
        console.log('Perguntas recebidas do backend:', data);
        setPerguntas(Array.isArray(data) ? data : []);
      })
      .catch(err => {
        console.error("Erro ao carregar perguntas:", err);
        Alert.alert('Erro', 'Não foi possível carregar as perguntas');
      })
      .finally(() => setCarregandoPerguntas(false));
  }, []);

  const salvarResposta = (idPergunta, status, observacao) => {
    setRespostas(prev => ({
      ...prev,
      [idPergunta]: { status, observacao }
    }));
  };

  const enviarChecklist = async () => {
    try {
      if (!usuarioId || !veiculoId) {
        Alert.alert("Erro", "Usuário ou veículo não definidos. Faça login e selecione um veículo.");
        return;
      }
      if (!tipo || !placa) {
        Alert.alert("Erro", "Tipo de veículo ou placa não informados.");
        return;
      }
      if (Object.keys(respostas).length === 0) {
        Alert.alert("Erro", "Nenhuma resposta foi preenchida.");
        return;
      }

      const lotePayload = Object.entries(respostas).map(([idPergunta, resposta]) => {
        if (!idPergunta) {
          throw new Error("Pergunta sem ID detectada");
        }
        return {
          idUsuario: usuarioId,
          idVeiculo: veiculoId,
          tipo: tipo.toUpperCase(),
          idPergunta: parseInt(idPergunta, 10),
          observacao: resposta.observacao || "",
          status: resposta.status || null
        };
      });

  
      console.log("Payload enviado ao backend:", JSON.stringify(lotePayload, null, 2));

      const respostaResponse = await fetch('http://192.168.18.25:8080/api/respostas-checklist/lote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lotePayload)
      });

  
      console.log("Resposta do backend:", respostaResponse.status);
      const respostaTexto = await respostaResponse.text();
      console.log("Corpo da resposta:", respostaTexto);

      if (!respostaResponse.ok) {
        throw new Error(`Erro ao enviar respostas: ${respostaTexto}`);
      }

      Alert.alert('Sucesso', 'Checklist enviado com sucesso');
      navigation.goBack();
    } catch (err) {
      console.error("Erro no envio do checklist:", err);
      Alert.alert('Erro', err.message || 'Falha ao enviar checklist');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Fundo radial */}
      <Svg height="100%" width="100%" style={[StyleSheet.absoluteFill, { zIndex: -1 }]}>
        <Defs>
          <RadialGradient id="grad" cx="50%" cy="50%" rx="50%" ry="50%" fx="50%" fy="50%">
            <Stop offset="0%" stopColor="#474747" stopOpacity="1" />
            <Stop offset="100%" stopColor="#0F0F0F" stopOpacity="1" />
          </RadialGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#grad)" />
      </Svg>

      {/* Imagens no topo */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginTop: 40 }}>
        <Image source={require('../assets/checklist.png')} style={styles.checklist} resizeMode="contain" />
        <Image source={require('../assets/car.png')} style={styles.carImage} resizeMode="contain" />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {carregandoPerguntas ? (
          <Text style={{ color: '#fff', textAlign: 'center' }}>Carregando perguntas...</Text>
        ) : perguntas.length === 0 ? (
          <Text style={{ color: '#fff', textAlign: 'center' }}>Nenhuma pergunta encontrada</Text>
        ) : (
          perguntas.map((pergunta) => (
            <View key={pergunta.id} style={styles.perguntaBox}>
              <Text style={styles.pergunta}>{pergunta.texto}</Text>

              {pergunta.tipoResposta === 'SELECAO' ? (
                <View style={styles.opcoes}>
                  {['OK', 'NOK', 'NA'].map(opcao => (
                    <TouchableOpacity
                      key={opcao}
                      style={[
                        styles.botao,
                        respostas[pergunta.id]?.status === opcao && styles.botaoSelecionado
                      ]}
                      onPress={() => salvarResposta(pergunta.id, opcao, respostas[pergunta.id]?.observacao || '')}
                    >
                      <Text style={styles.botaoTexto}>{opcao}</Text>
                    </TouchableOpacity>
                  ))}
                  <TextInput
                    style={styles.input}
                    placeholder="Observações (opcional)"
                    placeholderTextColor="#ccc"
                    value={respostas[pergunta.id]?.observacao || ''}
                    onChangeText={(texto) => salvarResposta(pergunta.id, respostas[pergunta.id]?.status || null, texto)}
                  />
                </View>
              ) : (
                <TextInput
                  style={styles.input}
                  placeholder="Digite sua resposta..."
                  placeholderTextColor="#ccc"
                  multiline
                  value={respostas[pergunta.id]?.observacao || ''}
                  onChangeText={(texto) => salvarResposta(pergunta.id, null, texto)}
                />
              )}
            </View>
          ))
        )}

        <TouchableOpacity
          style={styles.enviarButton}
          onPress={enviarChecklist}
          disabled={carregandoPerguntas || perguntas.length === 0}
        >
          <Text style={styles.enviarTexto}>Enviar Checklist</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  checklist: { width: 180, height: 30, marginBottom: 20, marginTop: 80, right: -80 },
  carImage: { width: 50, height: 90, marginLeft: 10, right: 300 },
  perguntaBox: { marginBottom: 25, backgroundColor: 'transparent', padding: 15, borderRadius: 10 },
  pergunta: { color: '#fff', fontSize: 16, marginBottom: 10 },
  opcoes: { flexDirection: 'column', gap: 10 },
  botao: { backgroundColor: '#5A5A5A', padding: 10, borderRadius: 8, marginBottom: 5 },
  botaoSelecionado: { backgroundColor: '#FF6B00' },
  botaoTexto: { color: '#fff', textAlign: 'center' },
  input: { backgroundColor: '#5A5A5A', color: '#fff', padding: 10, borderRadius: 8, marginTop: 10 },
  enviarButton: { backgroundColor: '#5A5A5A', padding: 13, borderRadius: 15, alignItems: 'center', marginTop: 10 },
  enviarTexto: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
