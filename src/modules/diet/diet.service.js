import httpStatus from 'http-status';
import slugify from 'slugify';
import { DietPlan } from './diet.model.js';
import { User } from '../user/user.model.js';
import { AppError } from '../../shared/appError.js';
import { paginate } from '../../shared/pagination.js';
import { toggleArrayField, addIsLiked } from '../../shared/socialToggle.js';
import { findByIdOrFail, updateByIdOrFail } from '../../shared/crudOperations.js';
import { createNotification } from '../../shared/pushNotification.js';
import { BMIRecord } from '../bmi/bmi.model.js';

const BMI_DIET_MAP = {
  underweight: { category: 'muscle-gain', minCalories: 2500, maxCalories: 3500 },
  normal:      { category: 'bulking',     minCalories: 1800, maxCalories: 2500 },
  overweight:  { category: 'weight-loss', minCalories: 1200, maxCalories: 1800 },
  obese:       { category: 'cutting',     minCalories: 1000, maxCalories: 1500 },
};

const GOAL_CATEGORY_MAP = {
  lose:     ['weight-loss', 'cutting'],
  gain:     ['muscle-gain', 'bulking'],
  maintain: null, // use BMI-based mapping
};

export const createDiet = async (data, userId) => {
  const slug = slugify(data.title, { lower: true, strict: true });

  const existingDiet = await DietPlan.findOne({ slug });
  if (existingDiet) {
    throw new AppError('A diet plan with this title already exists', httpStatus.CONFLICT);
  }

  const diet = await DietPlan.create({ ...data, slug, createdBy: userId });
  return diet;
};

export const updateDiet = async (id, data) => {
  return updateByIdOrFail(DietPlan, id, data);
};

export const getDiets = async (query, userId = null) => {
  const filter = { isPublished: true };

  if (query.category) {
    filter.category = query.category;
  }

  if (query.tag) {
    filter.tags = { $in: [query.tag] };
  }

  if (query.dietType === 'veg') {
    filter.dietType = { $in: ['veg', 'both'] };
  } else if (query.dietType === 'non-veg') {
    filter.dietType = { $in: ['non-veg', 'both'] };
  }
  // dietType=both or not provided → no filter, show all

  const result = await paginate(DietPlan, filter, {
    page: query.page,
    limit: query.limit,
    sort: query.sort || { createdAt: -1 },
    populate: { path: 'createdBy', select: 'name avatar' },
    select: '-likes -followers',
  });

  // Add isLiked and isFollowed booleans for authenticated users
  if (userId) {
    result.data = await Promise.all([
      addIsLiked(DietPlan, result.data, userId, 'likes'),
      addIsLiked(DietPlan, result.data, userId, 'followers'),
    ]).then(([withLikes, withFollowers]) => {
      return withLikes.map((diet, i) => ({
        ...diet,
        isFollowed: withFollowers[i].isLiked,
      }));
    });
  }

  return result;
};

export const getDietById = async (id, userId = null) => {
  const diet = await findByIdOrFail(DietPlan, id, {
    populate: { path: 'createdBy', select: 'name avatar' },
    select: '-likes -followers',
  });

  // Add isLiked and isFollowed booleans for authenticated users
  if (userId) {
    const [withLikes] = await addIsLiked(DietPlan, [diet], userId, 'likes');
    const [withFollowers] = await addIsLiked(DietPlan, [diet], userId, 'followers');
    return {
      ...withLikes,
      isFollowed: withFollowers.isLiked,
    };
  }

  return diet;
};

export const followDiet = async (dietId, userId) => {
  const result = await toggleArrayField(DietPlan, dietId, userId, 'followers', {
    countField: 'followersCount',
    selectExclude: '-likes -followers',
  });

  if (result.isLiked && result.createdBy.toString() !== userId.toString()) {
    User.findById(userId).select('name').lean().then((user) => {
      if (user) {
        createNotification({
          userId: result.createdBy,
          title: 'New Follower',
          message: `${user.name} followed your diet plan "${result.title}"`,
          type: 'diet',
          metadata: { dietId },
        }).catch(() => {});
      }
    });
  }

  // Return with isFollowed property for clarity
  return {
    ...result,
    isFollowed: result.isLiked,
  };
};

export const likeDiet = async (dietId, userId) => {
  const result = await toggleArrayField(DietPlan, dietId, userId, 'likes', {
    countField: 'likesCount',
    selectExclude: '-likes -followers',
  });

  if (result.isLiked && result.createdBy.toString() !== userId.toString()) {
    User.findById(userId).select('name').lean().then((user) => {
      if (user) {
        createNotification({
          userId: result.createdBy,
          title: 'New Like',
          message: `${user.name} liked your diet plan "${result.title}"`,
          type: 'diet',
          metadata: { dietId },
        }).catch(() => {});
      }
    });
  }

  return result;
};

export const getSuggestedDiets = async (userId, query) => {
  const latestBmi = await BMIRecord.findOne({ userId })
    .sort({ createdAt: -1 })
    .lean();

  if (!latestBmi) {
    throw new AppError(
      'No BMI record found. Please record your BMI first.',
      httpStatus.NOT_FOUND
    );
  }

  const mapping = BMI_DIET_MAP[latestBmi.category];
  const paginateOpts = {
    page: query.page,
    limit: query.limit,
    sort: { createdAt: -1 },
    populate: { path: 'createdBy', select: 'name avatar' },
    select: '-likes -followers',
  };

  // goal param overrides BMI-based category mapping
  const goalCategories = query.goal ? GOAL_CATEGORY_MAP[query.goal] : null;
  const baseFilter = { isPublished: true };
  if (query.dietType === 'veg') {
    baseFilter.dietType = { $in: ['veg', 'both'] };
  } else if (query.dietType === 'non-veg') {
    baseFilter.dietType = { $in: ['non-veg', 'both'] };
  }
  // dietType=both or not provided → no filter, show all

  let result;
  if (goalCategories) {
    result = await paginate(DietPlan, { ...baseFilter, category: { $in: goalCategories } }, paginateOpts);
  } else {
    // Try category + calorie range first
    result = await paginate(
      DietPlan,
      { ...baseFilter, category: mapping.category, totalCalories: { $gte: mapping.minCalories, $lte: mapping.maxCalories } },
      paginateOpts
    );

    // Fallback: category only
    if (result.data.length === 0) {
      result = await paginate(DietPlan, { ...baseFilter, category: mapping.category }, paginateOpts);
    }
  }

  // Final fallback: all published diets
  if (result.data.length === 0) {
    result = await paginate(DietPlan, baseFilter, paginateOpts);
  }

  // Add isLiked and isFollowed booleans
  if (result.data.length > 0 && userId) {
    result.data = await Promise.all([
      addIsLiked(DietPlan, result.data, userId, 'likes'),
      addIsLiked(DietPlan, result.data, userId, 'followers'),
    ]).then(([withLikes, withFollowers]) => {
      return withLikes.map((diet, i) => ({
        ...diet,
        isFollowed: withFollowers[i].isLiked,
      }));
    });
  }

  return {
    ...result,
    suggestion: {
      bmiCategory: latestBmi.category,
      bmi: latestBmi.bmi,
      goal: query.goal || null,
      recommendedCategories: goalCategories || [mapping.category],
      calorieRange: goalCategories ? null : { min: mapping.minCalories, max: mapping.maxCalories },
    },
  };
};
