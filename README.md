# Mini URL Shortener API

A modern, user-friendly URL shortener built with Node.js, Express, and PostgreSQL. This project demonstrates full-stack development skills with a focus on clean UI/UX and robust backend functionality.

## ✨ Features

### Backend
- **RESTful API** with Express.js and PostgreSQL
- **URL validation** and error handling
- **Rate limiting** (5 requests/minute per IP)
- **Click analytics** and expiration support
- **Human-readable code** with clear comments

### Frontend
- **Modern, responsive UI** with clean design
- **Real-time dashboard** showing all shortened URLs
- **Copy-to-clipboard** with visual confirmation
- **Click tracking** and expiration dates
- **Professional styling** with hover effects

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL database

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Hsinha11/Mini-URL-Shortener-API.git
   cd url-shortener
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up your database**
   ```bash
   # Create the database
   psql -U postgres -c "CREATE DATABASE shortener;"
   
   # Create the table
   psql -U postgres -d shortener -c "
   CREATE TABLE urls (
     id SERIAL PRIMARY KEY,
     original_url TEXT NOT NULL,
     short_code VARCHAR(10) UNIQUE NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     expires_at TIMESTAMP,
     click_count INTEGER DEFAULT 0
   );"
   ```

4. **Configure environment variables**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL=postgresql://postgres:your_password@localhost:5432/shortener
   PORT=3000
   BASE_URL=http://localhost:3000
   ```

5. **Start the server**
   ```bash
   npx nodemon index.js
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000` to use the web interface!

## 📖 API Usage

### Shorten a URL
```bash
curl -X POST http://localhost:3000/shorten \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com/very/long/url"}'
```

**Response:**
```json
{
  "shortUrl": "http://localhost:3000/abc123"
}
```

### Redirect to Original URL
```bash
curl -v http://localhost:3000/abc123
```

## 🎨 UI Features

- **Clean, modern interface** with professional styling
- **Real-time table** showing all your shortened URLs
- **One-click copy** with visual feedback
- **Click analytics** displayed in the dashboard
- **Responsive design** that works on all devices

## 🔧 Technical Details

### Architecture
- **Backend**: Express.js with PostgreSQL
- **Frontend**: Vanilla JavaScript with modern CSS
- **Database**: PostgreSQL with proper indexing
- **Rate Limiting**: In-memory implementation

### Code Quality
- Clean, readable code with meaningful variable names
- Proper error handling and validation
- RESTful API design principles
- Responsive and accessible UI

## 🐛 Error Handling

| Status | Description |
|--------|-------------|
| 400 | Invalid or missing URL |
| 404 | Short URL not found |
| 410 | URL has expired |
| 429 | Rate limit exceeded |
| 500 | Server error |

## 📊 Analytics

Each redirect automatically tracks:
- Click count per short URL
- Creation timestamp
- Expiration date (if set)

## 🚀 Deployment

This project is ready for deployment on platforms like:
- **Render.com** (recommended for Node.js + PostgreSQL)
- **Railway.app**
- **Heroku** (with PostgreSQL add-on)

## 🎯 What I Learned

Building this URL shortener was a great opportunity to practice:
- Full-stack development with modern tools
- Database design and optimization
- User interface design and UX principles
- API design and error handling
- Git workflow and project organization

## 🔮 Future Improvements

- Custom short codes with collision detection
- QR code generation for mobile sharing
- User authentication and private URLs
- Advanced analytics dashboard
- Bulk URL shortening

## 📝 Developer Notes

I focused on creating a clean, maintainable codebase with a user-friendly interface. The project demonstrates both backend API development and frontend UI design skills, with particular attention to error handling and user experience.

The UI includes a dashboard showing all shortened URLs with their analytics, making it easy to track usage and manage links. The copy-to-clipboard functionality with visual feedback enhances the user experience significantly.

---

**Made with ❤️ for the assignment**

*If you have any questions or suggestions, feel free to reach out!* 