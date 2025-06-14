import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';

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
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

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

  const isFavorite = favoriteIds.includes(String(mealId));

  const toggleFavorite = () => {
    setFavoriteIds((prev) =>
      isFavorite
        ? prev.filter((id) => id !== String(mealId))
        : [...prev, String(mealId)]
    );
  };

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color="#FF6347"
        style={{ flex: 1, justifyContent: 'center' }}
      />
    );
  }

  if (!meal) {
    return (
      <View style={styles.container}>
        <Text>Receita não encontrada.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ title: meal.strMeal }} />
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backText}>← Voltar</Text>
      </TouchableOpacity>
      <ScrollView>
        <Image source={{ uri: meal.strMealThumb }} style={styles.mealImage} />
        <View style={styles.detailsContainer}>
          <Text style={styles.title}>{meal.strMeal}</Text>
          <Text style={styles.meta}>
            Categoria: {meal.strCategory} • Origem: {meal.strArea}
          </Text>

          <TouchableOpacity
            onPress={toggleFavorite}
            style={[
              styles.favoriteButton,
              isFavorite && styles.favoriteButtonActive,
            ]}
          >
            <Text
              style={[
                styles.favoriteText,
                isFavorite && styles.favoriteTextActive,
              ]}
            >
              {isFavorite ? '★ Favorito' : '☆ Favoritar'}
            </Text>
          </TouchableOpacity>

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
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    padding: 10,
    backgroundColor: '#FF6347',
    margin: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  backText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  mealImage: {
    width: '100%',
    height: 250,
  },
  detailsContainer: {
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  meta: {
    fontSize: 15,
    color: '#666',
    marginBottom: 16,
  },
  separator: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FF6347',
    marginBottom: 12,
  },
  ingredientItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  ingredientText: {
    fontSize: 16,
    color: '#444',
  },
  measureText: {
    fontSize: 16,
    color: '#888',
    fontStyle: 'italic',
  },
  instructions: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
    textAlign: 'justify',
  },
  favoriteButton: {
    alignSelf: 'flex-end',
    marginBottom: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  favoriteButtonActive: {
    backgroundColor: '#FFE5D0',
  },
  favoriteText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#aaa',
  },
  favoriteTextActive: {
    color: '#FF6347',
  },
});

export default InfoScreen;
