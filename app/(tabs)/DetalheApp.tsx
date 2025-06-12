import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Pressable,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';

const logoUrl = 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Bitmap_Logo.png';

const ORANGE = '#FF6347';
const ORANGE_DARK = '#FF4500';
const LIGHT_ORANGE = '#FFF3ED';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LIGHT_ORANGE,
  },
  scrollContainer: {
    padding: 16,
  },
  backButton: {
    padding: 10,
    backgroundColor: ORANGE,
    borderRadius: 8,
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  backText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  appDescriptionContainer: {
    marginBottom: 24,
    alignItems: 'flex-start',
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: ORANGE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: ORANGE,
    marginRight: 8,
    textAlign: 'left',
    alignSelf: 'flex-start',
    letterSpacing: 1,
  },
  logo: {
    width: 40,
    height: 40,
  },
  appDescription: {
    fontSize: 16,
    color: '#555',
    textAlign: 'left',
    marginBottom: 8,
    alignSelf: 'flex-start',
    borderRadius: 8,
    padding: 6,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'left',
    alignSelf: 'flex-start',
    color: ORANGE_DARK,
    borderRadius: 8,
    padding: 6,
  },
});

const AnimatedTopic: React.FC<{ style?: any; children?: React.ReactNode }> = ({
  children,
  style,
}) => {
  const scale = React.useRef(new Animated.Value(1)).current;

  const handleHoverIn = () => {
    Animated.spring(scale, {
      toValue: 1.05,
      useNativeDriver: true,
    }).start();
  };

  const handleHoverOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable
      onHoverIn={handleHoverIn}
      onHoverOut={handleHoverOut}
      style={{ width: '100%' }}
    >
      <Animated.Text
        style={[
          style,
          {
            transform: [{ scale }],
            backgroundColor: scale.interpolate({
              inputRange: [1, 1.05],
              outputRange: ['transparent', '#FFE5D0'],
            }),
          },
        ]}
      >
        {children}
      </Animated.Text>
    </Pressable>
  );
};

const DetailScreen: React.FC = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← Voltar</Text>
        </TouchableOpacity>

        <View style={styles.appDescriptionContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.appTitle}>🍴 Cookify</Text>
            <Image source={{ uri: logoUrl }} style={styles.logo} resizeMode="contain" />
          </View>
          <Text style={styles.appDescription}>
            O Cookify é um aplicativo inovador para quem ama cozinhar ou deseja aprender novas receitas.
          </Text>
          <AnimatedTopic style={styles.sectionTitle}>Como funciona?</AnimatedTopic>
          <Text style={styles.appDescription}>
            Navegue pelo catálogo, escolha uma receita e visualize todos os detalhes necessários para prepará-la.
          </Text>
          <AnimatedTopic style={styles.sectionTitle}>O que o Cookify proporciona?</AnimatedTopic>
          <Text style={styles.appDescription}>
            Praticidade na cozinha, inspiração para novas refeições e facilidade para encontrar receitas de acordo com seu gosto.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DetailScreen;
