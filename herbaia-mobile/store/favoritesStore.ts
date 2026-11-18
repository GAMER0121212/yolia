import {
  agregarFavorito,
  obtenerFavoritos,
  PlantaApi,
  quitarFavorito,
} from '@/services/plantsApi';
import { useSyncExternalStore } from 'react';

let favorites: PlantaApi[] = [];
let loaded = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

export function subscribeFavorites(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getFavorites() {
  return favorites;
}

export function isFavorite(id: string | number) {
  return favorites.some((plant) => plant.id_planta === Number(id));
}

export async function loadFavorites() {
  favorites = await obtenerFavoritos();
  loaded = true;
  emit();
}

export async function toggleFavorite(plant: PlantaApi) {
  if (isFavorite(plant.id_planta)) {
    await quitarFavorito(plant.id_planta);
    favorites = favorites.filter((item) => item.id_planta !== plant.id_planta);
  } else {
    await agregarFavorito(plant.id_planta);
    favorites = [plant, ...favorites];
  }

  emit();
}

export function useFavorites() {
  const items = useSyncExternalStore(
    subscribeFavorites,
    getFavorites,
    getFavorites
  );

  return {
    favorites: items,
    loaded,
    isFavorite,
    toggleFavorite,
    refresh: loadFavorites,
  };
}
