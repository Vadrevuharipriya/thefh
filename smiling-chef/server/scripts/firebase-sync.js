import 'dotenv/config';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import mongoose from 'mongoose';
import { connectDB } from '../db.js';

// Import your models
import Location from '../models/Location.js';
import Service from '../models/Service.js';
import Meal from '../models/Meal.js';
import Chef from '../models/Chef.js';
// Add other models as needed

// Check if Firebase credentials are configured
const hasFirebaseCredentials = !!(
  process.env.FIREBASE_PROJECT_ID &&
  process.env.FIREBASE_CLIENT_EMAIL &&
  process.env.FIREBASE_PRIVATE_KEY
);

if (!hasFirebaseCredentials) {
  console.error('❌ Firebase credentials not found in environment variables.');
  console.error('');
  console.error('📋 To fix this:');
  console.error('1. Go to Firebase Console (https://console.firebase.google.com/)');
  console.error('2. Select your project (tfh-partner-app)');
  console.error('3. Go to Project Settings → Service Accounts');
  console.error('4. Click "Generate New Private Key" (JSON format)');
  console.error('5. Save the downloaded JSON file');
  console.error('6. Add these to your .env file:');
  console.error('');
  console.error('   FIREBASE_PROJECT_ID="your-project-id"');
  console.error('   FIREBASE_CLIENT_EMAIL="your-service-account@your-project-id.iam.gserviceaccount.com"');
  console.error('   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\\\nYOUR_PRIVATE_KEY_HERE\\\\n-----END PRIVATE KEY-----"');
  console.error('');
  console.error('   Note: The private key must include the full text with \\\\n for line breaks');
  console.error('   Example: FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\\\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDb..."');
  console.error('');
  console.error('🔗 Firebase Service Accounts Guide:');
  console.error('   https://firebase.google.com/docs/admin/setup#initialize-sdk');
  process.exit(1);
}

// Firebase configuration for Admin SDK
function normalizeFirebasePrivateKey(key) {
  if (!key) return key;

  let normalizedKey = key.trim();

  if ((normalizedKey.startsWith('"') && normalizedKey.endsWith('"')) ||
      (normalizedKey.startsWith("'") && normalizedKey.endsWith("'"))) {
    normalizedKey = normalizedKey.slice(1, -1);
  }

  normalizedKey = normalizedKey
    .replace(/\\n/g, '\n')
    .replace(/\r/g, '')
    .trim();

  return normalizedKey;
}

function parseFirebaseServiceAccountJson(rawJson) {
  if (!rawJson) return null;

  let jsonString = rawJson.trim();
  if ((jsonString.startsWith('"') && jsonString.endsWith('"')) ||
      (jsonString.startsWith("'") && jsonString.endsWith("'"))) {
    jsonString = jsonString.slice(1, -1);
  }

  jsonString = jsonString.replace(/\r/g, '');

  try {
    return JSON.parse(jsonString);
  } catch (err) {
    console.error('❌ Failed to parse FIREBASE_SERVICE_ACCOUNT_JSON. Ensure it is valid JSON.');
    throw err;
  }
}

function getFirebaseServiceAccount() {
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (serviceAccountJson) {
    const parsed = parseFirebaseServiceAccountJson(serviceAccountJson);
    if (parsed.private_key) {
      parsed.private_key = normalizeFirebasePrivateKey(parsed.private_key);
      return parsed;
    }
    throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON is missing the private_key field.');
  }

  if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
    return null;
  }

  return {
    project_id: process.env.FIREBASE_PROJECT_ID.trim(),
    client_email: process.env.FIREBASE_CLIENT_EMAIL.trim(),
    private_key: normalizeFirebasePrivateKey(process.env.FIREBASE_PRIVATE_KEY),
  };
}

const firebaseServiceAccount = getFirebaseServiceAccount();
if (!firebaseServiceAccount) {
  console.error('❌ Firebase credentials not found or malformed in environment variables.');
  console.error('Provide either FIREBASE_SERVICE_ACCOUNT_JSON or FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY.');
  process.exit(1);
}

