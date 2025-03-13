import { FC, useMemo } from 'react';

import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useSelector } from '../../services/store';
import { getIngredientsWithSelector } from '../../services/slices/ingredients';
import { useParams } from 'react-router-dom';

export const IngredientDetails: FC = () => {
  const { id: ingredientId } = useParams();
  const ingredients = useSelector(getIngredientsWithSelector);

  const ingredientData = useMemo(
    () => ingredients.find((item) => item._id === ingredientId),
    [ingredients, ingredientId]
  );

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
