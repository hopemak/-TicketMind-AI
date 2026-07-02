<div align="center">

# 🤖 TicketMind AI

### Intelligent Customer Support Ticket Classification Platform

Automatically classify customer support tickets, predict priority levels, and manage support workflows using Natural Language Processing and Machine Learning.

---

<p align="center">

<img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white"/>

<img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white"/>

<img src="https://img.shields.io/badge/Python-3.8+-3776AB?style=for-the-badge&logo=python&logoColor=white"/>

<img src="https://img.shields.io/badge/Flask-API-000000?style=for-the-badge&logo=flask"/>

<img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white"/>

<img src="https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white"/>

<img src="https://img.shields.io/badge/JWT-Authentication-orange?style=for-the-badge"/>

<img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge"/>

</p>

---

### Built with React • Node.js • Express • MongoDB • Python • Flask • NLP

*An end-to-end AI-powered customer support platform designed to streamline ticket management through intelligent classification and priority prediction.*

</div>

---

# 📑 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [Technology Stack](#-technology-stack)
- [Project Workflow](#-project-workflow)
- [Machine Learning Pipeline](#-machine-learning-pipeline)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [REST API](#-rest-api)
- [Machine Learning Model](#-machine-learning-model)
- [Screenshots](#-screenshots)
- [Future Improvements](#-future-improvements)
- [Contributing](#-contributing)
- [License](#-license)

---

# 📖 Overview

TicketMind AI is a full-stack customer support management platform that integrates modern web technologies with Natural Language Processing to automate ticket classification and assist support teams in handling customer requests efficiently.

Instead of manually reviewing every support request, the system analyzes incoming ticket descriptions, predicts the most appropriate category, estimates ticket priority, and stores the processed ticket inside a centralized database.

The project follows a modular microservice architecture where each component has a dedicated responsibility:

- **Frontend** provides an interactive dashboard for users.
- **Backend** handles authentication, ticket management, analytics, and business logic.
- **Machine Learning Service** performs intelligent ticket classification.
- **MongoDB** stores users, tickets, and application data.

This architecture keeps the system maintainable, scalable, and easy to extend with additional AI capabilities in the future.

---

# ✨ Key Features

## 🤖 AI Ticket Classification

Automatically predicts the most appropriate category for customer support tickets using Natural Language Processing and a custom Naive Bayes classifier.

---

## 🚦 Priority Prediction

Assigns a priority level to each ticket:

- High
- Medium
- Low

based on ticket content and predefined business rules.

---

## 📋 Ticket Management

Support agents can:

- Create tickets
- Update tickets
- Delete tickets
- Track ticket status
- View ticket history
- Search tickets

---

## 📊 Interactive Dashboard

Visualize customer support performance through interactive charts and statistics including:

- Total tickets
- Open tickets
- Closed tickets
- Priority distribution
- Category distribution
- Ticket trends

---

## 🔐 Secure Authentication

Authentication system includes:

- User Registration
- User Login
- Password Encryption
- JWT Authentication
- Protected Routes

---

## 📈 Analytics

Generate meaningful insights such as:

- Most common issues
- Category statistics
- Support workload
- Priority analysis

---

## ⚡ RESTful API

The backend exposes a clean REST API allowing communication between the frontend and the AI service.

---

## 🧩 Modular Architecture

Each service is developed independently, making the application easier to maintain, test, and extend.

---

# 🏗 System Architecture

```text
                          Customer

                              │

                              ▼

                  +-----------------------+
                  |    React Frontend     |
                  |      (Vite App)       |
                  |       Port 5173       |
                  +-----------+-----------+
                              │
                     HTTP / REST Requests
                              │
                              ▼
                  +-----------------------+
                  |  Node.js + Express    |
                  |      Backend API      |
                  |       Port 8080       |
                  +-----------+-----------+
                              │
             ┌────────────────┴──────────────┐
             │                               │
             ▼                               ▼

      +--------------+             +-----------------+
      | MongoDB      |             | Python Flask    |
      | Atlas        |             | ML Service      |
      | Database     |             | Port 5000       |
      +--------------+             +-----------------+
                                           │
                                           ▼
                               NLP + Naive Bayes Classifier
```

---

# 🔄 Project Workflow

```text
Customer submits ticket
            │
            ▼
Frontend sends request
            │
            ▼
Backend receives request
            │
            ▼
ML Service classifies ticket
            │
            ▼
Category + Priority Returned
            │
            ▼
Backend stores ticket
            │
            ▼
MongoDB Database
            │
            ▼
Dashboard updates automatically
```

---

# 🧠 Machine Learning Pipeline

```text
Customer Text

      │

      ▼

Text Cleaning

      │

      ▼

Tokenization

      │

      ▼

Stop Word Removal

      │

      ▼

Word Frequency Extraction

      │

      ▼

Naive Bayes Classification

      │

      ▼

Category Prediction

      │

      ▼

Priority Prediction

      │

      ▼

Confidence Score
```

---

# 🛠 Technology Stack

| Category | Technologies |
|-----------|--------------|
| **Frontend** | React 18, Vite, Tailwind CSS, Axios, Chart.js |
| **Backend** | Node.js, Express.js |
| **Machine Learning** | Python, Flask, NLTK |
| **Algorithm** | Custom Naive Bayes |
| **Database** | MongoDB Atlas |
| **Authentication** | JWT, bcrypt |
| **Communication** | REST API |
| **Version Control** | Git & GitHub |

---

# ⭐ Why This Project?

This project demonstrates practical experience in:

- Full-Stack Web Development
- REST API Design
- Machine Learning Integration
- Natural Language Processing
- Authentication & Authorization
- Database Design
- Microservice Architecture
- Frontend Dashboard Development
- Backend API Development
- AI-powered Web Applications

---

# 📁 Project Structure

```text
TicketMind-AI/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── ml-service/
│   ├── model/
│   ├── app.py
│   ├── classifier.py
│   ├── train_model.py
│   ├── preprocessing.py
│   ├── utils.py
│   ├── requirements.txt
│   └── saved_model.pkl
│
├── README.md
├── LICENSE
└── .gitignore
```

---

# 🚀 Installation

## Prerequisites

Before running the application, install the following software.

| Software | Version |
|-----------|----------|
| Node.js | 18+ |
| Python | 3.8 or newer |
| Git | Latest |
| npm | Latest |
| MongoDB Atlas | Recommended |

---

# 1️⃣ Clone Repository

```bash
git clone https://github.com/hopemak/-TicketMind-AI.git

cd -TicketMind-AI
```

---

# 2️⃣ Install Machine Learning Service

```bash
cd ml-service

pip install -r requirements.txt
```

Train the model.

```bash
python train_model.py
```

Run the Flask API.

```bash
python app.py
```

The ML service starts at

```
http://localhost:5000
```

---

# 3️⃣ Install Backend

```bash
cd backend

npm install
```

Start the server.

```bash
npm start
```

Backend runs on

```
http://localhost:8080
```

---

# 4️⃣ Install Frontend

```bash
cd frontend

npm install
```

Run the development server.

```bash
npm run dev
```

Frontend runs on

```
http://localhost:5173
```

---

# ⚙ Environment Variables

Create a `.env` file inside the **backend** directory.

```env
PORT=8080

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

ML_SERVICE_URL=http://localhost:5000
```

---

# 🔄 Running the Entire Project

### Terminal 1

```bash
cd ml-service

python app.py
```

---

### Terminal 2

```bash
cd backend

npm start
```

---

### Terminal 3

```bash
cd frontend

npm run dev
```

---

Open your browser.

```
http://localhost:5173
```

---

# 🔌 REST API

## Authentication

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT |

---

## Tickets

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/tickets` | Get all tickets |
| GET | `/api/tickets/:id` | Get ticket by ID |
| POST | `/api/tickets` | Create ticket |
| PUT | `/api/tickets/:id` | Update ticket |
| DELETE | `/api/tickets/:id` | Delete ticket |

---

## Analytics

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/analytics/dashboard` | Dashboard statistics |

---

## Machine Learning Service

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/classify` | Classify one ticket |
| POST | `/batch-classify` | Classify multiple tickets |
| GET | `/categories` | Supported categories |
| GET | `/health` | Service health status |

---

# 📨 Example Request

```bash
curl -X POST http://localhost:8080/api/tickets \
-H "Content-Type: application/json" \
-d '{
"title":"Unable to login",
"description":"Password reset email never arrives."
}'
```

---

# ✅ Example Response

```json
{
  "success": true,
  "data": {
    "ticketId": "TKT-1045",
    "category": "Account Access",
    "priority": "High",
    "confidence": 91.42,
    "status": "Open"
  }
}
```

---

# 🔍 Health Check

```bash
GET http://localhost:5000/health
```

Example response

```json
{
  "status": "healthy",
  "model": "loaded"
}
```

---

# 📊 Supported Ticket Categories

| Category |
|-----------|
| Technical Issue |
| Billing |
| Refund |
| Account Access |
| Feature Request |
| Complaint |
| General Inquiry |
| Bug Report |
| Shipping |
| Security |

---

# 🚦 Supported Priority Levels

| Priority |
|-----------|
| 🔴 High |
| 🟡 Medium |
| 🟢 Low |

---

# 💡 Design Principles

The project is designed around several engineering principles:

- Modular architecture
- Separation of concerns
- Stateless REST APIs
- Reusable React components
- Independent AI microservice
- Secure authentication using JWT
- Maintainable folder structure
- Scalable backend organization

---
---

# 📊 Machine Learning Model

TicketMind AI uses a lightweight Natural Language Processing (NLP) pipeline built with a custom implementation of the **Multinomial Naive Bayes** algorithm in pure Python.

Unlike traditional implementations that depend on large machine learning libraries, this approach keeps the service lightweight, easy to install, and compatible across Python versions.

### NLP Processing Pipeline

- Text normalization
- Tokenization
- Stop-word removal
- Word frequency extraction
- Naive Bayes probability calculation
- Category prediction
- Rule-based priority prediction
- Confidence score generation

---

## Supported Categories

| Category | Description |
|----------|-------------|
| Technical Issue | Software, hardware, or system-related problems |
| Billing | Payment and invoice questions |
| Refund | Refund requests and payment reversals |
| Account Access | Login, password, and account recovery |
| Feature Request | Suggestions for new functionality |
| Complaint | Customer dissatisfaction reports |
| General Inquiry | General questions and information |
| Bug Report | Reports of software defects |
| Shipping | Delivery and shipping issues |
| Security | Security concerns and suspicious activity |

---

# 📈 Model Output

Each prediction includes:

- Predicted category
- Ticket priority
- Confidence score
- Ticket metadata

Example:

```json
{
  "category": "Technical Issue",
  "priority": "High",
  "confidence": 94.18
}
```

---

# 🔄 Application Workflow

```text
Customer Creates Ticket
           │
           ▼
React Frontend
           │
           ▼
Node.js Backend
           │
           ▼
Python ML Service
           │
           ▼
Ticket Classification
           │
           ▼
Store in MongoDB
           │
           ▼
Dashboard Updates
```

---

# 🖼️ Screenshots

> Screenshots can be added after deployment.

Suggested images:

```
docs/images/

├── login.png
├── dashboard.png
├── create-ticket.png
├── analytics.png
├── ticket-list.png
└── classification-result.png
```

Example:

```markdown
## Dashboard

![Dashboard](docs/images/dashboard.png)

## Ticket Classification

![Classification](docs/images/classification-result.png)
```

---

# ⚡ Performance

| Feature | Description |
|----------|-------------|
| Response Time | Fast local inference |
| Architecture | Independent ML microservice |
| Authentication | JWT-based |
| Communication | REST APIs |
| Database | MongoDB Atlas |
| Deployment Ready | Yes |

---

# 🔒 Security Features

- Password hashing with bcrypt
- JWT authentication
- Protected API routes
- Environment variable configuration
- Separation of frontend and backend
- Independent AI service
- RESTful API design

---

# 🚀 Future Improvements

The project can be extended with additional features, including:

- Email notifications
- Ticket assignment system
- Admin role management
- Docker containerization
- CI/CD pipeline
- Model retraining interface
- File attachment support
- Real-time notifications
- AI-powered response suggestions
- Multi-language ticket classification
- Advanced analytics dashboard
- Kubernetes deployment

---

# 🤝 Contributing

Contributions are welcome.

If you'd like to improve the project:

1. Fork the repository.
2. Create a new feature branch.
3. Commit your changes.
4. Push the branch.
5. Open a Pull Request.

Bug reports, feature requests, and suggestions are always appreciated.

---

# 📚 Learning Objectives

This project demonstrates practical knowledge in:

- Full-Stack Web Development
- React Development
- Express.js APIs
- MongoDB Integration
- Python Programming
- Flask API Development
- Natural Language Processing
- Machine Learning Integration
- Authentication with JWT
- RESTful API Design
- Microservice Architecture
- Software Engineering Best Practices

---

# 📄 License

This project is licensed under the MIT License.

Feel free to use, modify, and learn from the source code.

---

# 👨‍💻 Author

## Abdi Negash

**Computer Science Student**

Passionate about:

- Artificial Intelligence
- Machine Learning
- Full-Stack Development
- Backend Engineering
- Software Engineering

GitHub:

```text
https://github.com/hopemak
```

---

# 🙏 Acknowledgements

This project was built using open-source technologies.

Special thanks to the communities behind:

- React
- Node.js
- Express.js
- MongoDB
- Flask
- Python
- NLTK
- Tailwind CSS
- Chart.js

---

<div align="center">

## ⭐ Support the Project

If you found this project helpful, consider giving it a ⭐ on GitHub.

It helps others discover the project and motivates future improvements.

---

**Made with ❤️ using React, Node.js, Express, MongoDB, Python, Flask, and Natural Language Processing.**

</div>
---

