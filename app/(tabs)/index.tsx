// app/(tabs)/index.tsx

import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { Link, useFocusEffect } from 'expo-router';
// CAMINHO CORRIGIDO AQUI
import { getFavoriteIds } from '../../services/favoritesManager';

const HomeScreen = () => {
  const [search, setSearch] = useState('');
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [searchedMeals, setSearchedMeals] = useState<any[]>([]);
  const [selectedMeal, setSelectedMeal] = useState<any | null>(null);
  
  // Estados para a lista de favoritos
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [favoriteMeals, setFavoriteMeals] = useState<any[]>([]);
  const [loadingFavorites, setLoadingFavorites] = useState(true);

  // useFocusEffect recarrega os favoritos sempre que a tela ganha foco
  useFocusEffect(
    useCallback(() => {
      const loadFavorites = async () => {
        setLoadingFavorites(true);
        const ids = await getFavoriteIds();
        setFavoriteIds(ids);

        if (ids.length > 0) {
          try {
            const mealPromises = ids.map(id => 
              fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`).then(res => res.json())
            );
            const mealsResults = await Promise.all(mealPromises);
            const meals = mealsResults.map(result => result.meals[0]).filter(Boolean);
            setFavoriteMeals(meals);
          } catch (error) {
            Alert.alert("Erro", "Não foi possível carregar seus favoritos.");
            setFavoriteMeals([]);
          }
        } else {
          setFavoriteMeals([]);
        }
        setLoadingFavorites(false);
      };

      loadFavorites();
    }, [])
  );
  
  const fetchMeals = async (query: string) => {
    setLoadingSearch(true);
    try {
      const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Erro de rede. Verifique sua conexão.");
      const data = await res.json();
      setSearchedMeals(data.meals || []);
      if (query) setSelectedMeal(null); 
    } catch (e: any) {
      Alert.alert("Erro", e.message || "Não foi possível buscar as receitas.");
      setSearchedMeals([]);
    } finally {
      setLoadingSearch(false);
    }
  };
  
  useEffect(() => {
    fetchMeals('chicken');
  }, []);

  const handleSearch = () => {
    if (search.trim()) {
      fetchMeals(search);
    } else {
      fetchMeals('chicken');
    }
  };

  const renderMealCard = ({ item }: { item: any }) => (
    <View style={styles.cardSmall}>
      <TouchableOpacity onPress={() => setSelectedMeal(item)}>
        <Image source={{ uri: item.strMealThumb }} style={styles.smallImage} />
        {favoriteIds.includes(item.idMeal) && <Text style={styles.favoriteIndicator}>★</Text>}
        <Text style={styles.mealName} numberOfLines={2}>{item.strMeal}</Text>
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
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchText}>Buscar</Text>
        </TouchableOpacity>
      </View>

      {/* SEÇÃO DE FAVORITOS */}
      {loadingFavorites ? (
        <ActivityIndicator style={{ marginVertical: 20 }} size="large" color="#FF6347" />
      ) : favoriteMeals.length > 0 ? (
        <>
          <Text style={styles.section}>❤️ Meus Favoritos</Text>
          <FlatList
            data={favoriteMeals}
            horizontal
            renderItem={renderMealCard}
            keyExtractor={(item) => `fav-${item.idMeal}`}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 10 }}
          />
        </>
      ) : (
        <View style={styles.emptyFavoritesContainer}>
            <Text style={styles.emptyFavoritesText}>Sua lista de favoritos está vazia.</Text>
            <Text style={styles.emptyFavoritesSubText}>Use o '☆' para adicionar receitas!</Text>
        </View>
      )}

      {/* SEÇÃO DE BUSCA/POPULARES */}
      <Text style={styles.section}>{search.trim() ? `Resultados para "${search}"` : '🍛 Populares'}</Text>
      {loadingSearch ? (
        <ActivityIndicator style={{ marginVertical: 20 }} size="large" color="#FF6347" />
      ) : searchedMeals.length > 0 ? (
        <FlatList
          data={searchedMeals}
          horizontal
          renderItem={renderMealCard}
          keyExtractor={(item) => item.idMeal}
          showsHorizontalScrollIndicator={false}
        />
      ) : (
         <Text style={styles.emptyText}>Nenhuma receita encontrada.</Text>
      )}

      {/* PREVIEW DO ITEM SELECIONADO */}
      {selectedMeal && (
        <View style={styles.previewCard}>
          <Image source={{ uri: selectedMeal.strMealThumb }} style={styles.previewImage} />
          <Text style={styles.previewTitle}>{selectedMeal.strMeal}</Text>
          <Text style={styles.previewMeta}>
            {selectedMeal.strCategory} • {selectedMeal.strArea}
          </Text>
          <Text style={styles.previewDesc} numberOfLines={3}>
            {selectedMeal.strInstructions.trim()}
          </Text>
          <Link 
            href={{ pathname: "/info", params: { mealId: selectedMeal.idMeal } }}
            asChild
          >
            <TouchableOpacity style={styles.detailButton}>
              <Text style={styles.detailText}>Ver Detalhes</Text>
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  logo: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', color: '#FF6347', marginTop: 10 },
  welcome: { fontSize: 16, textAlign: 'center', color: '#555', marginBottom: 20 },
  searchContainer: { flexDirection: 'row', marginBottom: 20 },
  input: { flex: 1, backgroundColor: '#f0f0f0', borderRadius: 10, paddingHorizontal: 14, fontSize: 16, height: 44, },
  searchButton: { marginLeft: 10, backgroundColor: '#FF6347', paddingHorizontal: 16, borderRadius: 10, justifyContent: 'center', },
  searchText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  section: { fontSize: 20, fontWeight: '600', color: '#333', marginBottom: 10, marginTop: 20 },
  emptyText: { color: '#888', textAlign: 'center', marginVertical: 20 },
  cardSmall: { marginRight: 12, width: 140, backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 3, },
  smallImage: { width: '100%', height: 100 },
  favoriteIndicator: { position: 'absolute', top: 6, right: 6, fontSize: 18, color: '#FFC700', textShadowColor: 'rgba(0, 0, 0, 0.75)', textShadowOffset: {width: 0, height: 1}, textShadowRadius: 2 },
  mealName: { fontSize: 14, fontWeight: '500', color: '#444', textAlign: 'center', padding: 8, height: 50 },
  previewCard: { backgroundColor: '#fff', marginTop: 30, borderRadius: 16, padding: 16, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, elevation: 4, },
  previewImage: { width: '100%', height: 200, borderRadius: 12, marginBottom: 10 },
  previewTitle: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  previewMeta: { fontSize: 14, color: '#666', marginVertical: 4 },
  previewDesc: { fontSize: 16, color: '#444', marginTop: 10, textAlign: 'justify' },  
  detailButton: { marginTop: 16, backgroundColor: '#FF6347', padding: 12, borderRadius: 10, alignItems: 'center', },
  detailText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  aboutButton: { marginTop: 30, marginBottom: 40, backgroundColor: '#6c757d', padding: 12, borderRadius: 10, alignItems: 'center', },
  aboutButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold', },
  emptyFavoritesContainer: { alignItems: 'center', paddingVertical: 20, backgroundColor: '#FFF3ED', borderRadius: 12, marginHorizontal: 5, marginBottom: 10 },
  emptyFavoritesText: { fontSize: 16, fontWeight: 'bold', color: '#FF6347' },
  emptyFavoritesSubText: { fontSize: 14, color: '#FF8C69', marginTop: 4 },
});

export default HomeScreen;