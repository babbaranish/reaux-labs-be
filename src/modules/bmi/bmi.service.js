import httpStatus from 'http-status';
import { BMIRecord } from './bmi.model.js';
import { AppError } from '../../shared/appError.js';
import { paginate } from '../../shared/pagination.js';

const getBmiCategory = (bmi) => {
  if (bmi < 18.5) return 'underweight';
  if (bmi < 25) return 'normal';
  if (bmi < 30) return 'overweight';
  return 'obese';
};

export const recordBmi = async (userId, { height, weight }) => {
  const heightInMeters = height / 100;
  const bmi = parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(2));
  const category = getBmiCategory(bmi);

  const record = await BMIRecord.create({
    userId,
    height,
    weight,
    bmi,
    category,
  });

  return record;
};

export const getHistory = async (userId, query) => {
  const result = await paginate(BMIRecord, { userId }, {
    page: query.page,
    limit: query.limit,
    sort: { createdAt: -1 },
  });

  return result;
};

export const getLatest = async (userId) => {
  const record = await BMIRecord.findOne({ userId }).sort({ createdAt: -1 });
  if (!record) {
    throw new AppError('No BMI records found', httpStatus.NOT_FOUND);
  }
  return record;
};