const firebaseConfig = {
  credential: cert({
    projectId: firebaseServiceAccount.project_id || firebaseServiceAccount.projectId,
    clientEmail: firebaseServiceAccount.client_email || firebaseServiceAccount.clientEmail,
    privateKey: firebaseServiceAccount.private_key || firebaseServiceAccount.privateKey,
  }),
};

// Initialize Firebase Admin SDK
try {
  initializeApp(firebaseConfig);
  console.log('✅ Firebase Admin SDK initialized');
} catch (error) {
  console.error('❌ Failed to initialize Firebase Admin SDK:', error.message);
  process.exit(1);
}

const db = getFirestore();

// Connect to MongoDB
await connectDB();
console.log('✅ Connected to MongoDB');

/**
 * Sync a Firebase collection to a MongoDB collection
 * @param {string} firebaseCollection - Name of the Firebase collection
 * @param {Model} mongoModel - Mongoose model for the MongoDB collection
 * @param {Function} transformFn - Function to transform Firebase doc to MongoDB doc
 */
async function syncCollection(firebaseCollection, mongoModel, transformFn, options = {}) {
  try {
    console.log(`\n--- Syncing ${firebaseCollection} ---`);
    
    // Get all documents from Firebase collection
    const snapshot = await db.collection(firebaseCollection).get();
    const firebaseDocs = [];
    
    snapshot.forEach(doc => {
      const data = doc.data();
      firebaseDocs.push({ id: doc.id, ...data });
    });
    
    console.log(`Found ${firebaseDocs.length} documents in Firebase ${firebaseCollection}`);
    
    let upserted = 0;
    let skipped = 0;
    
    for (const firebaseDoc of firebaseDocs) {
      try {
        // Transform Firebase document to MongoDB document format
        const mongoDoc = transformFn(firebaseDoc);
        
        const filter = options.upsertFilter
          ? options.upsertFilter(firebaseDoc)
          : { _id: firebaseDoc.id };

        const update = { ...mongoDoc };
        if (!options.upsertFilter) {
          update._id = firebaseDoc.id;
        }

        const resolveFields = options.upsertFields?.(firebaseDoc);
        if (resolveFields) {
          Object.assign(update, resolveFields);
        }

        const upsertOptions = { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true };
        
        await mongoModel.findOneAndUpdate(filter, update, upsertOptions);
        upserted++;
        console.log(`  ✓ Upserted: ${firebaseDoc.id}`);
      } catch (err) {
        console.error(`  ✗ Error processing ${firebaseDoc.id}:`, err.message);
        skipped++;
      }
    }
    
    console.log(`✓ ${firebaseCollection} sync complete. Upserted: ${upserted}, Skipped: ${skipped}`);
    return { upserted, skipped };
  } catch (err) {
    console.error(`✗ Error syncing ${firebaseCollection}:`, err);
    throw err;
  }
}

/**
 * Transform functions for different collections
 */

// Transform Firebase location document to MongoDB location document
function transformLocation(firebaseDoc) {
  const { id, name, slug, image, displayStatus, createdAt, updatedAt } = firebaseDoc;
  return {
    name,
    slug,
    image: image || '',
    displayStatus: displayStatus || 'Approved',
    // Add timestamps if needed
    // createdAt: createdAt?.toDate() || new Date(),
    // updatedAt: updatedAt?.toDate() || new Date()
  };
}

// Transform Firebase service document to MongoDB service document
function transformService(firebaseDoc) {
  const { id, name, menuName, filename, metaTitle, metaDesc, image, displayStatus, isCategory } = firebaseDoc;
  return {
    name,
    menuName,
    filename: filename || '',
    metaTitle: metaTitle || '',
    metaDesc: metaDesc || '',
    image: image || '',
    displayStatus: displayStatus || 'Approved',
    isCategory: isCategory !== undefined ? isCategory : true
  };
}

// Transform Firebase meal document to MongoDB meal document
function transformMeal(firebaseDoc) {
  const { id, name, description, price, category, image, availability, isVeg, isSpecial } = firebaseDoc;
  return {
    name,
    description: description || '',
    price: Number(price) || 0,
    category: category || '',
    image: image || '',
    availability: availability !== undefined ? availability : true,
    isVeg: isVeg !== undefined ? isVeg : true,
    isSpecial: isSpecial !== undefined ? isSpecial : false
  };
}

