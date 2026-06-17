# Kuliah 09 - Pengenalan Machine Learning

**Topik:** Konsep Dasar, Tahapan, Evaluasi, dan Use Case  
**Pengampu:** Yeni Herdiyeni, Program Studi Kecerdasan Buatan, SSMI-IPB University  
**Tanggal:** 22 April 2026

> **Catatan:** File asli berjudul `kuliah-09_pengenalan_machine_learning_slides.pdf`, namun di dalam slide tertulis "Kuliah 10". Dokumen ini mengikuti konteks materi pengenalan machine learning.

---

## 1. Capaian Pembelajaran

Setelah mempelajari materi ini, mahasiswa diharapkan mampu:

1. Menjelaskan konsep *learning* dalam machine learning.
2. Memahami tahapan utama dalam *workflow* machine learning.
3. Menjelaskan mengapa model perlu dievaluasi.
4. Membedakan **underfitting**, **overfitting**, dan model yang seimbang.
5. Memahami use case regresi sebagai contoh penerapan machine learning.

---

## 2. Hubungan AI, Machine Learning, dan Data Science

Tiga bidang ini sering tumpang tindih, tetapi memiliki cakupan yang berbeda:

### Artificial Intelligence (AI)
- Bidang luas yang membangun sistem mampu meniru kecerdasan manusia.
- Contoh: *reasoning*, *planning*, *problem solving*, *perception*.

### Machine Learning (ML)
- Subset dari AI yang berfokus pada sistem yang **belajar dari data**.
- Tidak diprogram secara eksplisit, tetapi menemukan pola dari data.
- Contoh: klasifikasi email spam, prediksi harga rumah, deteksi penyakit.

### Data Science
- Bidang yang berfokus pada pengolahan data untuk menghasilkan *insight*.
- Mencakup: pengumpulan data, pembersihan, analisis, dan visualisasi.
- Machine learning adalah salah satu *tools* dalam data science.

### Tingkatan Data Analytics

| Tingkat | Pertanyaan Kunci | Contoh |
|---------|------------------|--------|
| **Descriptive** | Apa yang terjadi? | Produksi susu rata-rata 20 liter/hari |
| **Diagnostic** | Mengapa ini terjadi? | Mengapa hasil panen menurun? |
| **Predictive** | Apa yang akan terjadi? | Prediksi hasil panen musim depan |
| **Prescriptive** | Apa yang sebaiknya dilakukan? | Waktu tanam optimal |

---

## 3. Mengapa Kita Perlu Machine Learning?

### Use Case: Prediksi Produksi Tanaman

**Input:**
- Curah hujan
- Suhu
- Kelembaban tanah
- Jenis tanah
- Pupuk

**Output:** Hasil panen (ton/ha)

#### Pendekatan Tradisional
- Sulit membuat aturan pasti karena banyak faktor saling berinteraksi.
- Bersifat subjektif dan tidak konsisten antar pengamat.

#### Pendekatan Machine Learning
- Belajar dari data historis.
- Menangkap pola kompleks dan non-linear.
- Prediksi lebih akurat dan dapat diskalakan.

### Definisi Machine Learning

> **Machine learning adalah pendekatan dalam kecerdasan buatan yang memungkinkan sistem belajar dari data untuk menemukan pola dan menghasilkan prediksi atau keputusan.**

Ide utama:
- Kita tidak menulis semua aturan secara eksplisit.
- Sistem belajar hubungan antara input dan output dari contoh data.
- Hasil belajar direpresentasikan dalam bentuk **model**.

---

## 4. Konsep Learning dalam Machine Learning

### Learning = Data + Model + Penyesuaian Parameter

**Komponen utama:**
- **Input $X$:** fitur yang diamati.
- **Target $y$:** nilai sebenarnya.
- **Model $f$:** pemetaan $X \rightarrow y$.
- **Loss/Error:** ukuran kesalahan prediksi.

$$
\hat{y} = f(X)
$$

**Proses learning:**
1. Model menerima data training.
2. Menghasilkan prediksi $\hat{y}$.
3. Membandingkan prediksi dengan nilai sebenarnya $y$.
4. Menghitung error.
5. Menyesuaikan parameter model untuk meminimalkan error.

$$
\text{Error} = y - \hat{y}
$$

### Perbandingan: Pemrograman Tradisional vs Machine Learning

