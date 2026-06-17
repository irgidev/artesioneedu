# Kuliah 12 - Data Storytelling & Dashboarding dalam Sains Data

**Topik:** Studi Kasus Peternakan Sapi Perah  
**Pengampu:** Yeni Herdiyeni, Program Studi Kecerdasan Buatan, SSMI IPB  
**Tanggal:** 20 Mei 2026

> **Catatan:** File asli berjudul `kuliah-12-slides_storytelling_dashboard_peternakan.pdf`, namun di dalam slide tertulis "Kuliah 13". Dokumen ini mengikuti konteks materi data storytelling dan dashboarding.

---

## 1. Skenario Use Case: Peternakan Sapi Perah

### 1.1 Situasi

Sebuah peternakan sapi perah memiliki **120 ekor sapi**. Setiap hari, pengelola mencatat:

- Produksi susu
- Konsumsi pakan
- Suhu kandang
- Kelembapan
- Aktivitas sapi
- Status kesehatan

### 1.2 Masalah yang Dihadapi

- Produksi susu kadang turun tanpa sebab yang langsung terlihat.
- Beberapa sapi sakit terlambat terdeteksi.
- Pengelola membutuhkan prioritas pemeriksaan.

### 1.3 Pertanyaan Bisnis/Data

- Kapan produksi susu menurun?
- Faktor apa yang berkaitan dengan penurunan tersebut?
- Sapi mana yang sehat, berisiko, atau sakit?
- Bagaimana hasilnya disajikan dalam dashboard?

### 1.4 Cerita yang Ingin Dibangun

```
Masalah  menjadi  Data  menjadi  EDA  menjadi  Model  menjadi  Evaluasi  menjadi  Insight  menjadi  Dashboard  menjadi  Rekomendasi
```

> **Inti cerita:** Data digunakan untuk memahami penurunan produksi susu, menemukan faktor risiko, membangun model pendukung keputusan, mengevaluasi keandalannya, lalu menyajikannya dalam dashboard yang mudah dipahami.

---

## 2. Capaian Pembelajaran

Setelah mengikuti kuliah ini, mahasiswa mampu:

1. Menjelaskan konsep data storytelling dalam sains data.
2. Menghubungkan EDA dengan penyusunan narasi data.
3. Menjelaskan hasil model klasifikasi dan clustering secara kontekstual.
4. Menginterpretasikan evaluasi model untuk mendukung keputusan.
5. Menyusun dashboard sederhana berbasis cerita.
6. Mempresentasikan insight dan rekomendasi secara runtut.

---

## 3. Apa itu Data Storytelling?

### 3.1 Definisi

> **Data storytelling adalah proses mengubah hasil analisis data menjadi cerita yang runtut, berbasis bukti, dan relevan dengan keputusan.**

### 3.2 Tiga Komponen Utama

| Komponen | Peran | Contoh |
|----------|-------|--------|
| **Data** | Fakta, angka, tabel, hasil EDA, hasil model, metrik evaluasi. | Produksi susu rata-rata, jumlah sapi sakit |
| **Visualisasi** | Grafik yang membantu audiens melihat pola, perbandingan, dan anomali. | Line chart tren produksi, scatter plot, heatmap |
| **Narasi** | Penjelasan yang menghubungkan data dengan konteks dan rekomendasi. | "THI tinggi berkaitan dengan penurunan produksi" |

> **Pesan utama:** Bukan hanya "grafiknya apa", tetapi "maknanya apa".

### 3.3 Perbedaan Visualization, Dashboard, dan Storytelling

| Konsep | Fokus | Pertanyaan Kunci |
|--------|-------|------------------|
| **Data Visualization** | Menampilkan pola dalam data | Apa yang terlihat dari data? |
| **Dashboard** | Memantau indikator penting | Bagaimana kondisi saat ini? |
| **Data Storytelling** | Menjelaskan makna dan tindakan | Apa pesan utama dan keputusan apa yang perlu diambil? |

> **Catatan penting:** Dashboard yang baik bukan sekadar kumpulan grafik. Dashboard harus membantu audiens mengikuti alur cerita dan memahami prioritas tindakan.

---

## 4. Dataset Sintetis Peternakan

### 4.1 Unit Observasi

- **120 ekor sapi perah**.
- Diamati selama **90 hari**.
- Total **10.800 observasi harian**.

### 4.2 Variabel Utama

