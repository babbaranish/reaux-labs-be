import httpStatus from 'http-status';
import { BMIRecord } from './bmi.model.js';
import { User } from '../user/user.model.js';
import { AppError } from '../../shared/appError.js';
import { paginate } from '../../shared/pagination.js';

const getBmiCategory = (bmi) => {
  if (bmi < 18.5) return 'underweight';
  if (bmi < 25) return 'normal';
  if (bmi < 30) return 'overweight';
  return 'obese';
};

// Mifflin-St Jeor Equation (most accurate for BMR)
const calculateBmr = (weight, heightCm, age, gender) => {
  if (!age || !gender) return null;
  if (gender === 'male') {
    return parseFloat((10 * weight + 6.25 * heightCm - 5 * age + 5).toFixed(2));
  }
  // female and other
  return parseFloat((10 * weight + 6.25 * heightCm - 5 * age - 161).toFixed(2));
};

const getBmiMessage = (category, bmi) => {
  switch (category) {
    case 'underweight':
      return `Your BMI is ${bmi} — you're a bit underweight. Consider adding more nutritious, calorie-rich foods to your diet. A balanced meal plan with proteins and healthy fats can help you reach a healthier weight. You've got this!`;
    case 'normal':
      return `Your BMI is ${bmi} — you're in great shape! Keep up the awesome work with your diet and exercise routine. You're right where you need to be. Stay consistent and keep crushing it!`;
    case 'overweight':
      return `Your BMI is ${bmi} — you're carrying a little extra weight, but nothing you can't handle! Small changes like regular workouts and mindful eating can make a big difference. Let's work on getting you to your best self!`;
    case 'obese':
      return `Your BMI is ${bmi} — your health is important to us, and we're here to support you. Start with small, sustainable changes like walking daily and reducing processed foods. Every step forward counts, and we believe in you!`;
    default:
      return `Your BMI is ${bmi}. Keep tracking your progress!`;
  }
};

export const recordBmi = async (userId, { height, weight, age, gender }) => {
  const heightInMeters = height / 100;
  const bmi = parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(2));
  const category = getBmiCategory(bmi);

  // If age/gender not provided, try to get from user profile
  let userAge = age;
  let userGender = gender;
  if (!userAge || !userGender) {
    const user = await User.findById(userId).select('dateOfBirth gender').lean();
    if (user) {
      if (!userGender && user.gender) userGender = user.gender;
      if (!userAge && user.dateOfBirth) {
        const today = new Date();
        const dob = new Date(user.dateOfBirth);
        userAge = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
          userAge--;
        }
      }
    }
  }

  const bmr = calculateBmr(weight, height, userAge, userGender);
  const message = getBmiMessage(category, bmi);

  const record = await BMIRecord.create({
    userId,
    height,
    weight,
    age: userAge || undefined,
    gender: userGender || undefined,
    bmi,
    bmr,
    category,
    message,
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
  const record = await BMIRecord.findOne({ userId }).sort({ createdAt: -1 }).lean();
  if (!record) {
    throw new AppError('No BMI records found', httpStatus.NOT_FOUND);
  }
  return record;
};