function slugify(value) {
  return value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Transform Firebase user document to MongoDB chef document
 * Firebase users data corresponds to chefs data in MongoDB
 */
function transformChef(firebaseDoc) {
  const { id, name, email, phone, role, city, experience, rating, events, followers, bio, 
          serviceTypes, cuisines, image, awards, displayStatus } = firebaseDoc;
  
  const baseSlug = firebaseDoc.slug ? slugify(firebaseDoc.slug) : slugify(name || 'chef');
  const slugSuffix = id ? id.toString().slice(0, 5).toLowerCase() : Math.random().toString(36).slice(2, 7);
  const slug = `${baseSlug}-${slugSuffix}`;
  
  const chefExperience = (() => {
    if (typeof experience === 'number') return experience;
    if (typeof experience === 'string') {
      const parsed = Number(experience.replace(/[^\\d]/g, ''));
      return Number.isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  })();

  const experienceTags = Array.isArray(experience) ? experience : [];

  return {
    firebaseId: id,
    name: name || '',
    slug,
    role: role || 'chef',
    email: email || '',
    mobile: phone || '',
    city: city || '',
    experience: chefExperience,
    experienceTags,
    rating: rating !== undefined ? rating : 0,
    events: events !== undefined ? events : 0,
    followers: followers !== undefined ? followers : 0,
    image: image || '',
    bio: bio || '',
    awards: Array.isArray(awards) ? awards : [],
    serviceTypes: Array.isArray(serviceTypes) ? serviceTypes : [],
    cuisines: Array.isArray(cuisines) ? cuisines : [],
    aadhaarNumber,
    aadharNumber,
    panNumber,
    aadhaarFrontUrl,
    aadharFrontUrl,
    aadhaarBackUrl,
    aadharBackUrl,
    panDocumentUrl,
    panUrl,
    ratingBreakdown: {
      5: firebaseDoc.ratingBreakdown?.['5'] || 0,
      4: firebaseDoc.ratingBreakdown?.['4'] || 0,
      3: firebaseDoc.ratingBreakdown?.['3'] || 0,
      2: firebaseDoc.ratingBreakdown?.['2'] || 0,
      1: firebaseDoc.ratingBreakdown?.['1'] || 0
    },
    totalRatings: firebaseDoc.totalRatings !== undefined ? firebaseDoc.totalRatings : 0,
    displayStatus: displayStatus || 'Approved'
    // timestamps will be set automatically by Mongoose
  };
}

/**
 * Main sync function
 */
async function main() {
  try {
    console.log('🔥 Starting Firebase to MongoDB synchronization...\n');
    
    // Define which collections to sync
    const syncConfigs = [
      {
        firebaseCollection: 'locations',
        mongoModel: Location,
        transformFn: transformLocation
      },
      {
        firebaseCollection: 'services',
        mongoModel: Service,
        transformFn: transformService
      },
      {
        firebaseCollection: 'meals',
        mongoModel: Meal,
        transformFn: transformMeal
      },
      {
        firebaseCollection: 'users', // Firebase users data
        mongoModel: Chef, // Maps to MongoDB chefs collection
        transformFn: transformChef, // Transform Firebase user to MongoDB chef
        options: {
          upsertFilter: (firebaseDoc) => ({ firebaseId: firebaseDoc.id })
        }
      }
      // Add more collections as needed
    ];
    
    // Run sync for each collection
    let totalUpserted = 0;
    let totalSkipped = 0;
    
    for (const config of syncConfigs) {
      try {
        const result = await syncCollection(
          config.firebaseCollection,
          config.mongoModel,
          config.transformFn,
          config.options
        );
        totalUpserted += result.upserted;
        totalSkipped += result.skipped;
      } catch (err) {
        console.error(`❌ Failed to sync ${config.firebaseCollection}:`, err.message);
        // Continue with other collections even if one fails
      }
    }
    
    console.log(`\n🎉 Synchronization complete!`);
    console.log(`   Total upserted: ${totalUpserted}`);
    console.log(`   Total skipped: ${totalSkipped}`);
    
    process.exit(0);
  } catch (err) {
    console.error('🔥 Synchronization failed:', err);
    process.exit(1);
  }
}

// Run the sync
main();