# Kuliah 10 - Supervised dan Unsupervised Learning

**Topik:** Studi Kasus Analisis dan Prediksi Produktivitas Padi  
**Pengampu:** Yeni Herdiyeni, Program Studi Kecerdasan Buatan, Sekolah Sains Data, Matematika dan Informatika, IPB University  
**Tanggal:** 29 April 2026

---

## 1. Tujuan Pembelajaran

Setelah mengikuti materi ini, mahasiswa diharapkan mampu:

1. Menjelaskan motivasi penggunaan machine learning.
2. Membedakan **supervised**, **unsupervised**, dan **reinforcement learning**.
3. Menjelaskan peran **EDA** dalam pipeline machine learning.
4. Melakukan **feature engineering** berdasarkan temuan EDA.
5. Memahami konsep evaluasi model supervised dan unsupervised.
6. Menginterpretasikan hasil model dalam konteks kasus pertanian.

---

## 2. Use Case: Produktivitas Padi

### 2.1 Masalah Utama

Petani dan pengambil kebijakan ingin memahami faktor-faktor yang memengaruhi hasil panen padi. Dengan memahami faktor-faktor tersebut, mereka dapat:

- Merencanakan pemupukan yang lebih tepat.
- Memilih varietas yang sesuai dengan kondisi lahan.
- Mengantisipasi risiko gagal panen.
- Meningkatkan produktivitas secara berkelanjutan.

### 2.2 Data yang Tersedia

| Variabel | Keterangan |
|----------|------------|
| Curah hujan | Jumlah hujan dalam periode tertentu (mm) |
| Suhu | Suhu rata-rata lingkungan ( derajat C) |
| Kelembaban | Kelembaban udara/tanah (%) |
| Jumlah pupuk | Dosis pupuk yang diberikan (kg/ha) |
| Luas lahan | Luas area tanam (ha) |
| Hasil panen | Target: produksi padi (ton/ha) |

### 2.3 Pertanyaan Data Science

> Bagaimana data ini dapat digunakan untuk memprediksi hasil panen dan memahami pola lahan?

---

## 3. Motivasi Machine Learning

### 3.1 Pendekatan Tradisional

Dalam pendekatan tradisional, kita membuat aturan secara manual:

> "Jika curah hujan tinggi dan pupuk cukup, maka hasil panen tinggi."

Namun, dunia nyata jauh lebih kompleks:
- Hubungan antar variabel tidak selalu sederhana.
- Curah hujan terlalu tinggi justru dapat menurunkan hasil panen (banjir/kelebihan air).
- Kombinasi suhu, pupuk, dan kelembaban dapat membentuk pola kompleks dan non-linear.

### 3.2 Motivasi ML

> **Machine learning digunakan ketika pola dalam data sulit dirumuskan secara eksplisit dengan aturan manual.**

ML mampu:
- Menangkap interaksi antar variabel.
- Menemukan pola non-linear.
- Menyesuaikan diri dengan data baru.

---

## 4. Tiga Paradigma Machine Learning

| Paradigma | Data | Contoh dalam Use Case |
|-----------|------|----------------------|
| **Supervised Learning** | Ada input dan target | Prediksi hasil panen berdasarkan cuaca dan pupuk |
| **Unsupervised Learning** | Hanya input, tanpa target | Segmentasi lahan berdasarkan karakteristiknya |
| **Reinforcement Learning** | Belajar dari aksi dan reward | Sistem irigasi otomatis belajar kapan memberi air |

---

## 5. Mengapa Tidak Langsung Modeling?

Kesalahan umum dalam machine learning adalah langsung membuat model tanpa memahami data. Risikonya:

- Model belajar dari data yang salah.
- Outlier dapat merusak hasil prediksi.
- Relasi non-linear tidak tertangkap oleh model sederhana.
- Fitur penting dan tidak penting tidak dibedakan.

> **Pertanyaan kritis:** Sebelum membuat model, apakah kita sudah memahami karakteristik datanya?

---

## 6. Peran EDA dalam Machine Learning

### 6.1 Apa itu EDA?

**Exploratory Data Analysis (EDA)** adalah tahap untuk memahami data sebelum modeling. EDA membantu menjawab pertanyaan seperti:

- Bagaimana distribusi setiap variabel?
- Apakah ada data ekstrem atau outlier?
- Apakah hubungan antar variabel linear atau non-linear?
- Fitur mana yang tampak relevan terhadap target?

> **Ide utama:** EDA bukan sekadar membuat grafik, tetapi proses berpikir untuk menentukan strategi modeling.

### 6.2 EDA 1: Distribusi Curah Hujan

**Pertanyaan:**
- Apakah curah hujan tersebar merata?
- Apakah ada nilai ekstrem?

**Insight:**
- Data dapat bersifat *skewed* (miring).
- Nilai ekstrem perlu diperiksa.

**Keputusan:**
- Lakukan *scaling*.
- Pertimbangkan transformasi fitur (misalnya log transform).

### 6.3 EDA 2: Relasi Curah Hujan dan Hasil Panen

**Pertanyaan:**
- Apakah semakin tinggi hujan selalu meningkatkan panen?

**Insight:**
- Relasi dapat berbentuk non-linear.
- Ada titik optimal curah hujan.

**Keputusan:**
- Tambahkan fitur kuadrat: `rainfall^2`.
- Gunakan model yang mampu menangkap pola non-linear.

### 6.4 EDA 3: Outlier pada Hasil Panen

**Pertanyaan:**
- Apakah hasil panen sangat rendah merupakan error?

**Insight:**
- Hasil panen mendekati nol bisa menjadi kasus gagal panen.
- Outlier tidak selalu salah.

**Keputusan:**
- Jangan langsung menghapus outlier.
- Periksa makna domainnya terlebih dahulu.

### 6.5 EDA 4: Korelasi Antar Variabel

**Pertanyaan:**
- Fitur mana yang berkaitan dengan hasil panen?

**Insight:**
- Beberapa fitur lebih berhubungan dengan target.
- Korelasi membantu indikasi awal, **bukan bukti kausal**.

**Keputusan:**
- Lakukan *feature selection*.
- Hindari memakai fitur yang tidak relevan secara berlebihan.

### 6.6 Dari EDA ke Keputusan Modeling

| Temuan EDA | Keputusan | Dampak ke Model |
|------------|-----------|-----------------|
| Data skewed | Scaling / transformasi | Model lebih stabil |
| Relasi non-linear | Tambah fitur kuadrat | Pola lebih tertangkap |
| Outlier bermakna | Tidak langsung dihapus | Model tetap merekam kasus ekstrem |
| Fitur lemah | Feature selection | Model lebih sederhana |

---

## 7. Feature Engineering

### 7.1 Definisi

**Feature engineering** adalah proses membentuk fitur agar lebih representatif bagi model.

> **Intuisi:** Feature engineering adalah cara memasukkan pemahaman domain ke dalam data.

### 7.2 Contoh pada Use Case Produktivitas Padi

**Fitur kuadrat untuk menangkap relasi non-linear:**

$$
\text{rainfall}^2
$$

**Fitur rasio untuk menggambarkan efisiensi:**

$$
\text{fertilizer per area} = \frac{\text{fertilizer}}{\text{land area}}
$$

**Fitur kategori curah hujan:**

```python
df["rainfall_category"] = pd.cut(
    df["rainfall"],
    bins=[-np.inf, 140, 220, np.inf],
    labels=["rendah", "sedang", "tinggi"]
)
```

---

## 8. Supervised Learning: Prediksi Hasil Panen

### 8.1 Konsep

Dalam supervised learning, data memiliki pasangan input dan target:

$$
(X, y)
$$

Pada use case ini:

$$
X = \{\text{curah hujan}, \text{suhu}, \text{kelembaban}, \text{pupuk}, \text{luas lahan}\}
$$

$$
y = \text{hasil panen}
$$

**Tujuan:** Model belajar fungsi $f(X) \rightarrow y$ untuk memprediksi hasil panen dari data baru.

### 8.2 Contoh Model: Linear Regression

Model sederhana:

$$
\hat{y} = \beta_0 + \beta_1 x_1 + \beta_2 x_2 + \dots + \beta_p x_p
$$

Karena EDA menunjukkan relasi non-linear, kita tambahkan fitur kuadrat:

$$
\hat{y} = \beta_0 + \beta_1 \cdot \text{rainfall} + \beta_2 \cdot \text{rainfall}^2 + \dots
$$

