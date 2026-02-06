import httpStatus from 'http-status';
import slugify from 'slugify';
import { DietPlan } from './diet.model.js';
import { AppError } from '../../shared/appError.js';
import { paginate } from '../../shared/pagination.js';

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
  const diet = await DietPlan.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!diet) {
    throw new AppError('Diet plan not found', httpStatus.NOT_FOUND);
  }
  return diet;
};

export const getDiets = async (query) => {
  const filter = { isPublished: true };

  if (query.category) {
    filter.category = query.category;
  }

  if (query.tag) {
    filter.tags = { $in: [query.tag] };
  }

  const result = await paginate(DietPlan, filter, {
    page: query.page,
    limit: query.limit,
    sort: query.sort || { createdAt: -1 },
    populate: { path: 'createdBy', select: 'name avatar' },
  });

  return result;
};

export const getDietById = async (id) => {
  const diet = await DietPlan.findById(id).populate('createdBy', 'name avatar');
  if (!diet) {
    throw new AppError('Diet plan not found', httpStatus.NOT_FOUND);
  }
  return diet;
};

export const followDiet = async (dietId, userId) => {
  const diet = await DietPlan.findById(dietId);
  if (!diet) {
    throw new AppError('Diet plan not found', httpStatus.NOT_FOUND);
  }

  const followerIndex = diet.followers.indexOf(userId);
  if (followerIndex === -1) {
    diet.followers.push(userId);
  } else {
    diet.followers.splice(followerIndex, 1);
  }

  await diet.save();
  return diet;
};

export const likeDiet = async (dietId, userId) => {
  const diet = await DietPlan.findById(dietId);
  if (!diet) {
    throw new AppError('Diet plan not found', httpStatus.NOT_FOUND);
  }

  const likeIndex = diet.likes.indexOf(userId);
  if (likeIndex === -1) {
    diet.likes.push(userId);
  } else {
    diet.likes.splice(likeIndex, 1);
  }

  await diet.save();
  return diet;
};
