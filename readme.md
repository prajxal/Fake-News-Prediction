# 📰 Fake News Detector

🚧 **Status: Under Development (MVP Phase)** 🚧

This project is a **Fake News Detector** that helps identify whether a given news input is real or fake. Currently, it is in the **MVP (Minimum Viable Product)** stage and under active development.

---

## ⚙️ How to Run the Project

Follow these steps to get the project running on your local machine:

### 1. Clone the Repository
```bash
 git clone https://github.com/your-username/FakeNews.git
 cd FakeNews
```

### 2. Download the Dataset
The dataset files (`train.csv`, `True.csv`, `False.csv`) are **not included in this repository** due to GitHub’s file size limits.  
Please download them from Google Drive:

👉 [Download Dataset](https://drive.google.com/drive/folders/1tb58KrW7Zx9N31aLLpI_3BtL48UZKilD?usp=drive_link)

After downloading, place them in the `data/` folder of the project:
```
FakeNews/
 └── data/
      ├── train.csv
      ├── True.csv
      └── False.csv
```

### 3. Start the Frontend
Navigate to the **frontend** directory and open the `index.html` file.
```bash
 cd frontend
 start index.html   # For Windows
 # or
 open index.html    # For MacOS
```
This will launch the frontend UI in your browser.

### 4. Start the Backend (Flask API)
Navigate to the **backend** directory and start the Flask server:
```bash
 cd backend
 python app.py
```
If everything runs correctly, Flask will start the server at:
```
 http://127.0.0.1:5000
```

### 5. Using the Application
- Open the frontend in your browser (step 3).
- The frontend will communicate with the Flask backend.
- You can enter news text and check if it is **Real** or **Fake**.

---

## 🛠️ Tech Stack
- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Python (Flask)
- **Machine Learning Model:** (To be integrated)

---

## 📌 Notes
- This project is still in the **MVP phase**.
- More features, better UI, and improved accuracy will be added soon.
- Do **not** use this in production yet.

---


