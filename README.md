# PCOS-Intelligence_clinic_support_system

🩺 PCOS Intelligence – Clinical Decision Support System
=======================================================

A **full-stack clinical support system** for **Polycystic Ovary Syndrome (PCOS)** that combinesAI-assisted diagnosis logic, protocol-based reasoning, and a modern interactive frontend.

> 🎯 Built to assist clinicians and patients with structured PCOS assessment, insights, and reporting.

🧠 Project Overview
-------------------

**PCOS Intelligence** is a two-part system:

*   **Backend (Django)**Handles clinical logic, diagnostic workflows, PCOS protocols, and AI/RAG-based reasoning.
    
*   **Frontend (PCOS Compass – React + Vite)**A modern UI for patient input, diagnostic forms, and structured result visualization.
    

🏗️ Project Structure
---------------------

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   PCOS/  ├── backend/                     # Django backend (PCOS Intelligence)  │   ├── manage.py  │   ├── requirements.txt  │   ├── Clinical_Daignose/        # Core diagnostic app  │   │   ├── engine.py             # Diagnostic engine  │   │   ├── rag_engine.py         # RAG / AI reasoning logic  │   │   ├── check_model.py  │   │   ├── models.py  │   │   ├── views.py  │   │   ├── urls.py  │   │   ├── pcos_protocols.json   # Medical protocols & rules  │   │   └── templates/  │   └── PCOS_Intelligence/        # Django project settings  │       ├── settings.py  │       ├── urls.py  │       └── wsgi.py  │  ├── frontend/                    # PCOS Compass frontend  │   └── pcos-compass-main/  │       ├── src/  │       │   ├── components/       # UI components  │       │   ├── pages/            # App pages  │       │   ├── hooks/  │       │   └── App.tsx  │       ├── index.html  │       ├── package.json  │       └── vite.config.ts  │  ├── start-dev.bat                 # Windows dev runner  ├── start-dev.sh                  # Linux/Mac dev runner  ├── README.md  └── TODO.md   `

⚙️ Tech Stack
-------------

### Backend

*   **Python**
    
*   **Django**
    
*   **Django Templates**
    
*   Rule-based + RAG diagnostic engine
    
*   JSON-based clinical protocols
    

### Frontend

*   **React (TypeScript)**
    
*   **Vite**
    
*   **Tailwind CSS**
    
*   **ShadCN UI**
    
*   Component-driven architecture
    

🚀 Features
-----------

### 🔬 Clinical Intelligence

*   Rule-based PCOS diagnostic evaluation
    
*   Protocol-driven decision logic
    
*   AI-assisted reasoning via RAG engine
    
*   Structured diagnostic reports
    

### 🧾 User Experience

*   Guided PCOS assessment form
    
*   Clean and responsive UI
    
*   Diagnostic report visualization
    
*   Modular and reusable components
    

🛠️ Setup & Installation
------------------------

### 1️⃣ Clone the Repository

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   git clone https://github.com/SujalKhdgi/PCOS-Intelligence_clinic_support_system.git  cd PCOS   `

### 2️⃣ Backend Setup (Django)

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   cd backend  python -m venv venv  venv\Scripts\activate   # Windows  # source venv/bin/activate  # Linux/Mac  pip install -r requirements.txt  python manage.py migrate  python manage.py runserver   `

📍 Backend will run at:http://127.0.0.1:8000/

### 3️⃣ Frontend Setup (PCOS Compass)

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   cd frontend/pcos-compass-main  npm install  npm run dev   `

📍 Frontend will run at:http://localhost:5173/

🧪 Development Mode (One Command)
---------------------------------

Use the provided scripts:

### Windows

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   start-dev.bat   `

### Linux / Mac

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   chmod +x start-dev.sh  ./start-dev.sh   `

🧠 Clinical Disclaimer
----------------------

⚠️ **This system is for educational and research purposes only.**It is **not a replacement for professional medical diagnosis or treatment**.

🧭 Future Enhancements
----------------------

*   🔐 Authentication & user profiles
    
*   📊 Patient history tracking
    
*   🧠 Model-based prediction integration
    
*   ☁️ Cloud deployment
    
*   📱 Mobile-friendly UI
    

👨‍💻 Author
------------

**Sujal Khadgi**📌 Computer Science | AI & Healthcare Systems🔗 GitHub: [SujalKhdgi](https://github.com/SujalKhdgi)

⭐ Support
---------

If you like this project:

*   ⭐ Star the repository
    
*   🧠 Share feedback
    
*   🛠️ Contribute improvements
    

