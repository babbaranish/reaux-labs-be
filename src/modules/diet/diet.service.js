import httpStatus from 'http-status';
import slugify from 'slugify';
import { DietPlan } from './diet.model.js';
import { AppError } from '../../shared/appError.js';
import { paginate } from '../../shared/pagination.js';
import { toggleArrayField } from '../../shared/socialToggle.js';
import { findByIdOrFail, updateByIdOrFail } from '../../shared/crudOperations.js';

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

export const getDiets = async (query) => {
  const filter = { isPublished: true };

  if (query.category) {
    filter.category = query.category;
  }

  if (query.tag) {
    filter.tags = { $in: [query.tag] };
  }

  return paginate(DietPlan, filter, {
    page: query.page,
    limit: query.limit,
    sort: query.sort || { createdAt: -1 },
    populate: { path: 'createdBy', select: 'name avatar' },
    select: '-likes -followers',
  });
};

export const getDietById = async (id) => {
  return findByIdOrFail(DietPlan, id, {
    populate: { path: 'createdBy', select: 'name avatar' },
    select: '-likes -followers',
  });
};

export const followDiet = async (dietId, userId) => {
  return toggleArrayField(DietPlan, dietId, userId, 'followers', {
    selectExclude: '-likes -followers',
  });
};

export const likeDiet = async (dietId, userId) => {
  return toggleArrayField(DietPlan, dietId, userId, 'likes', {
    selectExclude: '-likes -followers',
  });
};
