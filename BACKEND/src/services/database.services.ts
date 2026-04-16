import {MongoClient} from 'mongodb'
import { envConfig } from "~/constants/config";

const uri = `mongodb://localhost:27017/hybrid_db`

class MongoDatabaseService {
    private client: MongoClient
}