> **Makna penting:** Model tetap linear terhadap parameter, tetapi mampu menangkap pola non-linear melalui transformasi fitur.

### 8.3 Evaluasi Supervised Learning

**Mean Absolute Error (MAE):**

$$
\text{MAE} = \frac{1}{n} \sum_{i=1}^{n} |y_i - \hat{y}_i| 
$$

**Root Mean Squared Error (RMSE):**

$$
\text{RMSE} = \sqrt{\frac{1}{n} \sum_{i=1}^{n} (y_i - \hat{y}_i)^2}
$$

**Koefisien Determinasi ($R^2$):**

$$
R^2 = 1 - \frac{SS_{\text{res}}}{SS_{\text{tot}}}
$$

**Interpretasi:** Semakin kecil MAE/RMSE dan semakin besar $R^2$, semakin baik model menjelaskan data.

### 8.4 Grafik Actual vs Predicted

Cara membaca grafik:
- Jika titik dekat garis diagonal, prediksi baik.
- Jika titik jauh dari garis, error besar.
- Titik ekstrem dapat menunjukkan kasus gagal panen.

---

## 9. Unsupervised Learning: Segmentasi Lahan

### 9.1 Konsep

Dalam unsupervised learning, data tidak memiliki target:

$$
X = \{\text{curah hujan}, \text{pupuk}, \text{suhu}, \text{hasil panen}\}
$$

**Tujuan:**
- Menemukan kelompok lahan/petani yang mirip.
- Memahami pola tersembunyi dalam data.

**Contoh pertanyaan:** Apakah terdapat kelompok lahan dengan kondisi input dan hasil panen yang berbeda?

### 9.2 Contoh Model: K-Means Clustering

K-Means membagi data ke dalam $K$ cluster dengan meminimalkan jarak intra-cluster:

$$
\min \sum_{k=1}^{K} \sum_{x_i \in C_k} \|x_i - \mu_k\|^2
$$

Di mana:
- $C_k$ adalah cluster ke-$k$.
- $\mu_k$ adalah centroid atau pusat cluster ke-$k$.

**Intuisi:** Data yang mirip ditempatkan dalam cluster yang sama. Setiap cluster memiliki pusat yang disebut centroid.

> **Catatan:** Hasil clustering harus diinterpretasikan dengan *domain knowledge*.

### 9.3 Evaluasi Unsupervised: Silhouette Score

Karena tidak ada label benar, evaluasi clustering menggunakan metrik seperti **Silhouette Score**:

$$
s(i) = \frac{b(i) - a(i)}{\max(a(i), b(i))}
$$

Di mana:
- $a(i)$: rata-rata jarak titik $i$ ke titik lain dalam cluster yang sama.
- $b(i)$: rata-rata jarak titik $i$ ke cluster terdekat.

**Interpretasi:** Nilai mendekati 1 menunjukkan cluster lebih terpisah dengan baik.

### 9.4 Elbow Method untuk Memilih Jumlah Cluster

**Ide dasar:** Elbow method digunakan untuk menentukan jumlah cluster optimal $K$.

**Langkah:**
1. Hitung **WCSS** (Within Cluster Sum of Squares):

$$
\text{WCSS} = \sum_{k=1}^{K} \sum_{x_i \in C_k} \|x_i - \mu_k\|^2
$$

2. Ulangi untuk berbagai nilai $K$.
3. Plot $K$ vs WCSS.
4. Pilih titik "siku" (*elbow*) di mana penurunan WCSS mulai melambat.

> **Pesan:** Pemilihan cluster perlu menggabungkan metrik dan interpretasi domain.

### 9.5 Interpretasi Cluster

Pertanyaan interpretatif:
- Cluster mana yang rata-rata hasil panennya tinggi?
- Apakah cluster tertentu memiliki pupuk lebih tinggi?
- Apakah cluster tertentu rentan hasil rendah?

> **Insight:** Clustering bukan akhir analisis, tetapi awal untuk memahami segmentasi data.

---

## 10. Reinforcement Learning dalam Use Case

Walaupun fokus praktikum adalah supervised dan unsupervised, reinforcement learning juga dapat muncul dalam pertanian.

**Contoh: Sistem Irigasi Otomatis**