| Variabel | Keterangan |
|----------|------------|
| `milk_liter` | Produksi susu harian |
| `feed_kg` | Konsumsi pakan |
| `temperature` | Suhu kandang |
| `humidity` | Kelembapan kandang |
| `thi_index` | Temperature-Humidity Index (indeks tekanan panas) |
| `activity_index` | Aktivitas ternak |
| `health_status` | Status kesehatan (Sehat / Berisiko / Sakit) |

### 4.3 Target Storytelling

Menjelaskan hubungan antara kondisi lingkungan, perilaku ternak, produktivitas susu, dan risiko kesehatan sapi.

---

## 5. Membaca Data di Python

```python
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

df = pd.read_csv(
    "dataset_peternakan_sapi_perah_sintetis.csv",
    parse_dates=["date"]
)

df.head()
df.info()
```

**Tujuan awal:** Memastikan struktur data, tipe data, jumlah observasi, dan variabel yang tersedia sebelum membuat visualisasi dan model.

---

## 6. EDA sebagai Awal Cerita

### 6.1 Peran EDA

EDA membantu menemukan bahan cerita: pola, tren, hubungan antar variabel, anomali, dan dugaan awal penyebab masalah.

**Pertanyaan EDA dalam studi kasus ini:**

1. Bagaimana tren produksi susu harian?
2. Apakah sapi dengan pakan lebih tinggi menghasilkan susu lebih banyak?
3. Apakah THI tinggi berkaitan dengan penurunan produksi susu?
4. Apakah status kesehatan ternak tersebar merata atau tidak?

### 6.2 EDA 1: Tren Produksi Susu Harian

**Cara membaca grafik:**
- Garis menunjukkan rata-rata produksi susu harian.
- Penurunan tajam menjadi titik awal investigasi.
- Pola fluktuatif mengindikasikan produksi tidak stabil sepanjang waktu.

**Narasi awal:**

> "Produksi susu mengalami fluktuasi. Kita perlu mencari faktor yang berkaitan dengan periode penurunan."

**Pertanyaan diskusi:**
1. Pada periode mana produksi susu terlihat menurun?
2. Apakah penurunan terjadi tiba-tiba atau bertahap?
3. Variabel apa yang perlu dibandingkan dengan tren produksi susu?
4. Jika Anda pengelola peternakan, keputusan apa yang mungkin diambil dari grafik ini?

### 6.3 EDA 2: Distribusi Status Kesehatan Ternak

**Insight:**
- Sebagian besar observasi berada pada status sehat.
- Namun, kategori berisiko dan sakit tetap muncul dalam jumlah signifikan.
- Kategori berisiko penting untuk deteksi dini.

**Pesan storytelling:**

> Fokus analisis bukan hanya sapi yang sudah sakit, tetapi sapi yang mulai menunjukkan tanda risiko.

### 6.4 EDA 3: Konsumsi Pakan vs Produksi Susu

**Interpretasi:**
- Ada kecenderungan positif antara pakan dan produksi susu.
- Namun, hubungan tidak sempurna.
- Beberapa sapi dengan pakan cukup tinggi tetap menghasilkan susu rendah.

**Makna:** Produksi susu dipengaruhi oleh kombinasi faktor, bukan hanya pakan.

### 6.5 EDA 4: THI dan Produksi Susu

**THI (Temperature-Humidity Index)** menggabungkan suhu dan kelembapan. Nilai tinggi menunjukkan tekanan panas.

**Insight:**
- Ketika THI meningkat, produksi susu cenderung menurun.
- Ini mengindikasikan kemungkinan **heat stress**.

### 6.6 EDA 5: Heatmap Korelasi

**Pola utama:**
- Produksi susu berkorelasi positif dengan pakan dan aktivitas.
- Produksi susu berkorelasi negatif dengan suhu dan THI.
- THI sangat berkaitan dengan suhu dan kelembapan.

**Narasi EDA:**

> Produktivitas sapi perah dipengaruhi oleh faktor nutrisi, aktivitas, dan tekanan lingkungan.

---

## 7. Dari EDA ke Model

### 7.1 Mengapa Perlu Model?

EDA membantu menemukan pola, tetapi model membantu membuat prediksi atau segmentasi yang lebih sistematis.

### 7.2 Dua Pendekatan Model

| Aspek | Klasifikasi | Clustering |
|-------|-------------|------------|
| **Label** | Ada label target | Tidak menggunakan label target |
| **Tujuan** | Memprediksi status kesehatan sapi | Menemukan kelompok profil ternak |
| **Output** | Sehat / Berisiko / Sakit | Cluster sapi dengan karakteristik serupa |

