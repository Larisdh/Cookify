import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
  ScrollView,
  Linking,
} from 'react-native';

const HomeScreen = () => {
  const [meals, setMeals] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchMeals = async (query = '') => {
    setLoading(true);
    try {
      const url = query
        ? `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
        : `https://www.themealdb.com/api/json/v1/1/random.php`;
      const res = await fetch(url);
      const data = await res.json();
      setMeals(data.meals || []);
    } catch (error) {
      console.error('Erro ao buscar receitas:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMeals();
  }, []);

  const handleSearch = () => {
    if (search.trim() !== '') {
      fetchMeals(search);
    }
  };

  const handleOpenDetails = (meal) => {
    setSelectedMeal(meal);
    setModalVisible(true);
  };

  const getIngredients = (meal) => {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (ingredient && ingredient.trim()) {
        ingredients.push(`${measure} ${ingredient}`);
      }
    }
    return ingredients;
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.strMealThumb }} style={styles.image} />
      <Text style={styles.title}>{item.strMeal}</Text>
      <TouchableOpacity style={styles.button} onPress={() => handleOpenDetails(item)}>
        <Text style={styles.buttonText}>Ver Detalhes</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🍲 Cookify</Text>

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
        <FlatList
          data={meals}
          keyExtractor={(item) => item.idMeal}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}

      {/* Modal com detalhes da receita */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setModalVisible(false)}
      >
        {selectedMeal && (
          <ScrollView style={styles.modalContent}>
            <Image source={{ uri: selectedMeal.strMealThumb }} style={styles.modalImage} />
            <Text style={styles.modalTitle}>{selectedMeal.strMeal}</Text>

            <Text style={styles.modalSubtitle}>🍴 Ingredientes:</Text>
            {getIngredients(selectedMeal).map((item, index) => (
              <Text key={index} style={styles.ingredient}>{item}</Text>
            ))}

            <Text style={styles.modalSubtitle}>📖 Instruções:</Text>
            <Text style={styles.instructions}>{selectedMeal.strInstructions}</Text>

            {selectedMeal.strYoutube ? (
              <TouchableOpacity onPress={() => Linking.openURL(selectedMeal.strYoutube)}>
                <Text style={styles.videoLink}>▶️ Ver vídeo no YouTube</Text>
              </TouchableOpacity>
            ) : null}

            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.buttonText}>Fechar</Text>
            </TouchableOpacity>
          </ScrollView>
        )}
      </Modal>
    </View>
  );
};

export default HomeScreen;
const styles = StyleSheet.create