| Komponen | Peran |
|----------|-------|
| **Agent** | Sistem irigasi |
| **Environment** | Lahan pertanian |
| **Action** | Memberi air atau tidak |
| **Reward** | Peningkatan hasil panen atau efisiensi air |

> **Intuisi:** Reinforcement learning cocok ketika sistem harus belajar mengambil keputusan secara bertahap melalui feedback.

---

## 11. Pipeline Machine Learning End-to-End

1. **Problem Definition**
   - Menentukan masalah dan tujuan analisis.

2. **Data Collection**
   - Mengumpulkan data cuaca, lahan, pupuk, dan hasil panen.

3. **EDA**
   - Memahami pola, outlier, dan relasi.

4. **Feature Engineering**
   - Membentuk fitur baru berdasarkan insight EDA.

5. **Modeling**
   - Supervised atau unsupervised learning.

6. **Evaluation**
   - Mengukur kinerja model.

7. **Deployment**
   - Menggunakan model untuk membantu keputusan.

---

## 12. Deployment: Dari Model ke Keputusan

Model machine learning tidak berhenti pada akurasi. Contoh deployment:

- Dashboard prediksi hasil panen.
- Sistem rekomendasi kebutuhan pupuk.
- Peta segmentasi lahan berdasarkan cluster.
- Peringatan dini risiko gagal panen.

> **Pesan utama:** Nilai utama model adalah ketika hasilnya dapat digunakan untuk mendukung keputusan nyata.

---

## 13. Kode Program

### 13.1 Generate Data Sintetis

```python
import numpy as np
import pandas as pd

np.random.seed(42)
n = 180

rainfall = np.random.normal(180, 45, n)
temperature = np.random.normal(27, 2.2, n)
humidity = np.random.normal(75, 8, n)
fertilizer = np.random.normal(110, 25, n)
land_area = np.random.uniform(0.5, 3.0, n)

# Membentuk target dengan efek non-linear
rain_effect = -0.0009 * (rainfall - 180)**2 + 5.5
fert_effect = 0.025 * fertilizer
temp_effect = -0.08 * (temperature - 27)**2 + 1.2

yield_ton_ha = rain_effect + fert_effect + temp_effect
```

### 13.2 Feature Engineering

```python
df["rainfall_squared"] = df["rainfall"] ** 2

df["fertilizer_per_area"] = df["fertilizer"] / df["land_area"]

df["rainfall_category"] = pd.cut(
    df["rainfall"],
    bins=[-np.inf, 140, 220, np.inf],
    labels=["rendah", "sedang", "tinggi"]
)
```

### 13.3 Supervised Learning

```python
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error

features = [
    "rainfall",
    "rainfall_squared",
    "temperature",
    "humidity",
    "fertilizer",
    "land_area"
]

X = df[features]
y = df["yield_ton_ha"]

model = LinearRegression()
model.fit(X, y)

y_pred = model.predict(X)
```

### 13.4 Unsupervised Learning

```python
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import silhouette_score

X_cluster = df[["rainfall", "fertilizer", "temperature", "yield_ton_ha"]]

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X_cluster)

kmeans = KMeans(n_clusters=3, random_state=42)
labels = kmeans.fit_predict(X_scaled)

score = silhouette_score(X_scaled, labels)
```

---

## 14. Ringkasan: Satu Use Case, Banyak Pendekatan

| Tujuan | Pendekatan | Output |
|--------|-----------|--------|
| Prediksi hasil panen | Supervised Learning | Nilai hasil panen |
| Segmentasi lahan | Unsupervised Learning | Kelompok lahan |
| Optimasi irigasi | Reinforcement Learning | Kebijakan aksi |

---

## 15. Kesimpulan Utama

1. Machine learning digunakan ketika pola data sulit dibuat dengan aturan manual.
2. EDA adalah fondasi penting sebelum modeling.
3. Feature engineering harus didasarkan pada insight dari data.
4. Supervised learning digunakan untuk prediksi dengan label.
5. Unsupervised learning digunakan untuk menemukan struktur tersembunyi.
6. Evaluasi model harus disesuaikan dengan jenis masalah.

> **Pesan akhir:** Model yang baik bukan hanya akurat, tetapi juga dapat dijelaskan dan berguna untuk pengambilan keputusan.