| Aspek |  Pemrograman Tradisional | Machine Learning | 
|-------| -------------------------|------------------| 
| Input |  Data + aturan eksplisit | Data + contoh output | 
| Proses |  Programmer menulis aturan | Sistem belajar pola sendiri | 
| Output |  Hasil dari aturan | Prediksi/keputusan dari model | 
| Cocok untuk |  Aturan yang jelas dan stabil | Aturan yang sulit ditulis manual | 

Contoh cocok untuk ML: prediksi harga rumah, deteksi penyakit, prediksi hasil panen, prediksi curah hujan.

---

## 5. Jenis-Jenis Learning

### 5.1 Supervised Learning (Pembelajaran Terbimbing)

**Konsep:** Belajar dari data yang memiliki label/target.

$$
(X, y) \rightarrow \text{Model} \rightarrow \hat{y}
$$

**Tujuan:** Melakukan prediksi terhadap data baru.

**Contoh:**
- Prediksi harga rumah.
- Klasifikasi email spam.
- Prediksi hasil panen.

### 5.2 Unsupervised Learning (Pembelajaran Tak Terbimbing)

**Konsep:** Belajar dari data tanpa label untuk menemukan pola tersembunyi.

$$
X \rightarrow \text{Model} \rightarrow \text{Pola / Cluster}
$$

**Tujuan:** Mengelompokkan atau menyederhanakan data.

**Contoh:**
- Segmentasi pelanggan.
- Pengelompokan wilayah pertanian.
- *Dimensionality reduction*.

### 5.3 Reinforcement Learning (Pembelajaran Penguatan)

**Konsep:** Belajar melalui interaksi dengan lingkungan, menggunakan aksi dan *reward*.

**Komponen:**
- **Agent:** pengambil keputusan.
- **Environment:** lingkungan tempat agent berinteraksi.
- **Reward:** umpan balik dari setiap aksi.

**Contoh:**
- Robot navigasi.
- Sistem rekomendasi adaptif.
- Game playing (AlphaGo, DQN).

---

## 6. Use Case Machine Learning dalam Kehidupan Nyata

| Domain |  Aplikasi |
| --------|----------| 
| **Pendidikan** |  Prediksi mahasiswa berisiko terlambat lulus |
|  **Kesehatan** | Prediksi kemungkinan penyakit dari hasil pemeriksaan | 
| **Pertanian** |  Prediksi hasil panen berdasarkan cuaca dan pupuk |
|  **Kelautan** | Prediksi wilayah potensi penangkapan ikan dari data oseanografi | 
| **Bisnis** |  Rekomendasi produk dan prediksi churn pelanggan |

---

## 7. Tahapan Machine Learning

### 7.1 Ringkasan Tahapan

1. **Menentukan masalah dan tujuan**
2. **Mengumpulkan data**
3. **Pra-pemrosesan data**
4. **Membagi data: training, validation, testing**
5. **Melatih model**
6. **Mengevaluasi model**
7. **Memilih model terbaik**
8. **Deployment dan monitoring**

### 7.2 Tahapan 1: Problem Formulation dan Data Preparation

**Problem formulation:**
- Apa yang ingin diprediksi?
- Apakah masalahnya regresi atau klasifikasi?
- Apa metrik keberhasilannya?

**Data preparation:**
- Membersihkan *missing values* dan *noise*.
- Memilih fitur yang relevan (*feature selection*).
- Melakukan encoding/normalisasi jika diperlukan.

### 7.3 Tahapan 2: Training, Validation, dan Testing

|  Subset | Fungsi |  Proporsi Umum |
| --------|--------| ---------------|
|  **Training set** | Melatih model dan menyesuaikan parameter |  60-80% |
|  **Validation set** | Memilih model atau hyperparameter terbaik |  10-20% |
|  **Test set** | Menilai performa akhir pada data baru |  10-20% |

> **Intuisi:** training untuk belajar, validation untuk memilih, testing untuk menguji secara final.

### 7.4 Tahapan 3: Deployment dan Monitoring

**Deployment** berarti model digunakan pada lingkungan nyata.

Contoh deployment:
- Sistem prediksi harga komoditas di dashboard.
- Model prediksi risiko pasien di rumah sakit.
- Sistem rekomendasi lokasi tanam untuk petani.

**Monitoring diperlukan karena:**
- Data baru bisa berubah pola (*concept drift*).
- Performa model bisa menurun seiring waktu.
- Model perlu diperbarui secara berkala.

---

