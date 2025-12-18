# SkillScope 🚀

SkillScope is a **full-stack job analytics and skill tracking platform** built to help users explore job opportunities, understand market trends, and gain insights into required skills. The project combines a **Django backend** with a **React frontend** to provide a clean, data-driven experience.

This project was developed as part of my learning and growth as a software engineer and demonstrates backend development, frontend integration, and real-world data handling.

---

## ✨ Features

* 📊 **Job Analytics Dashboard** – Visual insights into job trends and statistics
* 🔍 **Job Listings** – Browse and explore job opportunities
* 🏢 **Company Pages** – View companies and related job information
* 🤖 **Job Scraping (Demo)** – Backend management commands to collect job data
* 🌐 **REST APIs** – Django-based APIs for frontend consumption
* ⚛️ **React Frontend** – Modern, component-based UI

---

## 🛠 Tech Stack

### Backend

* Python
* Django
* Django REST Framework
* SQLite (development)

### Frontend

* React.js
* JavaScript
* HTML5 / CSS3

### Tools & Other

* Git & GitHub
* Virtual Environment (venv)

---

## 📁 Project Structure

```
skillscope/
│── analytics/          # Analytics app
│── jobs/               # Jobs app (scraping, models, APIs)
│── frontend/           # Django frontend app
│── frontend-react/     # React frontend
│── skillscope_project/ # Django project settings
│── templates/          # HTML templates
│── static/             # Static files (CSS, etc.)
│── manage.py
│── requirements.txt
```

---

## ⚙️ How to Run the Project Locally

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Romaisa-09/SkillScope.git
cd SkillScope
```

### 2️⃣ Create & Activate Virtual Environment

```bash
python -m venv venv
source venv/bin/activate   # Linux / macOS
```

### 3️⃣ Install Dependencies

```bash
pip install -r requirements.txt
```

### 4️⃣ Run Migrations

```bash
python manage.py migrate
```

### 5️⃣ Start the Server

```bash
python manage.py runserver
```

Visit:

```
http://127.0.0.1:8000/
```

---

## 🎯 Purpose of This Project

SkillScope was built to:

* Practice **full-stack web development**
* Understand **job market analytics**
* Work with **Django + React integration**
* Improve real-world project structure for portfolios and interviews

---

## 🚧 Future Improvements

* User authentication
* Advanced filters & search
* Deployment (Docker / Cloud)
* Real-time job updates
* Improved UI & charts

---

## 👩‍💻 Author

**Romaisa**
Aspiring Software Engineer
GitHub: [Romaisa-09](https://github.com/Romaisa-09)

---

⭐ If you like this project, feel free to star the repository!
