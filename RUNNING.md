# Cara Menjalankan & Testing ArtesionEdu

Panduan singkat supaya kamu bisa menjalankan dan testing aplikasi ArtesionEdu di lokal.

---

## Prasyarat

- **Node.js** versi 18 atau lebih baru
- **npm** (sudah bundled dengan Node.js)
- Terminal / Command Prompt / PowerShell / Git Bash

Cek versi:

```bash
node -v
npm -v
```

---

## 1. Install dependencies

Di folder root project, jalankan:

```bash
npm install
```

Perintah ini akan mengunduh semua package yang tertulis di `package.json`.

---

## 2. Jalankan mode development

```bash
npm run dev
```

- Buka browser dan akses URL yang muncul, biasanya: `http://localhost:5173`
- Setiap perubahan file akan otomatis reload di browser.
- Untuk menghentikan, tekan `Ctrl + C` di terminal.

---

## 3. Build untuk production

```bash
npm run build
```

Hasil build akan ada di folder `dist/`. File-file ini siap di-deploy ke Netlify, Vercel, GitHub Pages, atau hosting statis lainnya.

---

## 4. Preview hasil production build

```bash
npm run preview
```

- Akses URL yang muncul, biasanya: `http://localhost:4173`
- Ini menjalankan build production di lokal, cocok buat testing sebelum deploy.

---

## 5. Cek kualitas kode (lint)

```bash
npm run lint
```

Kalau output kosong, berarti tidak ada error. Kalau ada error, ESLint akan menunjukkan file dan barisnya.

---

## Testing Fitur Utama

### A. Alur latihan soal

1. Buka halaman beranda.
2. Klik **"Mulai Latihan"**.
3. Pilih mode:
   - **Latihan Soal UAS** — campuran 100 soal dari BAB 8-12.
   - **Latihan Per BAB** — pilih salah satu BAB 8-12.
4. Kerjakan soal: pilih jawaban → klik **"Konfirmasi Jawaban"** → klik **"Selanjutnya"**.
5. Di soal terakhir, klik **"Selesai"**.
6. Halaman hasil akan menampilkan skor, review jawaban, dan topik yang perlu diperkuat.

### B. Dark mode

- Klik ikon **bulan/matahari** di pojok kanan atas navbar.
- Preferensi dark mode akan tersimpan otomatis di `localStorage`.

### C. Statistik

- Klik menu **Statistik** di bottom navigation.
- Di sana ada:
  - Ringkasan progress
  - Grafik tren akurasi
  - Grafik performa per BAB
  - Riwayat latihan
  - Tombol **Export Data** dan **Import Data**
  - Tombol **Reset Semua Data**

### D. Export / Import data

- **Export**: di halaman Statistik, klik ikon download. File JSON backup akan diunduh.
- **Import**: klik ikon upload, pilih file JSON backup yang sudah di-export sebelumnya.

### E. PWA (Install aplikasi)

Setelah menjalankan `npm run preview` atau deploy:

- Di Chrome / Edge, klik ikon **install** di address bar (biasanya muncul saat akses dari localhost atau HTTPS).
- Atau buka DevTools → tab **Application** → **Manifest** → klik **Install**.
- Setelah terinstall, aplikasi bisa dibuka seperti app native di desktop/HP.

### F. Responsive / mobile testing

Di browser:

- Buka DevTools (`F12` atau `Ctrl+Shift+I`).
- Aktifkan **Device Toolbar** (`Ctrl+Shift+M`).
- Pilih ukuran viewport mobile, misalnya iPhone SE / Pixel 5.

---

## Testing di HP / perangkat lain dalam satu jaringan WiFi

Saat `npm run dev`, Vite bisa diakses dari perangkat lain:

```bash
npm run dev -- --host
```

Lalu buka URL yang mengandung IP lokal kamu, contoh:

```
http://192.168.1.10:5173
```

Pastikan HP dan laptop terhubung ke WiFi yang sama.

---

## Troubleshooting

### Port sudah dipakai

Kalau muncul error `Port 5173 is already in use`, Vite akan otomatis pindah ke port lain. Perhatikan URL yang ditampilkan di terminal.

Atau jalankan dengan port custom:

```bash
npm run dev -- --port 3000
```

### Data aneh / ingin reset

- Buka DevTools → tab **Application** → **Local Storage** → pilih origin localhost.
- Hapus key `artesioneedu-stats` dan `artesioneedu_userId`.
- Refresh halaman.

Atau klik **"Reset Semua Data"** di halaman Statistik.

### Build gagal

1. Pastikan dependencies sudah terinstall: `npm install`
2. Cek error: `npm run lint`
3. Coba hapus folder `node_modules` dan `dist`, lalu install ulang:

```bash
rm -rf node_modules dist
npm install
npm run build
```

### Service Worker tidak muncul

Service worker hanya aktif saat:

- Menggunakan `npm run preview`, atau
- Sudah di-deploy ke HTTPS / localhost.

Di `npm run dev` biasanya SW tidak aktif.

---

## Ringkasan perintah

| Perintah | Fungsi |
|---|---|
| `npm install` | Install dependencies |
| `npm run dev` | Jalankan development server |
| `npm run build` | Build untuk production |
| `npm run preview` | Jalankan production build di lokal |
| `npm run lint` | Cek kualitas kode |

---

Selamat testing! 🚀
