import { connectMongo, getMongoDB, getMongoClient } from '~/utils/mongodb'
import { config } from 'dotenv'

// Load environment variables before doing anything else
config()

import mockCategories from '~/models/data/categories.data'
import mockProducts from '~/models/data/products.data'

const seedMongo = async () => {
  try {
    console.log('Connecting to MongoDB...')
    await connectMongo()
    const db = getMongoDB()

    console.log('Clearing existing collections...')
    const categoriesCollection = db.collection('categories')
    const productsCollection = db.collection('products')

    await categoriesCollection.deleteMany({})
    await productsCollection.deleteMany({})

    console.log('Inserting mock categories...')
    if (mockCategories.length > 0) {
      await categoriesCollection.insertMany(mockCategories as any)
      console.log(`Inserted ${mockCategories.length} categories.`)
    }

    console.log('Inserting mock products...')
    if (mockProducts.length > 0) {
      await productsCollection.insertMany(mockProducts as any)
      console.log(`Inserted ${mockProducts.length} products.`)
    }

    console.log('Creating indexes (schema enforcement)...')
    await categoriesCollection.createIndex({ slug: 1 }, { unique: true })
    await productsCollection.createIndex({ slug: 1 }, { unique: true })
    await productsCollection.createIndex({ categoryId: 1 })

    console.log('Done! Closing connection...')
    await getMongoClient().close()
    process.exit(0)
  } catch (error) {
    console.error('Seed failed:', error)
    if (getMongoClient()) {
      await getMongoClient().close()
    }
    process.exit(1)
  }
}

seedMongo()
