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

  return paginate(DietPlan, filter, {
    page: query.page,
    limit: query.limit,
    sort: query.sort || { createdAt: -1 },
    populate: { path: 'createdBy', select: 'name avatar' },
    select: '-likes -followers',
  });
};

export const getDietById = async (id) => {
  const diet = await DietPlan.findById(id)
    .populate('createdBy', 'name avatar')
    .select('-likes -followers')
    .lean();
  if (!diet) {
    throw new AppError('Diet plan not found', httpStatus.NOT_FOUND);
  }
  return diet;
};

export const followDiet = async (dietId, userId) => {
  const alreadyFollowing = await DietPlan.exists({ _id: dietId, followers: userId });

  if (!alreadyFollowing) {
    const diet = await DietPlan.findOneAndUpdate(
      { _id: dietId, followers: { $ne: userId } },
      { $addToSet: { followers: userId } },
      { new: true }
    ).select('-likes -followers').lean();

    if (!diet) {
      throw new AppError('Diet plan not found', httpStatus.NOT_FOUND);
    }
    return diet;
  }

  const diet = await DietPlan.findOneAndUpdate(
    { _id: dietId, followers: userId },
    { $pull: { followers: userId } },
    { new: true }
  ).select('-likes -followers').lean();

  return diet;
};

export const likeDiet = async (dietId, userId) => {
  const alreadyLiked = await DietPlan.exists({ _id: dietId, likes: userId });

  if (!alreadyLiked) {
    const diet = await DietPlan.findOneAndUpdate(
      { _id: dietId, likes: { $ne: userId } },
      { $addToSet: { likes: userId } },
      { new: true }
    ).select('-likes -followers').lean();

    if (!diet) {
      throw new AppError('Diet plan not found', httpStatus.NOT_FOUND);
    }
    return diet;
  }

  const diet = await DietPlan.findOneAndUpdate(
    { _id: dietId, likes: userId },
    { $pull: { likes: userId } },
    { new: true }
  ).select('-likes -followers').lean();

  return diet;
};