---

## 8. Klasifikasi: Prediksi Status Kesehatan Sapi

### 8.1 Membentuk Data Ringkasan

Prediksi status akhir sapi lebih mudah dilakukan pada level individu sapi, bukan pada level observasi harian.

```python
agg = df.groupby("cow_id").agg(
    avg_thi_index=("thi_index", "mean"),
    avg_feed_kg=("feed_kg", "mean"),
    avg_activity_index=("activity_index", "mean"),
    avg_milk_liter=("milk_liter", "mean"),
    min_milk_liter=("milk_liter", "min"),
    max_thi_index=("thi_index", "max"),
    sick_days=("health_status", lambda x: int((x == "Sakit").sum())),
    risk_days=("health_status", lambda x: int((x == "Berisiko").sum()))
).reset_index()
```

### 8.2 Melatih Model Random Forest

```python
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier

X = agg[features]
y = agg["final_health_status"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.25, random_state=42, stratify=y
)

clf = RandomForestClassifier(
    n_estimators=250,
    random_state=42,
    class_weight="balanced",
    max_depth=6
)

clf.fit(X_train, y_train)
y_pred = clf.predict(X_test)
```

### 8.3 Evaluasi Model Klasifikasi

**Hasil ringkas:** Model memperoleh akurasi sekitar 0.80 dan macro F1-score sekitar 0.758. Namun, angka ini harus dibaca secara kontekstual.

| Metrik | Makna dalam Kasus Peternakan |
|--------|------------------------------|
| **Accuracy** | Seberapa sering model benar secara umum |
| **Precision** | Dari sapi yang diprediksi sakit/berisiko, berapa yang benar |
| **Recall** | Dari semua sapi yang benar-benar sakit/berisiko, berapa yang berhasil ditemukan |
| **F1-score** | Keseimbangan antara precision dan recall |

> **Poin storytelling:** Dalam deteksi dini, **recall** untuk kelas berisiko sangat penting karena salah melewatkan sapi berisiko dapat menyebabkan keterlambatan penanganan.

### 8.4 Confusion Matrix

**Cara membaca:**
- Baris menunjukkan kelas aktual.
- Kolom menunjukkan kelas prediksi.
- Diagonal adalah prediksi benar.
- Sel di luar diagonal adalah kesalahan model.

**Kesalahan kritis:** Sapi sakit atau berisiko yang diprediksi sehat adalah kesalahan yang berbahaya dalam praktik peternakan.

### 8.5 Feature Importance

Faktor yang berpengaruh:
- **Aktivitas ternak** menjadi sinyal penting.
- **Produksi susu minimum** menunjukkan penurunan ekstrem.
- **THI** memperkuat indikasi tekanan panas.
- **Riwayat penyakit** juga relevan.

**Narasi:** Model mengonfirmasi bahwa produktivitas, perilaku, dan lingkungan saling berkaitan.

### 8.6 Pertanyaan Diskusi Evaluasi Model

1. Apakah model lebih baik dalam mengenali sapi sehat, berisiko, atau sakit?
2. Mengapa akurasi saja tidak cukup?
3. Kesalahan model seperti apa yang paling merugikan peternak?
4. Bagaimana cara memperbaiki model agar lebih baik mengenali sapi berisiko?

---

## 9. Clustering: Mengelompokkan Profil Sapi

### 9.1 Tujuan

Clustering digunakan untuk menemukan kelompok sapi dengan karakteristik serupa tanpa menggunakan label status kesehatan.

**Fitur yang digunakan:**
- Rata-rata konsumsi pakan
- Rata-rata aktivitas
- Rata-rata produksi susu
- Rata-rata THI
- Riwayat penyakit
- Bobot tubuh

**Makna storytelling:** Clustering membantu menyusun strategi pengelolaan berbeda untuk kelompok sapi yang berbeda.

### 9.2 Standardisasi dan K-Means

```python
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans

cluster_features = [
    "avg_feed_kg", "avg_activity_index", "avg_milk_liter",
    "avg_thi_index", "previous_disease_count", "body_weight_kg"
]

scaler = StandardScaler()
Z = scaler.fit_transform(agg[cluster_features])

kmeans = KMeans(n_clusters=3, random_state=42, n_init=20)
agg["cluster"] = kmeans.fit_predict(Z)
```

> **Mengapa standardisasi?** Setiap fitur memiliki skala berbeda. Standardisasi mencegah fitur berskala besar mendominasi proses clustering.

