// app/(tabs)/info.tsx

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
  Alert
} from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
// CAMINHO CORRIGIDO AQUI
import { getFavoriteIds, addFavorite, removeFavorite } from '../../services/favoritesManager';

type Ingredient = {
  id: number;
  ingredient: string;
  measure: string;
};

const InfoScreen = () => {
  const router = useRouter();
  const { mealId } = useLocalSearchParams();
  const [meal, setMeal] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);

  useEffect(() => {
    const loadFavoriteStatus = async () => {
      if (!mealId) return;
      const favoriteIds = await getFavoriteIds();
      setIsFavorite(favoriteIds.includes(String(mealId)));
    };
    loadFavoriteStatus();
  }, [mealId]);
  
  useEffect(() => {
    const fetchMealDetails = async () => {
      if (!mealId) { setLoading(false); return; }
      setLoading(true);
      try {
        const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Falha na comunicação com a API");
        const data = await res.json();

        if (data.meals && data.meals[0]) {
          const mealData = data.meals[0];
          setMeal(mealData);

          const ingredientsList: Ingredient[] = [];
          for (let i = 1; i <= 20; i++) {
            const ingredient = mealData[`strIngredient${i}`];
            const measure = mealData[`strMeasure${i}`];
            if (ingredient && ingredient.trim() !== '') {
              ingredientsList.push({ id: i, ingredient, measure: measure || '' });
            }
          }
          setIngredients(ingredientsList);
        } else { throw new Error("Receita não encontrada."); }
      } catch (error: any) {
        Alert.alert("Erro", error.message || "Não foi possível carregar os detalhes da receita.");
      } finally { setLoading(false); }
    };

    fetchMealDetails();
  }, [mealId]);
  
  const toggleFavorite = async () => {
    if (!mealId || isTogglingFavorite) return;
    
    setIsTogglingFavorite(true);
    try {
      const mealIdStr = String(mealId);
      if (isFavorite) {
        await removeFavorite(mealIdStr);
      } else {
        await addFavorite(mealIdStr);
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
        Alert.alert("Erro", "Não foi possível atualizar seus favoritos.");
    } finally {
        setIsTogglingFavorite(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FF6347" />
      </View>
    );
  }

  if (!meal) {
    return (
      <SafeAreaView style={styles.safeArea}>
         <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backText}>← Voltar</Text>
         </TouchableOpacity>
         <View style={styles.centerContainer}>
            <Text>Receita não encontrada. Tente novamente.</Text>
         </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ title: meal.strMeal, headerBackTitle: 'Voltar' }} />
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backText}>← Voltar</Text>
      </TouchableOpacity>
      <ScrollView>
        <Image source={{ uri: meal.strMealThumb }} style={styles.mealImage} />
        <View style={styles.detailsContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>{meal.strMeal}</Text>
            <TouchableOpacity
              onPress={toggleFavorite}
              style={[styles.favoriteButton, isFavorite && styles.favoriteButtonActive]}
              disabled={isTogglingFavorite}
            >
              {isTogglingFavorite ? (
                <ActivityIndicator size="small" color={isFavorite ? '#FF6347' : '#aaa'}/>
              ) : (
                <Text style={[styles.favoriteText, isFavorite && styles.favoriteTextActive]}>
                  {isFavorite ? '★' : '☆'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
          
          <Text style={styles.meta}>
            Categoria: {meal.strCategory} • Origem: {meal.strArea}
          </Text>

          <View style={styles.separator} />
          <Text style={styles.sectionTitle}>Ingredientes</Text>
          {ingredients.map((item) => (
            <View key={item.id} style={styles.ingredientItem}>
              <Text style={styles.ingredientText}>{item.ingredient}</Text>
              <Text style={styles.measureText}>{item.measure}</Text>
            </View>
          ))}
          <View style={styles.separator} />
          <Text style={styles.sectionTitle}>Modo de Preparo</Text>
          <Text style={styles.instructions}>{meal.strInstructions}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  backButton: { padding: 10, backgroundColor: '#FF6347', margin: 12, borderRadius: 8, alignSelf: 'flex-start' },
  backText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  mealImage: { width: '100%', height: 250 },
  detailsContainer: { padding: 20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#333', flex: 1, marginRight: 10 },
  meta: { fontSize: 15, color: '#666', marginBottom: 16 },
  separator: { height: 1, backgroundColor: '#e0e0e0', marginVertical: 20 },
  sectionTitle: { fontSize: 20, fontWeight: '600', color: '#FF6347', marginBottom: 12 },
  ingredientItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  ingredientText: { fontSize: 16, color: '#444' },
  measureText: { fontSize: 16, color: '#888', fontStyle: 'italic' },
  instructions: { fontSize: 16, color: '#444', lineHeight: 24, textAlign: 'justify' },
  favoriteButton: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f0f0', borderRadius: 22 },
  favoriteButtonActive: { backgroundColor: '#FFE5D0' },
  favoriteText: { fontSize: 24, color: '#aaa' },
  favoriteTextActive: { color: '#FF6347' },
});

export default InfoScreen;