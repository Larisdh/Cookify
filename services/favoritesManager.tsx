// services/favoritesManager.tsx

import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = '@Cookify:favorites';

/**
 * Carrega a lista de IDs de favoritos do AsyncStorage.
 * @returns {Promise<string[]>} Um array com os IDs dos favoritos.
 */
export const getFavoriteIds = async (): Promise<string[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(FAVORITES_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error("Failed to load favorites.", e);
    return [];
  }
};

/**
 * Salva a lista de IDs de favoritos no AsyncStorage.
 * @param {string[]} ids - O array completo de IDs para salvar.
 */
const saveFavoriteIds = async (ids: string[]): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(ids);
    await AsyncStorage.setItem(FAVORITES_KEY, jsonValue);
  } catch (e) {
    console.error("Failed to save favorites.", e);
  }
};

/**
 * Adiciona um ID à lista de favoritos.
 * @param {string} mealId - O ID da receita a ser favoritada.
 */
export const addFavorite = async (mealId: string): Promise<void> => {
  const currentFavorites = await getFavoriteIds();
  if (!currentFavorites.includes(mealId)) {
    const newFavorites = [...currentFavorites, mealId];
    await saveFavoriteIds(newFavorites);
  }
};

/**
 * Remove um ID da lista de favoritos.
 * @param {string} mealId - O ID da receita a ser desfavoritada.
 */
export const removeFavorite = async (mealId: string): Promise<void> => {
  const currentFavorites = await getFavoriteIds();
  const newFavorites = currentFavorites.filter(id => id !== mealId);
  await saveFavoriteIds(newFavorites);
};