### 9.3 Elbow Method

**Cara membaca:**
- Inertia turun ketika jumlah cluster bertambah.
- Titik siku menunjukkan jumlah cluster yang cukup masuk akal.
- Tidak selalu ada satu jawaban mutlak.

**Pesan:** Pemilihan cluster perlu menggabungkan metrik dan interpretasi domain.

### 9.4 Silhouette Score

**Makna:**
- Nilai lebih tinggi menunjukkan cluster lebih jelas.
- Nilai rendah mengindikasikan cluster saling tumpang tindih.
- Tetap perlu interpretasi variabel pembentuk cluster.

> **Catatan:** Cluster yang baik secara matematis belum tentu bermakna secara praktis.

### 9.5 Visualisasi Cluster dengan PCA

PCA membantu menampilkan data berdimensi banyak menjadi 2 dimensi. Warna menunjukkan hasil cluster. Pemisahan visual membantu komunikasi hasil.

**Narasi:** Sapi tidak homogen; ada beberapa profil pengelolaan yang berbeda.

### 9.6 Pertanyaan Diskusi Clustering

1. Apakah cluster terlihat cukup terpisah?
2. Apa makna praktis dari setiap cluster?
3. Apakah cluster otomatis sama dengan kelas sehat, berisiko, dan sakit?
4. Mengapa interpretasi domain tetap diperlukan setelah clustering?

---

## 10. Merumuskan Insight

### 10.1 Insight Bukan Deskripsi Grafik

> **Insight adalah kesimpulan berbasis data yang membantu pengambilan keputusan.**

### 10.2 Insight Utama dari Studi Kasus

1. Produksi susu mengalami fluktuasi dan penurunan pada periode tertentu.
2. Pakan berkaitan positif dengan produksi susu.
3. THI berkaitan negatif dengan produksi susu.
4. Aktivitas, produksi susu minimum, dan THI penting untuk klasifikasi kesehatan.
5. Kelas berisiko perlu diperhatikan sebagai sinyal deteksi dini.
6. Clustering membantu menyusun profil pengelolaan ternak.

---

## 11. Dari Insight ke Rekomendasi

| Insight | Rekomendasi |
|---------|-------------|
| THI tinggi berkaitan dengan penurunan produksi | Pantau zona kandang dengan THI tinggi |
| Aktivitas rendah menjadi sinyal risiko | Prioritaskan pemeriksaan sapi berisiko/sakit |
| Beberapa sapi berulang kali masuk kategori berisiko | Evaluasi pakan untuk sapi produksi rendah |
| Cluster menunjukkan profil ternak berbeda | Terapkan strategi pengelolaan berbeda per cluster |

---

## 12. Dashboard sebagai Media Storytelling

### 12.1 Prinsip

Dashboard harus membantu audiens memahami kondisi, menemukan masalah, mengevaluasi model, dan menentukan tindakan.

### 12.2 Alur Dashboard

```
Overview  menjadi  Explore  menjadi  Explain  menjadi  Evaluate  menjadi  Act
```

| Bagian | Fungsi | Contenido |
|--------|--------|-----------|
| **Overview** | Indikator utama | Jumlah sapi, rata-rata susu, sapi berisiko, performa model |
| **Explore** | Pola EDA | Tren produksi, distribusi status kesehatan, pakan vs susu |
| **Explain** | Hasil model | Feature importance, confusion matrix |
| **Evaluate** | Metrik model | Akurasi, F1-score, silhouette score |
| **Act** | Rekomendasi | Daftar sapi prioritas, rekomendasi pemeriksaan |

### 12.3 Komponen Dashboard Peternakan

**Indikator utama:**
- Jumlah sapi
- Rata-rata produksi susu
- Jumlah sapi berisiko/sakit
- Macro F1-score model

**Visualisasi EDA:**
- Tren produksi susu
- Distribusi status kesehatan
- Pakan vs susu
- THI vs susu

**Visualisasi model:**
- Confusion matrix
- Feature importance
- Elbow method
- Visualisasi cluster PCA

**Aksi:**
- Daftar sapi prioritas
- Rekomendasi pemeriksaan
- Rekomendasi pengelolaan kandang

### 12.4 Struktur Dashboard HTML Sederhana

