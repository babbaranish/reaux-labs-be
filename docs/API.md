# REAUX_labs API Documentation

**Version:** 2.0
**Base URL (local):** `http://localhost:5001/api`
**Base URL (production):** `https://api.anishbabbar.me/api`

---

## Table of Contents

1. [Authentication](#authentication)
2. [Standard Response Format](#standard-response-format)
3. [Roles](#roles)
4. [Seed Data / Test Accounts](#seed-data--test-accounts)
5. [Auth](#1-auth)
6. [Users (Admin)](#2-users-admin)
7. [Saved Addresses](#3-saved-addresses)
8. [Gyms](#4-gyms)
9. [BMI](#5-bmi)
10. [Diet Plans](#6-diet-plans)
11. [Posts / Community](#7-posts--community)
12. [Reels](#8-reels)
13. [Products](#9-products)
14. [Cart](#10-cart)
15. [Orders](#11-orders)
16. [Promo Codes](#12-promo-codes)
17. [Challenges](#13-challenges)
18. [Notifications](#14-notifications)
19. [Memberships](#15-memberships)
20. [Analytics (Admin)](#16-analytics-admin)
21. [Contact](#17-contact)
22. [Workouts](#18-workouts)

---

## Authentication

REAUX_labs uses **JSON Web Tokens (JWT)** for authentication. Tokens are returned upon successful registration or login and expire after **30 days** (configurable via `JWT_EXPIRES_IN`).

### Header Format

```
Authorization: Bearer <token>
```

### Token Payload

| Field    | Type   | Description           |
|----------|--------|-----------------------|
| `userId` | string | The user's MongoDB ID |
| `role`   | string | The user's role        |

---

## Standard Response Format

### Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Paginated Response

All list endpoints return data in this envelope. The `limit` parameter is capped at **100** results per page.

```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 47,
    "pages": 5
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Description of the error"
}
```

### Common Error Codes

| Status Code | Meaning                | Typical Cause                                   |
|-------------|------------------------|-------------------------------------------------|
| `400`       | Bad Request            | Validation failure, invalid input               |
| `401`       | Unauthorized           | Missing/invalid/expired token                   |
| `403`       | Forbidden              | Account disabled, insufficient role             |
| `404`       | Not Found              | Resource does not exist                         |
| `409`       | Conflict               | Duplicate entry (email, gym name, etc.)         |
| `500`       | Internal Server Error  | Unexpected server error                         |

---

## Roles

| Role         | Description |
|--------------|-------------|
| `user`       | Default. Manage own profile, track BMI, follow diets, create posts/reels, shop, join challenges. |
| `admin`      | Gym administrator. All user permissions + create diets/products/workouts/challenges, manage memberships, view analytics. Scoped to their gym(s). |
| `superadmin` | Full system access. All admin permissions + user management, gym CRUD, promo codes, role/status changes, sales reports. |

---

## Seed Data / Test Accounts

Run `npm run seed` to populate the database with test data.

### Test Accounts (all passwords: `Pass1234`)

| Role | Name | Email | Gym |
|------|------|-------|-----|
| SuperAdmin | Anish Babbar | `anish@reauxlabs.com` | — |
| Admin | Rahul Sharma | `rahul@reauxlabs.com` | Delhi |
| Admin | Priya Patel | `priya@reauxlabs.com` | Mumbai |
| Admin | Karan Nair | `karan@reauxlabs.com` | Bangalore |
| User | Arjun Mehta | `arjun@gmail.com` | Delhi |
| User | Vikram Singh | `vikram@gmail.com` | Delhi |
| User | Riya Kapoor | `riya@gmail.com` | Delhi |
| User | Manish Tiwari | `manish@gmail.com` | Delhi |
| User | Sneha Gupta | `sneha@gmail.com` | Mumbai |
| User | Rohan Desai | `rohan@gmail.com` | Mumbai |
| User | Kavya Reddy | `kavya@gmail.com` | Mumbai |
| User | Aditya Kumar | `aditya@gmail.com` | Bangalore |
| User | Pooja Sharma | `pooja@gmail.com` | Bangalore |
| User | Nikhil Menon | `nikhil@gmail.com` | Bangalore |

### Seeded Data Summary

| Collection | Count | Details |
|------------|-------|---------|
| Users | 14 | 1 superadmin, 3 admins, 10 users |
| Gyms | 3 | Delhi, Mumbai, Bangalore |
| BMI Records | 20 | Progress tracking over months |
| Diet Plans | 6 | 2 per gym (veg, non-veg, both) |
| Workouts | 9 | 3 per gym |
| Posts | 8 | Text posts with hashtags, likes |
| Comments | 10 | On various posts |
| Reels | 6 | With video URLs, likes |
| Reel Comments | 10 | Across reels |
| Products | 6 | 3 `all` (supplements/accessories), 2 `admin` (equipment/supplies), 1 `user` (members-only) |
| Carts | 4 | Active carts |
| Orders | 6 | Various statuses |
| Promo Codes | 3 | REAUX20, FLAT200, WELCOME50 |
| Challenges | 3 | Steps, Push-Ups, Plank |
| Membership Plans | 9 | 3 per gym |
| User Memberships | 15 | Covering all fee scenarios |
| Contacts | 6 | 2 open, 4 resolved |
| Notifications | 12 | Various types |

---

## Health Check

### `GET /api/health`

No authentication required.

**Response (200):**
```json
{
  "success": true,
  "message": "REAUX_labs API is running",
  "timestamp": "2026-03-24T12:00:00.000Z",
  "uptime": 3600.123,
  "database": "connected"
}
```

---

## 1. Auth

Base path: `/api/auth`

### 1.1 Register

```
POST /api/auth/register
```
**Auth:** None

**Body:**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `name` | string | Yes | min 2, max 100 |
| `email` | string | Yes | Valid email |
| `password` | string | Yes | min 6, max 128 |
| `phone` | string | No | 10 digits |
| `gymId` | string | No | MongoDB ObjectId |

**Response (201):**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "token": "eyJhbGciOi...",
    "user": {
      "_id": "...",
      "name": "Arjun Patel",
      "email": "arjun@example.com",
      "role": "user",
      "status": "active"
    }
  }
}
```

---

### 1.2 Login

```
POST /api/auth/login
```
**Auth:** None

**Body:** `{ "email": "...", "password": "..." }`

**Response (200):** Same shape as register.

---

### 1.3 Get Profile

```
GET /api/auth/me
```
**Auth:** Required

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "Arjun Mehta",
    "firstName": "Arjun",
    "lastName": "Mehta",
    "email": "arjun@gmail.com",
    "phone": "9876543213",
    "role": "user",
    "gymId": { "_id": "...", "name": "REAUX Fitness — Delhi" },
    "gymIds": [],
    "avatar": "https://...",
    "height": 175,
    "weight": 72,
    "dateOfBirth": "2000-01-25T00:00:00.000Z",
    "dateOfJoining": "2026-01-15T00:00:00.000Z",
    "gender": "male",
    "status": "active",
    "savedAddresses": [...],
    "fcmTokens": []
  }
}
```

---

### 1.4 Update Profile

```
PUT /api/auth/profile
```
**Auth:** Required
**Content-Type:** `multipart/form-data` (if uploading avatar) or `application/json`

**Body:**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `name` | string | No | |
| `firstName` | string | No | |
| `lastName` | string | No | |
| `phone` | string | No | 10 digits |
| `height` | number | No | In cm |
| `weight` | number | No | In kg |
| `dateOfBirth` | string | No | ISO date |
| `gender` | string | No | male, female, other |
| `avatar` | file | No | jpeg/png/webp, max 5MB |

**Response (200):** Updated user object.

---

### 1.5 Forgot Password

```
POST /api/auth/forgot-password
```
**Auth:** None

**Body:** `{ "email": "user@example.com" }`

**Response (200):**
```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

---

### 1.6 Reset Password

```
POST /api/auth/reset-password
```
**Auth:** None

**Body:** `{ "token": "abc123...", "password": "NewPass123" }`

**Response (200):**
```json
{
  "success": true,
  "message": "Password reset successful"
}
```

---

## 2. Users (Admin)

Base path: `/api/users`

### 2.1 Create User

```
POST /api/users
```
**Auth:** Required (admin, superadmin)

**Body:**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `firstName` | string | No | |
| `lastName` | string | No | |
| `name` | string | No | Auto-derived from firstName + lastName |
| `email` | string | Yes | |
| `password` | string | Yes | min 6 |
| `phone` | string | No | 10 digits exactly |
| `role` | string | No | user (default), admin, superadmin |
| `gymId` | string | No | Admin auto-assigns own gym |
| `gender` | string | No | male, female, other |
| `dateOfBirth` | string | No | ISO date |
| `dateOfJoining` | string | No | ISO date |
| `status` | string | No | active (default), disabled |

**Response (201):** Created user object. Welcome email sent automatically.

---

### 2.2 List Users

```
GET /api/users?page=1&limit=10&role=user&gymId=...
```
**Auth:** Required (admin, superadmin)

Admin sees only their gym's users. Superadmin sees all.

**Response (200):** Paginated user list with `gymId` populated.

---

### 2.3 Get User by ID

```
GET /api/users/:id
```
**Auth:** Required (admin, superadmin)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "Arjun Mehta",
    "email": "arjun@gmail.com",
    "role": "user",
    "gymId": { "_id": "...", "name": "REAUX Fitness — Delhi", "slug": "...", "logo": "...", "address": "..." },
    "gymIds": [],
    "savedAddresses": [...]
  }
}
```

---

### 2.4 Update User

```
PUT /api/users/:id
```
**Auth:** Required (admin, superadmin)

**Body:** Same fields as Create User (all optional). Admin cannot change role or gymId.

---

### 2.5 Update User Role

```
PUT /api/users/:id/role
```
**Auth:** Required (superadmin only)

**Body:** `{ "role": "admin" }`

---

### 2.6 Update User Status

```
PUT /api/users/:id/status
```
**Auth:** Required (superadmin only)

**Body:** `{ "status": "disabled" }`

---

### 2.7 Today's Birthdays

```
GET /api/users/birthdays/today
```
**Auth:** Required (admin, superadmin)

Admin sees only their gym's users.

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "name": "Riya Kapoor",
      "email": "riya@gmail.com",
      "avatar": "...",
      "dateOfBirth": "2001-04-18T00:00:00.000Z",
      "gymId": { "_id": "...", "name": "REAUX Fitness — Delhi", "slug": "..." }
    }
  ]
}
```

---

### 2.8 Upcoming Birthdays

```
GET /api/users/birthdays/upcoming?days=7
```
**Auth:** Required (admin, superadmin)

| Query | Default | Notes |
|-------|---------|-------|
| `days` | 7 | Look-ahead window |

**Response (200):** Same as today but with `daysUntil` field. Sorted soonest first.
```json
{
  "success": true,
  "data": [
    { "name": "Riya Kapoor", "daysUntil": 3, "dateOfBirth": "2001-04-18T00:00:00.000Z", ... }
  ]
}
```

---

## 3. Saved Addresses

Base path: `/api/users/addresses`

All endpoints require authentication. Operates on the logged-in user's addresses.

### 3.1 Get Addresses

```
GET /api/users/addresses
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "label": "Home",
      "street": "10 Sector 18, Dwarka",
      "city": "Delhi",
      "state": "Delhi",
      "pincode": "110075",
      "phone": "9876543213",
      "isDefault": true
    }
  ]
}
```

---

### 3.2 Add Address

```
POST /api/users/addresses
```

**Body:**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `label` | string | No | e.g. "Home", "Work" |
| `street` | string | Yes | |
| `city` | string | Yes | |
| `state` | string | Yes | |
| `pincode` | string | Yes | Exactly 6 digits |
| `phone` | string | No | 10 digits |
| `isDefault` | boolean | No | If true, all others become non-default |

First address is automatically set as default.

**Response (200):** Returns full `savedAddresses` array.

---

### 3.3 Update Address

```
PUT /api/users/addresses/:addressId
```

**Body:** Any address fields (partial update).

**Response (200):** Returns full `savedAddresses` array.

---

### 3.4 Delete Address

```
DELETE /api/users/addresses/:addressId
```

If deleted address was default, the first remaining address becomes default.

**Response (200):** Returns remaining `savedAddresses` array.

---

## 4. Gyms

Base path: `/api/gyms`

### 4.1 Create Gym

```
POST /api/gyms
```
**Auth:** Required (superadmin)
**Content-Type:** `multipart/form-data`

**Body:**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `name` | string | Yes | |
| `description` | string | No | |
| `address` | string | Yes | |
| `phone` | string | No | |
| `email` | string | No | |
| `amenities` | array | No | |
| `openingHours` | string | No | |
| `images` | files | No | jpeg/png/webp, 5MB each |
| `logo` | file | No | jpeg/png/webp, 5MB |

---

### 4.2 List Gyms

```
GET /api/gyms?page=1&limit=10
```
**Auth:** None (public)

---

### 4.3 Get Gym by ID

```
GET /api/gyms/:id
```
**Auth:** None (public)

---

### 4.4 Update Gym

```
PUT /api/gyms/:id
```
**Auth:** Required (superadmin)

---

### 4.5 Delete Gym

```
DELETE /api/gyms/:id
```
**Auth:** Required (superadmin)

---

### 4.6 Assign Admin to Gym

```
POST /api/gyms/:id/assign-admin
```
**Auth:** Required (superadmin)

**Body:** `{ "userId": "..." }`

---

## 5. BMI

Base path: `/api/bmi`

### 5.1 Record BMI

```
POST /api/bmi/record
```
**Auth:** Required

**Body:**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `height` | number | Yes | In cm |
| `weight` | number | Yes | In kg |
| `age` | number | No | Auto-fetched from dateOfBirth if not provided |
| `gender` | string | No | Auto-fetched from profile if not provided |

**Response (201):**
```json
{
  "success": true,
  "message": "BMI recorded successfully",
  "data": {
    "_id": "...",
    "userId": "...",
    "height": 178,
    "weight": 75,
    "age": 27,
    "gender": "male",
    "bmi": 23.67,
    "bmr": 1732.5,
    "category": "normal",
    "message": "Your BMI is 23.7 — you're in great shape! ...",
    "createdAt": "2026-03-24T15:10:01.961Z"
  }
}
```

---

### 5.2 BMI History

```
GET /api/bmi/history?page=1&limit=10
```
**Auth:** Required

**Response (200):** Paginated list of BMI records, newest first.

---

### 5.3 Latest BMI

```
GET /api/bmi/latest
```
**Auth:** Required

**Response (200):** Single BMI record (the most recent one).

---

## 6. Diet Plans

Base path: `/api/diets`

### 6.1 Create Diet Plan

```
POST /api/diets
```
**Auth:** Required (admin, superadmin)
**Content-Type:** `multipart/form-data`

**Body:**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `title` | string | Yes | min 2, max 200 |
| `category` | string | Yes | weight-loss, muscle-gain, bulking, cutting, other |
| `dietType` | string | No | veg, non-veg, both (default: both) |
| `description` | string | No | max 2000 |
| `totalCalories` | number | No | |
| `meals` | array | No | JSON array of meal objects |
| `tags` | array | No | |
| `isPublished` | boolean | No | default true |
| `image` | file | No | jpeg/png/webp, 5MB |

**Meal object:**
```json
{
  "name": "Breakfast",
  "items": ["Oats", "Banana", "Almonds"],
  "calories": 400,
  "protein": 15,
  "carbs": 60,
  "fat": 12
}
```

---

### 6.2 Update Diet Plan

```
PUT /api/diets/:id
```
**Auth:** Required (admin, superadmin)

**Body:** Same as create (all optional).

---

### 6.3 List Diet Plans

```
GET /api/diets?category=weight-loss&dietType=veg&page=1&limit=10
```
**Auth:** Optional (adds isLiked/isFollowed if authenticated)

| Query | Notes |
|-------|-------|
| `category` | weight-loss, muscle-gain, bulking, cutting, other |
| `dietType` | `veg` → returns veg + both; `non-veg` → returns non-veg + both; `both` or omitted → all |
| `tag` | Filter by tag |

---

### 6.4 Get Diet Plan by ID

```
GET /api/diets/:id
```
**Auth:** Optional

---

### 6.5 Suggested Diets (BMI-based)

```
GET /api/diets/suggested?goal=lose&dietType=veg&page=1&limit=10
```
**Auth:** Required

Uses the user's latest BMI record to suggest matching diets.

| Query | Notes |
|-------|-------|
| `goal` | `lose` → weight-loss, cutting; `gain` → muscle-gain, bulking; `maintain` → uses BMI mapping |
| `dietType` | veg, non-veg, both |

**BMI Category → Diet Mapping:**

| BMI Category | Diet Category | Calorie Range |
|-------------|---------------|---------------|
| Underweight | muscle-gain | 2500–3500 |
| Normal | bulking | 1800–2500 |
| Overweight | weight-loss | 1200–1800 |
| Obese | cutting | 1000–1500 |

**Response includes suggestion metadata:**
```json
{
  "data": [...],
  "pagination": {...},
  "suggestion": {
    "bmiCategory": "overweight",
    "bmi": 27.5,
    "goal": null,
    "recommendedCategories": ["weight-loss"],
    "calorieRange": { "min": 1200, "max": 1800 }
  }
}
```

---

### 6.6 Toggle Follow Diet

```
POST /api/diets/:id/follow
```
**Auth:** Required

**Response:** Diet object with `isFollowed: true/false`.

---

### 6.7 Toggle Like Diet

```
POST /api/diets/:id/like
```
**Auth:** Required

**Response:** Diet object with `isLiked: true/false`.

---

## 7. Posts / Community

Base path: `/api/posts`

### 7.1 Create Post

```
POST /api/posts
```
**Auth:** Required

**Body:**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `content` | string | Yes | |
| `mediaType` | string | No | text, image, video |
| `mediaUrl` | string | No | URL to media |
| `hashtags` | array | No | |
| `category` | string | No | |

---

### 7.2 List Posts

```
GET /api/posts?page=1&limit=10
```
**Auth:** Required

---

### 7.3 Get Post by ID

```
GET /api/posts/:id
```
**Auth:** Required

---

### 7.4 Like Post

```
POST /api/posts/:id/like
```
**Auth:** Required

---

### 7.5 Comment on Post

```
POST /api/posts/:id/comment
```
**Auth:** Required

**Body:** `{ "content": "Great post!" }`

---

### 7.6 Delete Post

```
DELETE /api/posts/:id
```
**Auth:** Required (superadmin only)

---

### 7.7 Delete Comment

```
DELETE /api/posts/:id/comments/:commentId
```
**Auth:** Required (own comment or superadmin)

---

## 8. Reels

Base path: `/api/reels`

### 8.1 Create Reel

```
POST /api/reels
```
**Auth:** Required
**Content-Type:** `multipart/form-data`

**Body:**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `video` | file | No | mp4/mov/avi, max 100MB |
| `videoUrl` | string | No | If not uploading file |
| `caption` | string | No | |
| `linkedProduct` | string | No | Product ObjectId |

---

### 8.2 List Reels

```
GET /api/reels?page=1&limit=10
```
**Auth:** Optional (adds `isLiked` if authenticated)

**Response includes `commentsCount`:**
```json
{
  "data": [
    {
      "_id": "...",
      "author": { "_id": "...", "name": "...", "avatar": "..." },
      "videoUrl": "...",
      "caption": "...",
      "likesCount": 12,
      "commentsCount": 5,
      "isLiked": false,
      "createdAt": "..."
    }
  ]
}
```

---

### 8.3 Get Reel by ID

```
GET /api/reels/:id
```
**Auth:** Optional

---

### 8.4 Like Reel

```
POST /api/reels/:id/like
```
**Auth:** Required

---

### 8.5 Comment on Reel

```
POST /api/reels/:id/comment
```
**Auth:** Required

**Body:** `{ "content": "Amazing!" }`

Increments `commentsCount` on the reel.

---

### 8.6 List Reel Comments

```
GET /api/reels/:id/comments?page=1&limit=20
```
**Auth:** Not required

---

## 9. Products

Base path: `/api/products`

### Product Visibility

Products have a `visibility` field that controls who can see them:

| `visibility` | User sees | Admin sees | Superadmin sees | No auth |
|-------------|-----------|------------|-----------------|---------|
| `all` | Yes | Yes | Yes | Yes |
| `admin` | No | Yes | Yes | No |
| `user` | Yes | No | Yes | No |

**Superadmin always sees all products regardless of visibility.**

### 9.1 List Products

```
GET /api/products?category=supplements&page=1&limit=10
```
**Auth:** Optional (uses `optionalAuth` — token not required, but if present, filters by role)

**Query params:**

| Param | Type | Notes |
|-------|------|-------|
| `category` | string | Filter by category (e.g. `supplements`, `equipment`, `apparel`, `accessories`, `supplies`) |
| `search` | string | Full-text search on name + description |
| `page` | number | Page number (default 1) |
| `limit` | number | Results per page (default 10, max 100) |

**Visibility filtering (automatic based on auth):**
- **Superadmin** → returns all 6 products (all + admin + user)
- **Admin** → returns 5 products (all + admin)
- **User** → returns 4 products (all + user)
- **No auth** → returns 3 products (all only)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "name": "REAUX Whey Protein Isolate 1kg",
      "description": "Premium whey protein isolate with 28g protein per scoop.",
      "price": 2499,
      "compareAtPrice": 2999,
      "images": ["https://images.unsplash.com/..."],
      "category": "supplements",
      "stock": 120,
      "visibility": "all",
      "isActive": true,
      "createdBy": "...",
      "createdAt": "2026-03-01T00:00:00.000Z"
    }
  ],
  "pagination": { "page": 1, "limit": 10, "total": 6, "pages": 1 }
}
```

---

### 9.2 Get Product by ID

```
GET /api/products/:id
```
**Auth:** None (public — returns product regardless of visibility)

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "Commercial Treadmill Belt Replacement",
    "description": "Heavy-duty treadmill belt for commercial gym treadmills.",
    "price": 8999,
    "compareAtPrice": 11999,
    "images": ["https://images.unsplash.com/..."],
    "category": "equipment",
    "stock": 10,
    "visibility": "admin",
    "nutrition": null,
    "isActive": true,
    "createdBy": "...",
    "createdAt": "2026-03-01T00:00:00.000Z"
  }
}
```

---

### 9.3 Create Product

```
POST /api/products
```
**Auth:** Required (admin, superadmin)
**Content-Type:** `multipart/form-data`

**Body:**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `name` | string | Yes | Product name |
| `price` | number | Yes | Price in INR |
| `description` | string | No | Product description |
| `compareAtPrice` | number | No | Strike-through price (original MRP) |
| `category` | string | No | e.g. `supplements`, `equipment`, `apparel`, `accessories`, `supplies` |
| `stock` | number | No | Default `0` |
| `visibility` | string | No | `all` (default), `admin`, or `user` |
| `nutrition` | object | No | `{ servingSize, calories, protein, carbs, fat, sugar }` |
| `images` | files | No | Max 5 files, jpeg/png/webp, 5MB each |

**Example — admin-only product:**
```json
{
  "name": "Gym Floor Cleaner 5L",
  "price": 1499,
  "category": "supplies",
  "stock": 50,
  "visibility": "admin"
}
```

**Example — user-exclusive product:**
```json
{
  "name": "Members-Only Training Gloves",
  "price": 899,
  "category": "accessories",
  "stock": 150,
  "visibility": "user"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "Gym Floor Cleaner 5L",
    "price": 1499,
    "category": "supplies",
    "stock": 50,
    "visibility": "admin",
    "isActive": true,
    "createdBy": "...",
    "createdAt": "..."
  },
  "message": "Product created"
}
```

---

### 9.4 Update Product

```
PUT /api/products/:id
```
**Auth:** Required (admin, superadmin)

**Body:** Same as create (all optional) + `isActive` boolean.

Can change visibility of an existing product:
```json
{ "visibility": "user" }
```

---

## 10. Cart

Base path: `/api/cart`

### 10.1 Add to Cart

```
POST /api/cart/add
```
**Auth:** Required

**Body:** `{ "productId": "...", "quantity": 2 }`

---

### 10.2 Get Cart

```
GET /api/cart
```
**Auth:** Required

**Response:** Cart with populated product details and computed totals.

---

### 10.3 Remove from Cart

```
DELETE /api/cart/item/:productId
```
**Auth:** Required

---

## 11. Orders

Base path: `/api/orders`

### 11.1 Create Order

```
POST /api/orders/create
```
**Auth:** Required

**Body:**
```json
{
  "shippingAddress": {
    "street": "10 Sector 18, Dwarka",
    "city": "Delhi",
    "state": "Delhi",
    "pincode": "110075",
    "phone": "9876543213"
  },
  "promoCode": "REAUX20"
}
```

Creates order from current cart. Sends notification to superadmins.

---

### 11.2 My Orders

```
GET /api/orders/my?page=1&limit=10
```
**Auth:** Required

---

### 11.3 All Orders (Admin)

```
GET /api/orders?page=1&limit=10
```
**Auth:** Required (admin, superadmin)

---

### 11.4 Get Order by ID

```
GET /api/orders/:id
```
**Auth:** Required (user sees own only)

---

### 11.5 Update Order Status

```
PATCH /api/orders/:id/status
```
**Auth:** Required (admin, superadmin)

**Body:** `{ "status": "shipped" }`

Valid transitions: pending → confirmed → shipped → delivered. Any → cancelled.

Sends notification to the order's user on status change.

---

## 12. Promo Codes

Base path: `/api/promo`

### 12.1 List Promo Codes

```
GET /api/promo?page=1&limit=10
```
**Auth:** Required (admin, superadmin)

---

### 12.2 Create Promo Code

```
POST /api/promo/create
```
**Auth:** Required (superadmin)

**Body:**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `code` | string | Yes | e.g. "REAUX20" |
| `discountType` | string | Yes | percentage, fixed |
| `discountValue` | number | Yes | |
| `minOrderAmount` | number | No | |
| `maxDiscount` | number | No | Cap for percentage type |
| `usageLimit` | number | No | |
| `validFrom` | string | No | ISO date |
| `validUntil` | string | No | ISO date |

---

### 12.3 Validate Promo Code

```
POST /api/promo/validate
```
**Auth:** Required

**Body:** `{ "code": "REAUX20" }`

---

## 13. Challenges

Base path: `/api/challenges`

### 13.1 Create Challenge

```
POST /api/challenges
```
**Auth:** Required (admin, superadmin)

**Body:**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `title` | string | Yes | |
| `type` | string | Yes | steps, workout, diet, custom |
| `target` | number | Yes | |
| `startDate` | string | Yes | ISO date |
| `endDate` | string | Yes | ISO date |
| `description` | string | No | |

---

### 13.2 List Challenges

```
GET /api/challenges?page=1&limit=10
```
**Auth:** Required

---

### 13.3 Join Challenge

```
POST /api/challenges/:id/join
```
**Auth:** Required

---

## 14. Notifications

Base path: `/api/notifications`

### 14.1 List Notifications

```
GET /api/notifications?page=1&limit=20&isRead=false&type=order
```
**Auth:** Required (all roles — user, admin, superadmin)

| Query | Notes |
|-------|-------|
| `isRead` | `true` or `false` |
| `type` | system, community, order, diet, announcement |

---

### 14.2 Get Notification by ID

```
GET /api/notifications/:id
```
**Auth:** Required

Automatically marks as read.

---

### 14.3 Mark as Read

```
PUT /api/notifications/read/:id
```
**Auth:** Required

---

### 14.4 Mark All Read

```
PATCH /api/notifications/mark-all-read
```
**Auth:** Required

**Response:** `{ "success": true, "data": { "modifiedCount": 5 } }`

---

### 14.5 Register Device Token

```
POST /api/notifications/device-token
```
**Auth:** Required

**Body:** `{ "token": "ExponentPushToken[xxxxxxxxxxxxxx]" }`

Call on login. Supports multiple devices per user.

---

### 14.6 Remove Device Token

```
DELETE /api/notifications/device-token
```
**Auth:** Required

**Body:** `{ "token": "ExponentPushToken[xxxxxxxxxxxxxx]" }`

Call on logout.

---

### 14.7 Send Test Notification

```
POST /api/notifications/test
```
**Auth:** Required

Sends a test push notification to all of the user's registered devices.

---

### 14.8 Broadcast Notification

```
POST /api/notifications/broadcast
```
**Auth:** Required (admin, superadmin)

**Body:**
```json
{
  "title": "Gym Holiday Notice",
  "message": "The gym will be closed on March 25th for Holi.",
  "type": "announcement"
}
```

Sends to all active users.

---

### Push Notification Triggers (Automatic)

| Event | Recipients | Title |
|-------|-----------|-------|
| Order placed | Superadmins | "New Order" |
| Order status changed | Order's user | "Order Update" |
| Membership assigned | The member | "Membership Assigned" |
| Membership cancelled | The member | "Membership Cancelled" |
| Reel liked | Reel author | "New Like" |
| Reel commented | Reel author | "New Comment" |
| Diet liked | Diet author | "New Like" |
| Diet followed | Diet author | "New Follower" |

---

## 15. Memberships

Base path: `/api/memberships`

### Membership Plans

#### 15.1 Create Plan

```
POST /api/memberships/plans
```
**Auth:** Required (superadmin)

**Body:**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `name` | string | Yes | |
| `gymId` | string | Yes | |
| `durationDays` | number | Yes | |
| `price` | number | Yes | |
| `features` | array | No | |
| `description` | string | No | |

---

#### 15.2 List Plans

```
GET /api/memberships/plans?page=1&limit=10
```
**Auth:** Required (admin, superadmin)

Admin sees only their gym's plans.

---

#### 15.3 Get Plan by ID

```
GET /api/memberships/plans/:id
```
**Auth:** Required (admin, superadmin)

---

#### 15.4 Update Plan

```
PUT /api/memberships/plans/:id
```
**Auth:** Required (superadmin)

**Body:** All plan fields optional + `isActive` boolean.

---

#### 15.5 Delete Plan

```
DELETE /api/memberships/plans/:id
```
**Auth:** Required (superadmin)

Soft-deletes (sets `isActive: false`).

---

### User Memberships

#### 15.6 Assign Membership

```
POST /api/memberships/assign
```
**Auth:** Required (admin, superadmin)

**Body:**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `userId` | string | Yes | |
| `planId` | string | Yes | |
| `startDate` | string | No | Default: now |
| `feesAmount` | number | No | Default: 0 |
| `feesPaid` | number | No | Default: 0 |

`endDate` is auto-calculated: `startDate + plan.durationDays`.

**Response:** Full membership object with computed `feesDue` and `advanceCredit`.

---

#### 15.7 My Memberships

```
GET /api/memberships/my?page=1&limit=10
```
**Auth:** Required (any user)

---

#### 15.8 List Memberships (Admin)

```
GET /api/memberships?status=active&gymId=...&sortBy=endDate&order=asc&page=1&limit=10
```
**Auth:** Required (admin, superadmin)

| Query | Notes |
|-------|-------|
| `status` | active, expired, cancelled |
| `userId` | Filter by specific user |
| `gymId` | Filter by gym (superadmin). Admin auto-scoped to their gym(s). |
| `sortBy` | endDate, feesDue, createdAt (default) |
| `order` | asc, desc (default) |

---

#### 15.9 Fees Overview

```
GET /api/memberships/fees-overview?gymId=...
```
**Auth:** Required (admin, superadmin)

Returns 4 grouped sections:

```json
{
  "data": {
    "feesDue": [...],
    "fullyPaid": [...],
    "credit": [...],
    "upcomingRenewals": [...]
  }
}
```

| Section | Filter |
|---------|--------|
| `feesDue` | Active memberships with `feesDue > 0` |
| `fullyPaid` | Active, `feesDue = 0`, `advanceCredit = 0` |
| `credit` | Active with `advanceCredit > 0` |
| `upcomingRenewals` | Active, `endDate` within next 30 days |

---

#### 15.10 Get Membership by ID

```
GET /api/memberships/:id
```
**Auth:** Required (admin, superadmin)

**Response:** Full membership object:
```json
{
  "data": {
    "_id": "...",
    "userId": { "_id": "...", "name": "...", "email": "...", "avatar": "..." },
    "planId": { "_id": "...", "name": "...", "durationDays": 30, "price": 1500, "features": [...] },
    "gymId": { "_id": "...", "name": "...", "slug": "..." },
    "startDate": "2026-01-15T00:00:00.000Z",
    "endDate": "2026-04-15T00:00:00.000Z",
    "status": "active",
    "feesAmount": 1500,
    "feesPaid": 1000,
    "feesDue": 500,
    "advanceCredit": 0,
    "lastPaymentDate": "2026-03-10T00:00:00.000Z",
    "paymentHistory": [
      { "amount": 1000, "date": "2026-03-10T00:00:00.000Z", "note": "First payment" }
    ],
    "assignedBy": "..."
  }
}
```

---

#### 15.11 Cancel Membership

```
PATCH /api/memberships/:id/cancel
```
**Auth:** Required (admin, superadmin)

---

#### 15.12 Record Payment

```
PUT /api/memberships/:id/fees
```
**Auth:** Required (admin, superadmin)

**Body:**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `amount` | number | Yes | Non-zero. Positive = payment. Negative = deduct from advance credit. |
| `note` | string | No | |
| `extendDays` | integer | No | Days to add to endDate. Reactivates expired memberships. |

**Common extendDays:** 30 (monthly), 90 (quarterly), 180 (half-yearly), 365 (yearly).

**Logic:**
1. `feesPaid += amount`
2. If overpaid → `feesDue = 0`, surplus → `advanceCredit`
3. If `extendDays` → `endDate += extendDays` days
4. Appends to `paymentHistory`

---

#### 15.13 Apply Advance Credit

```
POST /api/memberships/:id/apply-credit
```
**Auth:** Required (admin, superadmin)

**Body:**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `amount` | number | Yes | Positive, `<= advanceCredit` |
| `note` | string | No | |

Transfers advance credit to clear dues.

---

#### 15.14 Adjust Fees (Override)

```
PATCH /api/memberships/:id/fees/adjust
```
**Auth:** Required (admin, superadmin)

**Body:** At least one required:

| Field | Type | Notes |
|-------|------|-------|
| `feesAmount` | number | Override total fees |
| `feesPaid` | number | Override paid amount |
| `advanceCredit` | number | Override credit |
| `note` | string | Reason for adjustment |

Auto-recalculates `feesDue` from the new values.

---

## 16. Analytics (Admin)

Base path: `/api/admin`

### 16.1 Dashboard Stats

```
GET /api/admin/stats
```
**Auth:** Required (admin, superadmin)

Cached for 5 minutes.

---

### 16.2 Sales Report

```
GET /api/admin/sales-report
```
**Auth:** Required (superadmin only)

Cached for 5 minutes.

---

## 17. Contact

Base path: `/api/contact`

### 17.1 Submit Contact Form

```
POST /api/contact
```
**Auth:** None (public)

**Body:**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `name` | string | Yes | |
| `email` | string | Yes | Valid email |
| `phone` | string | Yes | Min 10 digits |
| `message` | string | Yes | Min 10 characters |

---

### 17.2 List Submissions

```
GET /api/contact?page=1&limit=10
```
**Auth:** Required (admin, superadmin)

---

### 17.3 Resolve Submission

```
PATCH /api/contact/:id/resolve
```
**Auth:** Required (admin, superadmin)

---

## 18. Workouts

Base path: `/api/workouts`

### 18.1 Create Workout

```
POST /api/workouts
```
**Auth:** Required (admin, superadmin)

**Body:**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `title` | string | Yes | |
| `category` | string | Yes | strength, cardio, flexibility, hiit, yoga, crossfit, other |
| `difficulty` | string | Yes | beginner, intermediate, advanced |
| `description` | string | No | |
| `duration` | number | No | In minutes |
| `caloriesBurn` | number | No | |
| `exercises` | array | No | |
| `image` | string | No | URL |
| `tags` | array | No | |

**Exercise object:**
```json
{
  "name": "Bench Press",
  "sets": 4,
  "reps": 10,
  "weight": 60,
  "duration": 0,
  "restTime": 90,
  "notes": "Control the descent"
}
```

---

### 18.2 List Workouts

```
GET /api/workouts?category=strength&difficulty=beginner&tag=chest&page=1&limit=10
```
**Auth:** None (public)

---

### 18.3 Get Workout by ID

```
GET /api/workouts/:id
```
**Auth:** None (public)

---

### 18.4 Update Workout

```
PUT /api/workouts/:id
```
**Auth:** Required (admin, superadmin)

**Body:** All create fields optional + `isPublished` boolean.

---

### 18.5 Delete Workout

```
DELETE /api/workouts/:id
```
**Auth:** Required (admin, superadmin)

---

## File Upload Reference

| Endpoint | Field | Type | Max Size | Folder |
|----------|-------|------|----------|--------|
| `PUT /api/auth/profile` | `avatar` | jpeg, png, webp | 5MB | reaux-labs/profiles |
| `POST /api/gyms` | `images`, `logo` | jpeg, png, webp | 5MB | reaux-labs/gyms |
| `POST /api/diets` | `image` | jpeg, png, webp | 5MB | reaux-labs/diets |
| `POST /api/products` | `images` | jpeg, png, webp | 5MB | reaux-labs/products |
| `POST /api/reels` | `video` | mp4, mov, avi | 100MB | reaux-labs/reels |

---

## Appendix

### Diet Categories
`weight-loss`, `muscle-gain`, `bulking`, `cutting`, `other`

### Diet Types
`veg`, `non-veg`, `both` (default)

### Workout Categories
`strength`, `cardio`, `flexibility`, `hiit`, `yoga`, `crossfit`, `other`

### Workout Difficulties
`beginner`, `intermediate`, `advanced`

### Order Status Flow
`pending` → `confirmed` → `shipped` → `delivered`
Any status → `cancelled`

### Membership Statuses
`active`, `expired`, `cancelled`

### User Roles
`user`, `admin`, `superadmin`
