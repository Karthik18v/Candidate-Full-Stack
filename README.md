# 👥 Candidate Management Full Stack App

A full-stack web application to manage candidate information. Built with **React** for the frontend and **Node.js, Express, MongoDB** for the backend. Features include search, filter, pagination, and candidate creation.

## 🚀 Live Demo

- **Backend API**: https://candidate-full-stack.onrender.com
- **Frontend**: https://candidate-full-stack.vercel.app/

## 🛠️ Tech Stack

- **Frontend**: React, CSS, React Icons  
- **Backend**: Node.js, Express, Mongoose  
- **Database**: MongoDB  
- **Deployment**: Render (backend)

## 📂 Folder Structure

```
Candidate-Full-Stack/
├── backend/         # Express server
│   ├── models/      # Mongoose schemas
│   ├── config/      # MongoDB connection
│   └── server.js    # Main backend entry
│
├── frontend/        # React app
│   ├── App.js       # Main component
│   ├── App.css      # Styling
│   └── ...
```

## 🎯 Features

- 🔍 Search by name, email, or phone  
- 🧑‍🔬 Filter by gender, experience range, skills  
- 📜 Pagination support  
- ➕ Add candidate through popup form  
- ⚡ Real-time filtering

## 📡 API Endpoints

### `GET /candidates`

Query Parameters:

| Parameter       | Description                           |
|------------------|---------------------------------------|
| `search`         | Search by name/email/phone            |
| `gender`         | Male / Female / Other                 |
| `minExperience`  | Minimum experience (years)            |
| `maxExperience`  | Maximum experience (years)            |
| `skills`         | Comma-separated skills (e.g. React,Node.js) |
| `page`           | Page number                           |
| `limit`          | Results per page                      |

**Example**:  
```
/candidates?search=John&gender=Male&skills=React,Node.js&page=1&limit=10
```

### `POST /candidates`

Add a new candidate.

**JSON Body Example**:
```json
{
  "name": "Karthik Chittiprolu",
  "email": "karthik@example.com",
  "phone": "9876543210",
  "gender": "Male",
  "experience": 3,
  "skills": ["React", "Node.js"]
}
```

## ▶️ Running Locally

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/Candidate-Full-Stack.git
cd Candidate-Full-Stack
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file in the backend folder:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

Start backend:
```bash
npm start
```

### 3. Setup Frontend

```bash
cd frontend
npm install
npm start
```

Visit: `http://localhost:3000`

## 💡 Future Improvements

- 📝 Edit & Delete candidates  
- 🔐 Authentication (Login system)  
- 📎 Resume uploads  
- 🎨 UI enhancements

## 👨‍💻 Author

**Karthik Chittiprolu**  
📍 Nalgonda  
🎯 Full Stack Developer  

## 📄 License

MIT License
