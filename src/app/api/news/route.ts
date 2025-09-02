import { NextRequest, NextResponse } from "next/server";
import { MongoClient, Db, Collection, ObjectId } from "mongodb"
import clientPromise from "@/lib/mongodb";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const DB_NAME = "news_ticker";
const COLLECTION_NAME = "news";

let client: MongoClient | null = null;

async function connectToDatabase(): Promise<{ db: Db; collection: Collection<NewsItem> }> {
    if (!client) {
        client = new MongoClient(MONGODB_URI);
        await client.connect();

    }
    const db = client.db(DB_NAME);
    const collection = db.collection<NewsItem>(COLLECTION_NAME);
    return { db, collection };
}

interface NewsItem {
    _id?: string;
    id: number;
    title: string;
    category: string;
    details: string;
    time: string;
    createdAt: Date;
}

function generateUniqueId(): number {
    return Date.now() + Math.floor(Math.random() * 1000);
}
function getTimeAgo(): string {
    return "Just now";
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        if (!body.title || !body.category || !body.details) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const { collection } = await connectToDatabase();

        const newsItem: NewsItem = {
            id: generateUniqueId(),
            title: body.title.trim(),
            category: body.category,
            details: body.details.trim(),
            time: getTimeAgo(),
            createdAt: new Date(),
        };
        const result = await collection.insertOne(newsItem);
        return NextResponse.json(
            { success: true, data: { ...newsItem, _id: result.insertedId.toString() } },
            { status: 201 }
        );
    }
    catch (error) {
        return NextResponse.json(
            { error: "Internal Server Error", message: error instanceof Error ? error.message : "Unknown" },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
  try {
    const { collection } = await connectToDatabase();
    const { searchParams } = new URL(request.url);
    
    // Get query parameters
    const limit = searchParams.get('limit');
    const category = searchParams.get('category');
    const exclude = searchParams.get('exclude');

    // Build query filter
    let filter: any = {};
    
    if (category) {
      filter.category = category;
    }
    
    if (exclude) {
      // Exclude by _id or custom id
      if (ObjectId.isValid(exclude)) {
        filter._id = { $ne: new ObjectId(exclude) };
      } else {
        const excludeId = parseInt(exclude);
        if (!isNaN(excludeId)) {
          filter.id = { $ne: excludeId };
        }
      }
    }

    let query = collection.find(filter).sort({ createdAt: -1 });
    
    if (limit) {
      const limitNum = parseInt(limit);
      if (!isNaN(limitNum) && limitNum > 0) {
        query = query.limit(limitNum);
      }
    }

    const newsItems = await query.toArray();

    return NextResponse.json({
      success: true,
      data: newsItems
    });
  } catch (error) {
    console.error("Error fetching news:", error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}
