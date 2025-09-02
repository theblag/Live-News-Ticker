# Live News Ticker

A modern, full-stack news ticker web app built with [Next.js](https://nextjs.org) and MongoDB.  
Admins can add news, and users see a live-updating, dynamic news feed.

---

## 🚀 Getting Started

### 1. Clone & Install Dependencies

```bash
git clone <your-repo-url>
cd news-ticker
npm install
```

### 2. Set Up MongoDB

You can use **MongoDB Atlas** (cloud) or run MongoDB locally.

#### **MongoDB Atlas (Recommended)**
- Go to [MongoDB Atlas](https://www.mongodb.com/atlas/database).
- Create a free cluster.
- Add a database user and whitelist your IP.
- Get your connection string (looks like `mongodb+srv://<user>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority`).

#### **Local MongoDB**
- [Install MongoDB Community Edition](https://www.mongodb.com/try/download/community).
- Start MongoDB locally (default URI: `mongodb://localhost:27017`).

---

### 3. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority
```
- Replace with your Atlas URI or use `mongodb://localhost:27017` for local.

---

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗂️ .env File Structure

```
.env.local
-----------
MONGODB_URI=your-mongodb-connection-string
```

---

## ✨ Features & Improvements

- **Live News Ticker:** Auto-updating, animated ticker on the homepage.
- **Admin Page:** Add news with title, category, and details via a modern form.
- **Dynamic Routing:** Each news item has its own detail page (`/news/[id]`).
- **MongoDB Integration:** News is stored and fetched from MongoDB (Atlas or local).
- **Black & White Theme:** Clean, accessible, and minimal UI.
- **Category Tags:** Colorful badges for each news category.
- **Responsive Design:** Works on desktop and mobile.
- **Error Handling:** User-friendly messages for loading, errors, and empty states.
- **No unnecessary files:** Only essential pages and API routes are included.

---

## 🛠️ Project Structure

```
src/
  app/
    api/
      news/
        route.ts         # All news (GET, POST)
        [id]/
          route.ts       # Individual news (GET, DELETE)
    news/
      page.tsx           # News listing page
      [id]/
        page.tsx         # News detail page
    add/
      page.tsx           # Admin add-news page
  components/
    navbar.tsx           # Navigation bar
```

---