## 8. Mengapa Model Harus Dievaluasi?

Model yang terlihat bagus pada data training belum tentu bagus pada data baru. Evaluasi model bertujuan untuk:

1. Mengukur kualitas prediksi.
2. Membandingkan beberapa model.
3. Mendeteksi underfitting atau overfitting.
4. Memastikan model layak digunakan.

### 8.1 Evaluasi pada Regresi

|  Metrik | Rumus |  Interpretasi |
| --------|-------| --------------|
|  **MAE** | $\frac{1}{n} \sum_{i=1}^{n} \lvert y_i - \hat{y}_i \rvert$ | Rata-rata kesalahan absolut | 
| **MSE** |  $\frac{1}{n} \sum_{i=1}^{n} (y_i - \hat{y}_i)^2$ | Rata-rata kesalahan kuadrat, memberi penalti lebih besar pada error besar | 
| **RMSE** |  $\sqrt{\frac{1}{n} \sum_{i=1}^{n} (y_i - \hat{y}_i)^2}$ | Error dalam satuan asli target | 
| **$R^2$** | $1 - \frac{SS_{\text{res}}}{SS_{\text{tot}}}$ | Proporsi variansi data yang dijelaskan model | 

**Intuisi umum:**
- Error kecil  menjadi  prediksi lebih baik.
- $R^2$ besar  menjadi  model menjelaskan variasi data lebih baik.

### 8.2 Evaluasi pada Klasifikasi

| Metrik |  Definisi |
| --------|----------| 
| **Akurasi** |  Proporsi prediksi benar secara keseluruhan |
|  **Precision** | Dari yang diprediksi positif, berapa yang benar-benar positif | 
| **Recall** |  Dari yang benar-benar positif, berapa yang berhasil ditemukan |
|  **F1-score** | Rata-rata harmonik precision dan recall | 
| **Confusion Matrix** |  Tabel perbandingan prediksi vs aktual per kelas |

Contoh: pada deteksi penyakit, **recall** sering penting agar kasus positif tidak banyak terlewat.

### 8.3 Use Case Evaluasi di Dunia Nyata

|  Kasus | Metrik yang Cocok | 
|-------| -------------------|
|  Prediksi hasil panen | MAE, RMSE | 
| Deteksi tanaman sakit vs sehat |  Precision, Recall, F1-score |
|  Prediksi wilayah penangkapan ikan | Error prediksi, akurasi klasifikasi, atau metrik spasial | 

---

## 9. Underfitting, Overfitting, dan Model Seimbang

### 9.1 Underfitting

**Ciri-ciri:**
- Model terlalu sederhana.
- Tidak mampu menangkap pola penting.
- Error training dan testing sama-sama tinggi.

**Contoh:** menggunakan model linear sederhana untuk data yang pola hubungannya sangat non-linear.

### 9.2 Overfitting

**Ciri-ciri:**
- Model terlalu kompleks.
- Sangat baik pada training set.
- Buruk pada validation atau test set.

**Penyebab umum:**
- Terlalu banyak parameter.
- Data training terlalu sedikit.
- Model menangkap *noise* sebagai pola.

### 9.3 Balanced Model (Model Seimbang)

**Ciri-ciri:**
- Cukup kompleks untuk menangkap pola utama.
- Tidak terlalu sensitif terhadap noise.
- Performa training dan testing sama-sama baik.

**Tujuan utama ML:** menemukan model yang seimbang antara akurasi dan generalisasi.

### 9.4 Tabel Perbandingan

| Kondisi |  Kompleksitas | Train Error |  Test Error |
| ---------|--------------| -------------|------------| 
| Underfitting |  Rendah | Tinggi |  Tinggi |
|  Balanced | Sedang |  Rendah | Rendah | 
| Overfitting |  Tinggi | Sangat rendah |  Tinggi |

### 9.5 Cara Memilih Model

1. Mulai dari model sederhana.
2. Evaluasi dengan validation set.
3. Bandingkan beberapa model dan parameter.
4. Pilih model terbaik pada data validasi, bukan hanya training.
5. Gunakan test set hanya untuk evaluasi akhir.

---

## 10. Contoh Penerapan: Regresi untuk Prediksi Hasil Panen Padi

### 10.1 Tujuan Regresi

Regresi bertujuan memprediksi nilai numerik atau kontinu.

**Contoh target regresi:**
- Harga rumah
- Suhu udara
- Hasil panen
- Jumlah produksi ikan

