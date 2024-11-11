import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';

const Stack = createStackNavigator();

const LoginScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleLogin = () => {
    if (name && phone) {
      navigation.navigate('Main');
    } else {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nome Completo:</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Digite seu nome completo"
      />
      <Text style={styles.label}>Telefone:</Text>
      <TextInput
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        placeholder="Digite seu telefone"
        keyboardType="phone-pad"
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

const MainScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Bem-vindo à Tela Principal!</Text>
    </View>
  );
};


import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TextInput,
  Button,
  View,
  Text
} from 'react-native';

const App = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = () => {
    if (name && phone) {
      setLoggedIn(true);
    } else {
      alert('Por favor, preencha todos os campos.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {loggedIn ? (
        <View style={styles.mainContainer}>
          <Text style={styles.welcomeText}>Bem-vindo, {name}!</Text>
          {/* Conteúdo da tela principal do aplicativo */}
        </View>
      ) : (
        <View style={styles.loginContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nome completo"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Telefone"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
          <Button title="Entrar" onPress={handleLogin} />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loginContainer: {
    width: '100%',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
  },
  mainContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 20,
  },
});


export default App;
