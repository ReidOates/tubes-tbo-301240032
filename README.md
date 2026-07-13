# Otomata Studio - TBO Capstone Project

Aplikasi web interaktif untuk memvisualisasikan teori bahasa dan otomata. Proyek ini dikembangkan untuk memenuhi tugas akhir mata kuliah Teori Bahasa dan Otomata (Semester IV Genap 2025/2026).

## 🚀 Fitur Utama
Aplikasi ini mengintegrasikan empat modul wajib sesuai kurikulum:

1.  **Modul 1: Finite State Automata (FSA)**
    * **Simulator DFA & NFA:** Visualisasi *trace* state secara real-time.
    * **Konversi NFA ke DFA:** Implementasi *Subset Construction*.
    * **Mesin Output:** Simulator untuk Mesin Moore dan Mealy dengan pemetaan output.
2.  **Modul 2: Regular Expression**
    * Konversi Regex ke NFA menggunakan *Thompson's Construction*.
3.  **Modul 3: Pushdown Automata & CFG**
    * Simulasi *string acceptance* berdasarkan aturan produksi.
    * Visualisasi *Parse Tree* (Leftmost Derivation) menggunakan sistem *grid* otomatis.
4.  **Modul 4: Hierarki Chomsky & CNF**
    * Transformasi tata bahasa langkah-demi-langkah: Eliminasi Epsilon, Unit, dan konversi ke Chomsky Normal Form.

## 🛠️ Tech Stack
* **Frontend:** React.js, Vite, React Router, React Flow (untuk visualisasi grafis).
* **Backend:** Python (Flask), Flask-CORS.
* **Deployment:** Vercel (Serverless Function).

## ⚙️ Cara Instalasi Lokal
1. **Clone Repositori:**
   ```bash
   git clone https://github.com/ReidOates/tubes-tbo-301240032
   cd tbo-capstone
   ```

2. **Setup Backend:**
```Bash
    cd src/backend
    python -m venv venv
    # Aktivasi venv
    pip install -r requirements.txt
    python app.py
    Setup Frontend:
```
```Bash
    cd src/frontend
    npm install
    npm run dev
    Aplikasi akan berjalan di http://localhost:5173.
```

🤖 Pernyataan Penggunaan AI
Sesuai dengan ketentuan tugas, pengerjaan proyek ini dibantu oleh AI (Gemini) sebagai coding partner. Bagian yang dibantu meliputi:

* Penyusunan algoritma backtracking untuk Parse Tree (Modul 3).

* Konfigurasi integrasi antara Flask dan React untuk deployment di Vercel.

* Pembuatan tata letak responsif dan integrasi React Flow untuk visualisasi node dan edge.

Modifikasi & Pemahaman Mahasiswa:
Saya secara mandiri melakukan modifikasi pada:

* Logika grid system untuk memastikan node otomatis pindah baris agar tidak memenuhi layar.

* Penyesuaian color palette untuk menyesuaikan tampilan antar modul agar konsisten.

* Pengembangan logika backend pada mesin Moore & Mealy untuk memastikan output sesuai dengan definisi formal yang diajarkan di kelas.

* Uji coba validitas state machine dengan berbagai test case untuk memastikan aplikasi dapat menangani input kompleks.

Dibuat oleh: Muhammad Emil Mushthopa - 301240032