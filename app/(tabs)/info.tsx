// app/info.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router'; // IMPORTANTE: hook do expo-router

type Ingredient = { id: number; ingredient: string; measure: string; };

const InfoScreen = () => {
  const { mealId } = useLocalSearchParams(); // Pega o parâmetro 'mealId' da URL
  const [meal, setMeal] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

  useEffect(() => {
    const fetchMealDetails = async () => {
      if (!mealId) return;
      try {
        const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`;
        const res = await fetch(url);
        const data = await res.json();
        
        if (data.meals && data.meals[0]) {
          const mealData = data.meals[0];
          setMeal(mealData);

          // Processar ingredientes
          const ingredientsList: Ingredient[] = [];
          for (let i = 1; i <= 20; i++) {
            const ingredient = mealData[`strIngredient${i}`];
            const measure = mealData[`strMeasure${i}`];
            if (ingredient && ingredient.trim() !== '') {
              ingredientsList.push({ id: i, ingredient, measure: measure || '' });
            }
          }
          setIngredients(ingredientsList);
        }
      } catch (error) {
        console.error("Failed to fetch meal details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMealDetails();
  }, [mealId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#FF6347" style={{ flex: 1, justifyContent: 'center' }} />;
  }

  if (!meal) {
    return <View style={styles.container}><Text>Receita não encontrada.</Text></View>;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ title: meal.strMeal }} />
      <ScrollView>
        <Image source={{ uri: meal.strMealThumb }} style={styles.mealImage} />
        <View style={styles.detailsContainer}>
          <Text style={styles.title}>{meal.strMeal}</Text>
          <Text style={styles.meta}>Categoria: {meal.strCategory} • Origem: {meal.strArea}</Text>
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
  container: { flex: 1 },
  mealImage: { width: '100%', height: 250 },
  detailsContainer: { padding: 20 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  meta: { fontSize: 15, color: '#666', marginBottom: 16 },
  separator: { height: 1, backgroundColor: '#e0e0e0', marginVertical: 20 },
  sectionTitle: { fontSize: 20, fontWeight: '600', color: '#FF6347', marginBottom: 12 },
  ingredientItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  ingredientText: { fontSize: 16, color: '#444' },
  measureText: { fontSize: 16, color: '#888', fontStyle: 'italic' },
  instructions: { fontSize: 16, color: '#444', lineHeight: 24, textAlign: 'justify' },
});


export default InfoScreen;