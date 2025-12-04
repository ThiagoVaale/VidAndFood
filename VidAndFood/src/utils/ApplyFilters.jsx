import React from 'react'
import { toSlug } from './Slugs';

function applyFilters( wines, filters = {} ) {
  return wines.filter((wine) => {
    if (filters.price) {
      const { min, max } = filters.price;
      const price = wine.precio_promedio ?? 0;
      if (price < min || price > max){
        return false;
      } 
    }

    if (filters.rating) {
      if (wine.rating < filters.rating){
        return false;
      }
    }

    if (filters.brand?.length) {
      const brandSlug = toSlug(wine.bodega);          
      if (!filters.brand.includes(brandSlug)) return false;
    }

    if (filters.type?.length) {
      const typeSlug = toSlug(wine.tipo || wine.type);
      if (!filters.type.includes(typeSlug)) return false;
    }

    if (filters.region?.length) {
      const regionSlug = toSlug(wine.region);
      if (!filters.region.includes(regionSlug)) return false;
    }

    if (filters.grape?.length) {
      const grapeSlug = toSlug(wine.variedad_uva);
      if (!filters.grape.includes(grapeSlug)) return false;
    }

    return true;
  });
}

export default applyFilters;