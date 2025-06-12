import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react'; // Adicionado useEffect e useRef
import { View, Text, Image, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity, Animated } from 'react-native';

const logoUrl = 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Bitmap_Logo.png';

const ORANGE = '#FF6347';
const ORANGE_DARK = '#FF4500';
const LIGHT_ORANGE = '#FFF3ED';

// CORRIGIDO: Implementação completa do componente AnimatedTopic
const AnimatedTopic: React.FC<any> = ({ children, style }) => {
    // Usamos useRef para manter o valor da animação sem recriá-lo a cada renderização
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const translateYAnim = useRef(new Animated.Value(20)).current;

    // useEffect é usado para iniciar a animação assim que o componente for montado
    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1, // Anima a opacidade de 0 para 1
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.timing(translateYAnim, {
                toValue: 0, // Anima a posição Y de 20 para 0
                duration: 400,
                useNativeDriver: true,
            }),
        ]).start();
    }, [fadeAnim, translateYAnim]);

    // Retornamos um Animated.View que aplica os estilos de animação
    return (
        <Animated.View
            style={[
                style, // Aplica os estilos originais passados via props
                {
                    opacity: fadeAnim, // Aplica a opacidade animada
                    transform: [{ translateY: translateYAnim }], // Aplica a translação animada
                },
            ]}
        >
            {children}
        </Animated.View>
    );
};

const DetailScreen: React.FC = () => {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                {/* O caractere '‹' é melhor para ícones de "voltar" do que '<' */}
                <Text style={styles.backButtonText}>‹</Text> 
            </TouchableOpacity>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.appDescriptionContainer}>
                    <View style={styles.headerRow}>
                        <Text style={styles.appTitle}>Cookify</Text>
                        <Image
                            source={{ uri: logoUrl }}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                    </View>
                    <Text style={styles.appDescription}>
                        O Cookify é um aplicativo inovador para quem ama cozinhar ou deseja aprender novas receitas. 
                        Ele oferece uma vasta coleção de receitas detalhadas, com ingredientes, modo de preparo e imagens ilustrativas.
                    </Text>
                    <AnimatedTopic style={styles.sectionTitle}>Como funciona?</AnimatedTopic>
                    <Text style={styles.appDescription}>
                        Navegue pelo catálogo, escolha uma receita e visualize todos os detalhes necessários para prepará-la. 
                        Você pode conferir os ingredientes, seguir o passo a passo do modo de preparo e se inspirar com fotos dos pratos.
                    </Text>
                    <AnimatedTopic style={styles.sectionTitle}>O que o Cookify proporciona?</AnimatedTopic>
                    <Text style={styles.appDescription}>
                        Praticidade na cozinha, inspiração para novas refeições e facilidade para encontrar receitas de acordo com seu gosto. 
                        Torne seu dia a dia mais saboroso e divertido com o Cookify!
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: LIGHT_ORANGE,
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 16,
        backgroundColor: 'rgba(255, 99, 71, 0.8)', 
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        zIndex: 10,
    },
    backButtonText: {
        color: '#fff',
        fontSize: 30, // Aumentei um pouco para preencher melhor
        fontWeight: 'bold',
        // AJUSTE: Removido o lineHeight para melhorar a centralização vertical do caractere
    },
    scrollContainer: {
        padding: 16,
        paddingTop: 80, // Aumentei um pouco o padding para dar mais espaço ao botão
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

export default DetailScreen;