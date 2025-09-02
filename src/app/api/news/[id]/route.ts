import { NextRequest, NextResponse } from "next/server";
import { MongoClient, Db, Collection, ObjectId } from "mongodb";

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
    _id?: ObjectId | string;
    id: number;
    title: string;
    category: string;
    details: string;
    time: string;
    createdAt: Date;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { collection } = await connectToDatabase();
    
    let newsItem;
    
    if (ObjectId.isValid(resolvedParams.id)) {
      newsItem = await collection.findOne({ _id: new ObjectId(resolvedParams.id) });
    }
    
    if (!newsItem) {
      const customId = parseInt(resolvedParams.id);
      if (!isNaN(customId)) {
        newsItem = await collection.findOne({ id: customId });
      }
    }

    if (!newsItem) {
      return NextResponse.json(
        { success: false, error: "News item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: newsItem
    });
  } catch (error) {
    console.error("Error fetching news item:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch news item" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { collection } = await connectToDatabase();
    
    let result;
    
    if (ObjectId.isValid(resolvedParams.id)) {
      result = await collection.deleteOne({ _id: new ObjectId(resolvedParams.id) });
    } else {
      const customId = parseInt(resolvedParams.id);
      if (!isNaN(customId)) {
        result = await collection.deleteOne({ id: customId });
      }
    }

    if (!result || result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: "News item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "News item deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting news item:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete news item" },
      { status: 500 }
    );
  }
}