### 10.2 Use Case: Prediksi Hasil Panen Padi

Misalkan kita ingin memprediksi hasil panen padi (ton/ha) berdasarkan fitur:
- Curah hujan (mm)
- Suhu rata-rata ( derajat C)
- Kelembaban tanah (%)
- Penggunaan pupuk (kg/ha)

Masalah ini adalah **supervised learning jenis regresi** karena target yang diprediksi berupa nilai kontinu.

### 10.3 Representasi Data

Setiap baris data memiliki:
- **Fitur ($X$):** curah hujan, suhu, kelembaban tanah, pupuk, luas lahan.
- **Target ($y$):** hasil panen (ton/ha).

### 10.4 Pembagian Data

| Subset |  Proporsi | Fungsi | 
|--------| ----------|--------| 
| Training |  60% | Melatih model | 
| Validation |  20% | Memilih model dan hyperparameter | 
| Testing |  20% | Evaluasi performa akhir | 

### 10.5 Model Regresi

Model mencoba memetakan fitur ke hasil panen:

$$
\hat{y} = f(X)
$$

Contoh model linear:

$$
\hat{y} = w_1 \cdot \text{curah hujan} + w_2 \cdot \text{suhu} + w_3 \cdot \text{kelembaban tanah} + w_4 \cdot \text{pupuk}
$$

Model memiliki parameter $w$ yang dipelajari dari data training.

### 10.6 Perhitungan Metrik (Contoh Numerik)

**Data:**
- Aktual: $[6.0, 5.0]$ ton/ha
- Prediksi: $[5.5, 3.0]$

**Error:**
- $e_1 = 6.0 - 5.5 = 0.5$
- $e_2 = 5.0 - 3.0 = 2.0$

**MAE:**

$$
\text{MAE} = \frac{|0.5|  + |2.0| }{2} = 1.25
$$

**MSE:**

$$
\text{MSE} = \frac{0.5^2 + 2.0^2}{2} = \frac{0.25 + 4}{2} = 2.125
$$

**RMSE:**

$$
\text{RMSE} = \sqrt{2.125} \approx 1.46
$$

**MAPE:**

$$
\text{MAPE} = \frac{1}{2} \left( \frac{0.5}{6.0} + \frac{2.0}{5.0} \right) \times 100\% \approx 24.2\%
$$

### 10.7 Interpretasi Metrik dalam Konteks Pertanian

| Metrik |  Nilai | Makna | 
|--------| -------|-------| 
| MAE |  1.25 ton/ha | Rata-rata kesalahan prediksi | 
| RMSE |  1.46 ton/ha | Error dalam satuan asli, lebih mudah dipahami | 
| MAPE |  24.2% | Persentase error, mudah dikomunikasikan ke petani | 
| $R^2$ | - |  Seberapa baik model mengikuti pola data |

### 10.8 Prediksi untuk Data Baru

Setelah model dilatih dan dievaluasi, kita dapat memprediksi hasil panen untuk lahan baru:

**Contoh input baru:**
- Curah hujan = 220 mm
- Suhu = 28 derajat C
- Kelembaban tanah = 68%
- Pupuk = 260 kg/ha

$$
\hat{y} = f(X_{\text{baru}})
$$

**Manfaat:**
- Perencanaan budidaya.
- Estimasi produktivitas lahan.

---

## 11. Alur Berpikir pada Use Case Regresi

1. Tentukan target: hasil panen.
2. Kumpulkan data historis.
3. Bagi data menjadi training, validation, testing.
4. Latih model regresi.
5. Evaluasi error prediksi.
6. Pilih model terbaik.
7. Gunakan model untuk prediksi musim berikutnya.

---

## 12. Ringkasan

1. **Machine learning** adalah proses belajar dari data untuk membangun model.
2. **Workflow ML** mencakup problem formulation, data collection, preprocessing, training, validation, testing, dan deployment.
3. **Evaluasi model** penting untuk memastikan generalisasi, bukan hanya akurasi training.
4. **Pemilihan model** harus mempertimbangkan underfitting, overfitting, dan keseimbangan.
5. **Regresi** adalah contoh supervised learning untuk memprediksi nilai kontinu.
6. Metrik seperti MAE, MSE, RMSE, dan $R^2$ membantu mengukur kualitas model regresi.
7. Machine learning sangat berguna ketika pola data sulit dirumuskan dengan aturan manual.