```html
<h1>Dashboard Data Storytelling: Peternakan Sapi Perah</h1>

<div class="card-container">
    <div class="card">Jumlah Sapi</div>
    <div class="card">Rata-rata Produksi Susu</div>
    <div class="card">Sapi Berisiko/Sakit</div>
    <div class="card">Macro F1 Model</div>
</div>

<div class="grid">
    <img src="figures/01_tren_produksi_susu_harian.png">
    <img src="figures/02_distribusi_status_kesehatan.png">
    <img src="figures/03_scatter_pakan_vs_susu.png">
    <img src="figures/04_thi_vs_susu.png">
</div>
```

### 12.5 Pertanyaan Evaluasi Dashboard

1. Apakah dashboard sudah memiliki alur cerita yang jelas?
2. Grafik mana yang sebaiknya muncul paling awal?
3. Apakah dashboard terlalu teknis untuk peternak?
4. Informasi apa yang perlu ditambahkan agar dashboard lebih operasional?
5. Bagaimana rekomendasi ditampilkan agar mudah dipahami pengguna non-teknis?

---

## 13. Alur Presentasi Data Storytelling

1. **Masalah:** Produktivitas susu dan kesehatan sapi perlu dipantau.
2. **Data:** Jelaskan variabel dan sumber data.
3. **EDA:** Tunjukkan pola utama dari visualisasi.
4. **Model klasifikasi:** Jelaskan prediksi status kesehatan.
5. **Evaluasi:** Jelaskan metrik dan jenis kesalahan model.
6. **Clustering:** Jelaskan profil kelompok sapi.
7. **Dashboard:** Tunjukkan bagaimana semua insight disatukan.
8. **Rekomendasi:** Tutup dengan tindakan yang dapat dilakukan.

### Contoh Narasi Presentasi

> "Peternakan sapi perah perlu menjaga produktivitas susu dan mendeteksi risiko kesehatan lebih awal. Berdasarkan data 120 sapi selama 90 hari, produksi susu terlihat berfluktuasi dan menurun pada beberapa periode.
>
> EDA menunjukkan bahwa konsumsi pakan berkaitan positif dengan produksi susu, sedangkan THI berkaitan negatif dengan produksi susu. Model klasifikasi membantu mengidentifikasi sapi sehat, berisiko, dan sakit. Evaluasi model menunjukkan bahwa kelas berisiko perlu diperhatikan karena penting untuk deteksi dini.
>
> Dashboard kemudian digunakan untuk menyatukan indikator utama, hasil EDA, evaluasi model, dan rekomendasi tindakan sehingga pengelola dapat menentukan sapi dan kandang yang perlu diprioritaskan."

---

## 14. Diskusi

1. Jelaskan cerita utama yang dapat dibangun dari data peternakan sapi perah.
2. Pilih tiga visualisasi paling penting dan jelaskan alasannya.
3. Mengapa THI menjadi variabel penting dalam analisis ini?
4. Interpretasikan confusion matrix model klasifikasi.
5. Mengapa recall untuk kelas berisiko penting dalam deteksi dini?
6. Jelaskan makna praktis dari hasil clustering.
7. Susun tiga rekomendasi untuk pengelola peternakan.

---

## 15. Penutup

### Pesan Utama

Data storytelling membantu mengubah hasil teknis menjadi cerita yang bermakna dan dapat digunakan untuk pengambilan keputusan.

Dalam studi kasus peternakan sapi perah:
- **EDA** menemukan pola awal dan dugaan faktor penyebab.
- **Klasifikasi** membantu memprediksi status kesehatan ternak.
- **Clustering** membantu memahami profil kelompok sapi.
- **Evaluasi model** membantu menilai keandalan hasil.
- **Dashboard** menyatukan insight dan rekomendasi.

> **Tujuan akhir:** Bukan hanya membuat grafik, tetapi membantu orang mengambil keputusan berbasis data.

---

## 16. Ringkasan

1. Data storytelling mengubah data, visualisasi, dan narasi menjadi cerita yang mendukung keputusan.
2. Dashboard yang baik memiliki alur cerita: Overview  menjadi  Explore  menjadi  Explain  menjadi  Evaluate  menjadi  Act.
3. EDA menemukan pola awal dan hipotesis penyebab masalah.
4. Klasifikasi memprediksi status kesehatan sapi; evaluasi harus memperhatikan recall kelas berisiko.
5. Clustering menemukan profil sapi yang berbeda untuk strategi pengelolaan yang berbeda.
6. Insight harus diubah menjadi rekomendasi tindakan yang konkret.
7. Komunikasi hasil analisis sama pentingnya dengan analisis itu sendiri.
