export enum ExerciseCategory {
  CHEST = 'chest',
  ARM = 'arm',
  SHOULDER = 'shoulder',
  BACK = 'back',
  LEG = 'leg',
  ABS = 'abs',
}

export enum ExerciseSubCategory {
  // Chest
  CHEST_UPPER = 'upperChest',
  CHEST_MIDDLE = 'middleChest',
  CHEST_LOWER = 'lowerChest',

  // Arm
  ARM_BICEPS = 'biceps',
  ARM_TRICEPS = 'triceps',
  ARM_FOREARMS = 'forearms',

  // Shoulder
  SHOULDER_FRONT = 'frontDelts',
  SHOULDER_SIDE = 'sideDelts',
  SHOULDER_REAR = 'rearDelts',

  // Back
  BACK_LATS = 'lats',
  BACK_UPPER = 'upperBack',
  BACK_LOWER = 'lowerBack',

  // Leg
  LEG_QUADS = 'quads',
  LEG_HAMSTRINGS = 'hamstrings',
  LEG_GLUTES = 'glutes',
  LEG_CALVES = 'calves',

  // Abs
  ABS_UPPER = 'upperAbs',
  ABS_LOWER = 'lowerAbs',
  ABS_OBLIQUES = 'obliques',
}

export enum ExerciseLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
}

export const EXERCISE_SUBCATEGORIES_BY_CATEGORY: Record<
  ExerciseCategory,
  ExerciseSubCategory[]
> = {
  [ExerciseCategory.CHEST]: [
    ExerciseSubCategory.CHEST_UPPER,
    ExerciseSubCategory.CHEST_MIDDLE,
    ExerciseSubCategory.CHEST_LOWER,
  ],
  [ExerciseCategory.ARM]: [
    ExerciseSubCategory.ARM_BICEPS,
    ExerciseSubCategory.ARM_TRICEPS,
    ExerciseSubCategory.ARM_FOREARMS,
  ],
  [ExerciseCategory.SHOULDER]: [
    ExerciseSubCategory.SHOULDER_FRONT,
    ExerciseSubCategory.SHOULDER_SIDE,
    ExerciseSubCategory.SHOULDER_REAR,
  ],
  [ExerciseCategory.BACK]: [
    ExerciseSubCategory.BACK_LATS,
    ExerciseSubCategory.BACK_UPPER,
    ExerciseSubCategory.BACK_LOWER,
  ],
  [ExerciseCategory.LEG]: [
    ExerciseSubCategory.LEG_QUADS,
    ExerciseSubCategory.LEG_HAMSTRINGS,
    ExerciseSubCategory.LEG_GLUTES,
    ExerciseSubCategory.LEG_CALVES,
  ],
  [ExerciseCategory.ABS]: [
    ExerciseSubCategory.ABS_UPPER,
    ExerciseSubCategory.ABS_LOWER,
    ExerciseSubCategory.ABS_OBLIQUES,
  ],
};

export function isSubCategoryAllowedForCategory(
  category: ExerciseCategory,
  subCategory: ExerciseSubCategory,
): boolean {
  return EXERCISE_SUBCATEGORIES_BY_CATEGORY[category]?.includes(subCategory);
}
