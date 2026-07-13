# 🚀 Otomata Studio - TBO Capstone Project

**Aplikasi Web Interaktif untuk Simulasi dan Visualisasi Teori Bahasa dan Otomata**

Proyek ini merupakan Capstone Project berbasis *Outcome-Based Education* (OBE) untuk mata kuliah Teori Bahasa dan Otomata (TBO) Semester IV Tahun Akademik 2025/2026 Genap di Program Studi Informatika, Universitas Bale Bandung. 

Otomata Studio dirancang sebagai *platform* edukasi interaktif yang mendemonstrasikan bagaimana mesin komputasi abstrak memproses bahasa. Aplikasi ini tidak hanya sekadar mengeksekusi algoritma di belakang layar, tetapi juga memvisualisasikan setiap pergerakan *state*, *trace* transisi, pembentukan pohon penurunan (*Parse Tree*), hingga transformasi tata bahasa secara *real-time* dan grafis. Tujuannya adalah untuk menjembatani konsep matematis abstrak dari Automata menjadi representasi visual yang mudah dipahami.

---

## 🔗 Tautan Penting

- **🌍 Live Application:** [Masukkan Link Domain .my.id Kamu]
- **🎥 Video Presentasi & Demo:** [Masukkan Link YouTube Unlisted/Publik Kamu]

---

## 🌟 Fitur Utama per Modul

Proyek ini mengintegrasikan empat modul wajib komputasi Automata ke dalam satu ekosistem web tunggal:

### ⚙️ Modul 1: Finite State Automata (FSA) & Mesin Output
- **Simulator DFA & NFA:** Menguji validitas *string* masukan dengan visualisasi grafis dari *state* aktif dan *trace* transisi.
- **Konversi NFA ke DFA:** Mengimplementasikan algoritma *Subset Construction* untuk mengubah mesin non-deterministik menjadi deterministik.
- **Mesin Output (Moore & Mealy):** Simulasi mesin yang tidak hanya menerima/menolak *string*, tetapi juga memancarkan *output* spesifik pada *state* (Moore) atau transisi (Mealy).

### 🔤 Modul 2: Regular Expression (Regex)
- **Regex to NFA Converter:** Mengonversi ekspresi reguler menjadi *Non-Deterministic Finite Automata* (NFA) menggunakan **Thompson's Construction Algorithm**.
- Dilengkapi dengan *epsilon transitions* (ε) yang divisualisasikan dengan garis putus-putus untuk membedakannya dari transisi alfabet standar.

### 🌳 Modul 3: Pushdown Automata & Context-Free Grammar (CFG)
- **String Acceptance Simulation:** Mengevaluasi apakah suatu *string* dapat diturunkan dari aturan produksi CFG yang diberikan menggunakan algoritma *backtracking*.
- **Leftmost Derivation & Parse Tree:** Memvisualisasikan proses derivasi dari *Start Symbol* hingga menjadi *terminal* dalam bentuk pohon hierarki (*Top-Down Grid System*).

### 🔄 Modul 4: Hierarki Chomsky & Chomsky Normal Form (CNF)
- **Transformasi Bertahap:** Menampilkan proses konversi CFG ke CNF langkah-demi-langkah.
- **Langkah 1 & 2:** Gramatika awal dan Eliminasi *Epsilon-production*.
- **Langkah 3 & 4:** Eliminasi *Unit-production* dan transformasi final menjadi biner variabel (CNF).

---

## 💻 Teknologi yang Digunakan (Tech Stack)

Aplikasi ini dibangun menggunakan arsitektur modern yang memisahkan antara antarmuka pengguna (*Client*) dan mesin pemroses logika (*Server*):

- **Frontend (Client-Side):** - React.js (dengan Vite untuk *build tool* yang super cepat)
  - React Router DOM (untuk navigasi *Single Page Application*)
  - React Flow & @xyflow/react (untuk *rendering* diagram *Node & Edge* interaktif)
  - Lucide React (untuk ikon UI responsif)
- **Backend (Server-Side):** - Python 3.x
  - Flask (*Micro-framework* API) & Flask-CORS
- **Deployment:** - Vercel (Hosting *Frontend* statis dan integrasi *Serverless Function* untuk Flask)

---

## 🚀 Cara Instalasi & Menjalankan Aplikasi di Lokal

Pastikan komputer Anda sudah terinstal **Node.js** dan **Python 3**.

### 1. Clone Repositori
```bash
   git clone [[https://github.com/](https://github.com/)ReidOates/tbo-capstone.git](https://github.com/ReidOates/tubes-tbo-301240032.git)
   cd tbo-capstone
```

2. Konfigurasi Backend (Terminal 1)
```bash
   cd src/backend
   # Buat Virtual Environment
   python -m venv venv

   # Aktivasi Environment (Windows)
   .\venv\Scripts\activate
   # (Untuk Mac/Linux: source venv/bin/activate)

   # Install Dependensi
   pip install -r requirements.txt

   # Jalankan Server Flask (Berjalan di port 5000)
   python app.py
```
3. Konfigurasi Frontend (Terminal 2)
```Bash
   cd src/frontend

   # Install Dependensi NPM
   npm install

   # Jalankan Server Development Vite
   npm run dev

    Buka browser dan akses: http://localhost:5173
```

🤖 Deklarasi Penggunaan AI
Sesuai dengan ketentuan penugasan Capstone Project, proyek ini dikembangkan dengan bantuan AI (Google Gemini) sebagai coding partner.

Bagian yang dibantu oleh AI:

Penyusunan kerangka dasar algoritma DFS (Depth-First Search) untuk logika penelusuran Parse Tree di backend (Modul 3).

Konfigurasi file vercel.json untuk mengintegrasikan React dan Flask ke dalam satu environment deployment serverless.

Scaffolding awal komponen UI menggunakan React Flow.

Pemahaman & Modifikasi Mandiri Mahasiswa:

Memodifikasi logika Grid System pada React Flow secara mandiri untuk memastikan Parse Tree merender secara hierarkis (vertikal) dan responsif.

Mengimplementasikan sistem routing (React Router) dan UI Sidebar/Hamburger menu agar aplikasi terstruktur per modul dan mendukung tampilan mobile (responsif).

Melakukan debugging aktif pada Endpoint API Flask, terutama saat menangani parameter JSON yang memicu Error 400 Bad Request pada algoritma Modul 4 (CNF) dengan menerapkan proteksi tipe data dan try-catch blok.

Memastikan semua logika State Machine mematuhi definisi formal (5-Tuple) yang dipelajari di kelas.

© 2026 | Dikembangkan oleh Muhammad Emil Mushthopa - 301240032
