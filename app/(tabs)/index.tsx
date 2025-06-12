// Remova todo o estado e funções relacionadas a favoritos
// Remova o TouchableOpacity e o Text do botão de favorito do renderMeal

import React, { useEffect, useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, ScrollView } from 'react-native';
import { Link } from 'expo-router';

const HomeScreen = () => {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [popularMeals, setPopularMeals] = useState<any[]>([]);
  const [selectedMeal, setSelectedMeal] = useState<any | null>(null);

  const fetchMeals = async (query = '') => {
    const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`;
    const res = await fetch(url);
    const data = await res.json();
    return data.meals || [];
  };

  const loadInitial = async () => {
    setLoading(true);
    const meals = await fetchMeals('chicken');
    setPopularMeals(meals);
    setLoading(false);
  };

  useEffect(() => {
    loadInitial();
  }, []);

  const handleSearch = async () => {
    if (search.trim()) {
      setLoading(true);
      const meals = await fetchMeals(search);
      setPopularMeals(meals);
      setSelectedMeal(null);
      setLoading(false);
    }
  };

  const renderMeal = ({ item }: { item: any }) => (
    <View style={styles.cardSmall}>
      <TouchableOpacity onPress={() => setSelectedMeal(item)}>
        <Image source={{ uri: item.strMealThumb }} style={styles.smallImage} />
        <Text style={styles.mealName}>{item.strMeal}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.logo}>🍴 Cookify</Text>
      <Text style={styles.welcome}>Explore receitas incríveis</Text>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Buscar receita..."
          value={search}
          onChangeText={setSearch}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchText}>Buscar</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#FF6347" />
      ) : (
        <>
          <Text style={styles.section}>🍛 Receitas encontradas</Text>
          <FlatList
            data={popularMeals}
            horizontal
            renderItem={renderMeal}
            keyExtractor={(item) => item.idMeal}
            showsHorizontalScrollIndicator={false}
          />
        </>
      )}

      {selectedMeal && (
        <View style={styles.previewCard}>
          <Image source={{ uri: selectedMeal.strMealThumb }} style={styles.previewImage} />
          <Text style={styles.previewTitle}>{selectedMeal.strMeal}</Text>
          <Text style={styles.previewMeta}>
            {selectedMeal.strCategory} • {selectedMeal.strArea}
          </Text>
          <Text style={styles.previewDesc}>
            {selectedMeal.strInstructions.substring(0, 140).trim() + '...'}
          </Text>
          <Link 
            href={{
              pathname: "/info",
              params: { mealId: selectedMeal.idMeal }
            }}
            asChild
          >
            <TouchableOpacity style={styles.detailButton}>
              <Text style={styles.detailText}>Ver Informações</Text>
            </TouchableOpacity>
          </Link>
        </View>
      )}

      <Link href="/DetalheApp" asChild>
        <TouchableOpacity style={styles.aboutButton}>
          <Text style={styles.aboutButtonText}>Sobre Nós</Text>
        </TouchableOpacity>
      </Link>
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { 
  flex: 1,
  backgroundColor: '#fff',
  padding: 16 
},
  logo: {
 fontSize: 32,
 fontWeight: 'bold',
 textAlign: 'center',
 color: '#FF6347',
 marginTop: 10 
},
  welcome: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
    marginBottom: 20
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 20
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 16,
    height: 44,
  },
  searchButton: {
    marginLeft: 10,
    backgroundColor: '#FF6347',
    paddingHorizontal: 16,
    borderRadius: 10,
    justifyContent: 'center',
  },
  searchText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  section: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10
  },
  cardSmall: {
    marginRight: 12,
    width: 140,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
    paddingBottom: 8,
  },
  smallImage: {
    width: '100%',
    height: 100
  },
  mealName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#444',
    textAlign: 'center',
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  previewCard: {
    backgroundColor: '#fff',
    marginTop: 30,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 10
  },
  previewTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333'
  },
  previewMeta: {
    fontSize: 14,
    color: '#666',
    marginVertical: 4
  },
  previewDesc: {
    fontSize: 16,
    color: '#444',
    marginTop: 10,
    textAlign: 'justify'
  },  
  detailButton: {
    marginTop: 16,
    backgroundColor: '#FF6347',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  detailText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  aboutButton: {
    marginTop: 30,
    marginBottom: 40,
    backgroundColor: '#6c757d',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  aboutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
