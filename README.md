# Mini URL Shortener API

## Setup

1. **Clone the repo**
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Configure environment variables**
   - Create a `.env` file in the root directory:
     ```env
     DATABASE_URL=postgresql://username:password@localhost:5432/shortener
     PORT=3000
     ```
   - Replace `username`, `password`, and `shortener` with your PostgreSQL credentials and database name.
4. **Create the database and table** (see below)
5. **Run the server**
   ```bash
   npx nodemon index.js
   ```

## Database Table

You will need a table for storing URLs. Example SQL:
```sql
CREATE TABLE urls (
  id SERIAL PRIMARY KEY,
  original_url TEXT NOT NULL,
  short_code VARCHAR(10) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP,
  click_count INTEGER DEFAULT 0
);
```

## API Endpoints

- `POST /shorten` — Shorten a URL
- `GET /:code` — Redirect to original URL

## To Do
- Add rate limiting
- Add expiration logic
- Add analytics (click count)

## Usage Examples

### Shorten a URL
POST /shorten
```json
{
  "url": "https://example.com/some/very/long/link"
}
```
Response:
```json
{
  "shortUrl": "http://localhost:3000/abc123"
}
```

### Redirect
GET /abc123
- Redirects to the original URL if found and not expired.
- Returns 404 if not found, 410 if expired.

### Error Handling
- 400: Invalid or missing URL
- 404: Short URL not found
- 410: Short URL expired
- 429: Rate limit exceeded (5 requests/minute per IP)
- 500: Server error

### Analytics
- Each redirect increments the `click_count` column in the database.

### Expiration
- If `expires_at` is set and in the past, the short URL returns 410 Gone.

## Quickstart (All Steps)

1. **Create the PostgreSQL database:**
   ```sh
   psql -U postgres -c "CREATE DATABASE shortener;"
   ```
2. **Create the table:**
   ```sh
   psql -U postgres -d shortener -c "\
   CREATE TABLE urls (\
     id SERIAL PRIMARY KEY,\
     original_url TEXT NOT NULL,\
     short_code VARCHAR(10) UNIQUE NOT NULL,\
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\
     expires_at TIMESTAMP,\
     click_count INTEGER DEFAULT 0\
   );\
   "
   ```
3. **Create a `.env` file in the project root:**
   ```env
   DATABASE_URL=postgresql://postgres:your_password@localhost:5432/shortener
   PORT=3000
   BASE_URL=http://localhost:3000
   ```
   Replace `your_password` with your actual password.
4. **Install dependencies:**
   ```sh
   npm install
   ```
5. **Run the server:**
   ```sh
   npx nodemon index.js
   ```
6. **Test the API:**
   - Use the included `postman_collection.json` in Postman
   - Or use `curl`/HTTPie as shown in the Usage Examples above

## UI Features

- Modern, responsive design
- Table of all shortened URLs (shows short URL, original URL, click count, expiration)
- Blue copy-to-clipboard button with confirmation message
- Centered short links in both the result and table
- Favicon (🔗) in browser tab
- Footer: "Made with ❤️ for the assignment"
- All styles are now in `public/globals.css` for easy editing

--- 