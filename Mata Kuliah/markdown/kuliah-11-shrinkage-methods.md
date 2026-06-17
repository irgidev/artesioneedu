# Kuliah 11 - Shrinkage Methods dalam Sains Data

**Topik:** Ridge dan Lasso Regression  
**Mata Kuliah:** Pengantar Sains Data  
**Pengampu:** Yeni Herdiyeni, Program Studi Sarjana Kecerdasan Buatan, IPB University

---

## 1. Alur Pembahasan

Materi ini dibahas secara bertahap melalui lima langkah utama:

1. Memahami use case prediksi hasil panen padi.
2. Mengenal **OLS** sebagai model dasar regresi linear.
3. Melihat permasalahan OLS pada data dengan fitur yang saling berkorelasi.
4. Memahami bagaimana **Ridge** mengatasi masalah tersebut dengan menyusutkan semua koefisien.
5. Memahami bagaimana **Lasso** menyusutkan koefisien sekaligus melakukan seleksi fitur.

---

## 2. Use Case: Prediksi Hasil Panen Padi

### 2.1 Kasus

Kita ingin memprediksi hasil panen padi berdasarkan sejumlah variabel lingkungan dan budidaya.

**Contoh fitur yang digunakan:**

| Fitur | Keterangan |
|-------|------------|
| `rainfall` | Curah hujan |
| `humidity` | Kelembapan udara |
| `temperature` | Temperatur |
| `soil_moisture` | Kelembapan tanah |
| `irrigation` | Irigasi |
| `fertilizer_A` | Pupuk A |
| `fertilizer_B` | Pupuk B |
| `sunlight` | Cahaya matahari |
| `soil_ph` | pH tanah |
| `pest_index` | Indeks hama |

### 2.2 Tujuan

Membangun model yang dapat memperkirakan hasil panen berdasarkan kombinasi seluruh variabel tersebut.

### 2.3 Mengapa Kasus Ini Menarik?

Faktor-faktor yang memengaruhi hasil panen biasanya tidak berdiri sendiri. Banyak variabel bergerak bersama dan saling berhubungan:

- Saat curah hujan meningkat, kelembapan tanah sering ikut meningkat.
- Temperatur dapat berhubungan dengan kelembapan udara.
- Pupuk A dan pupuk B dapat memiliki pola penggunaan yang mirip.

**Akibatnya:** Model menjadi lebih sulit membedakan mana pengaruh murni dari tiap variabel. Di sinilah persoalan **multikolinearitas** mulai muncul.

---

## 3. Apa Itu OLS?

### 3.1 Ordinary Least Squares (OLS)

OLS adalah metode regresi linear yang mencari model terbaik dengan cara meminimalkan jumlah kuadrat error antara nilai aktual dan nilai prediksi:

$$
\min_{\beta} \sum_{i=1}^{n} (y_i - \hat{y}_i)^2
$$

Di mana:
- $y_i$: hasil panen aktual.
- $\hat{y}_i$: hasil panen yang diprediksi model.

### 3.2 Model OLS pada Use Case

$$
\text{yield} = \beta_0 + \beta_1(\text{rainfall}) + \beta_2(\text{temperature}) + \dots + \beta_p(\text{pest index})
$$

Koefisien $\beta_j$ menunjukkan seberapa besar kontribusi masing-masing fitur terhadap hasil panen.

### 3.3 Cara Membaca OLS

- OLS mencoba menarik satu hubungan linear terbaik dari data.
- Jika koefisien suatu fitur **positif**, kenaikan fitur tersebut cenderung meningkatkan prediksi hasil panen.
- Jika koefisien **negatif**, kenaikan fitur tersebut cenderung menurunkan prediksi hasil panen.

### 3.4 Kekuatan OLS

- **Sederhana** dan mudah dijelaskan.
- **Cepat** dihitung.
- Cocok sebagai **model awal atau baseline**.

---

## 4. Permasalahan OLS: Multikolinearitas

### 4.1 Apa itu Multikolinearitas?

**Multikolinearitas** adalah kondisi di mana beberapa prediktor (fitur) saling berhubungan secara linear. Pada data hasil panen, banyak prediktor saling berhubungan.

### 4.2 Dampak Multikolinearitas pada OLS

Koefisien OLS dapat berubah cukup besar ketika data sedikit berubah. Hal ini menunjukkan bahwa model memang bisa *fit* pada data latih, tetapi belum tentu **stabil** untuk interpretasi dan prediksi baru.

**Makna visualisasi:** Setiap box dalam plot koefisien menunjukkan variasi koefisien dari banyak sampel ulang. Semakin lebar variasinya, semakin tidak stabil estimasi koefisien OLS.

### 4.3 Mengapa Perlu Shrinkage?

**Ide utamanya sederhana:**
- OLS hanya fokus mengecilkan error.
- OLS tidak menahan koefisien agar tetap kecil.
- Pada data yang kompleks, model bisa menjadi terlalu "percaya diri."

**Shrinkage hadir untuk:**
1. Tetap meminimalkan error prediksi.
2. Sekaligus menambahkan penalti pada besar koefisien.
3. Membuat model lebih stabil dan lebih baik dalam generalisasi.

---

## 5. Ridge Regression

### 5.1 Gagasan Utama Ridge

Ridge menggunakan OLS sebagai dasar, lalu menambahkan penalti terhadap **kuadrat koefisien**. Dengan demikian, semua koefisien didorong untuk mengecil.

### 5.2 Fungsi Objektif Ridge

$$
\min_{\beta_0, \beta} \sum_{i=1}^{n} \left( y_i - \beta_0 - \sum_{j=1}^{p} x_{ij}\beta_j \right)^2 + \lambda \sum_{j=1}^{p} \beta_j^2
$$

Di mana:
- $\lambda \geq 0$ adalah parameter penalti (regularization strength).
- $\sum_{j=1}^{p} \beta_j^2$ adalah penalti $L2$.

### 5.3 Pengaruh Nilai $\lambda$

| Nilai $\lambda$ | Efek | 
|-----------------| ------|
|  $\lambda = 0$ | Ridge sama seperti OLS | 
| $\lambda$ membesar | Penalti makin kuat | 
| $\lambda$ sangat besar | Semua koefisien mendekati nol, tetapi umumnya tidak tepat nol | 

### 5.4 Intuisi Ridge pada Kasus Hasil Panen

**Mengapa Ridge membantu?**
- Saat beberapa fitur sama-sama relevan, tetapi saling berkorelasi.
- Ridge membagi pengaruh secara lebih hati-hati di antara fitur-fitur tersebut.

> **Pesan sederhana:** Ridge berkata, "Semua fitur boleh tetap masuk, tetapi jangan ada koefisien yang terlalu ekstrem."

### 5.5 Karakteristik Ridge

- Menyusutkan semua koefisien secara bersamaan.
- Tidak melakukan seleksi fitur (koefisien tidak menjadi tepat nol).
- Sangat efektif untuk menangani multikolinearitas.
- Meningkatkan stabilitas prediksi.

---

## 6. Lasso Regression

### 6.1 Gagasan Utama Lasso

Lasso juga berangkat dari OLS, tetapi penalti yang digunakan adalah **jumlah nilai absolut koefisien**. Penalti ini membuat sebagian koefisien dapat menjadi tepat nol.

### 6.2 Fungsi Objektif Lasso

$$
\min_{\beta_0, \beta} \sum_{i=1}^{n} \left( y_i - \beta_0 - \sum_{j=1}^{p} x_{ij}\beta_j \right)^2 + \lambda \sum_{j=1}^{p} \lvert \beta_j \rvert 
$$

Di mana:
- $\lambda \geq 0$ adalah parameter penalti.
- $\sum_{j=1}^{p} \lvert \beta_j \rvert$ adalah penalti $L1$.

### 6.3 Pengaruh Nilai $\lambda$

| Nilai $\lambda$ | Efek | 
|-----------------| ------|
|  $\lambda$ kecil | Hampir sama seperti OLS | 
| $\lambda$ membesar | Beberapa koefisien menyusut kuat sampai nol | 
| $\lambda$ sangat besar | Hanya sedikit fitur yang tersisa | 

### 6.4 Intuisi Lasso pada Kasus Hasil Panen

**Mengapa Lasso menarik?**
- Tidak semua fitur selalu penting.
- Beberapa fitur mungkin hanya memberi kontribusi kecil.
- Lasso membantu memilih fitur yang paling dominan.

> **Pesan sederhana:** Lasso berkata, "Jika suatu fitur tidak cukup penting, lebih baik koefisiennya dibuat nol."

### 6.5 Efek Seleksi Fitur pada Lasso

Semakin besar penalti $\lambda$, semakin banyak fitur yang dieliminasi dari model. Karena itu, Lasso sangat berguna saat kita juga ingin **menyederhanakan model**, bukan hanya meningkatkan kestabilan.

---

## 7. Perbandingan OLS, Ridge, dan Lasso

| Aspek |  OLS | Ridge |  Lasso |
| -------|-----| -------|-------| 
| Fungsi tujuan |  Minimalkan SSE | SSE + $\lambda \sum \beta_j^2$ | SSE + $\lambda \sum \lvert \beta_j \rvert$ |
|  Penalti | Tidak ada |  $L2$ | $L1$ |
|  Koefisien | Tidak dibatasi |  Menyusut, tapi tidak nol | Bisa menjadi tepat nol | 
| Seleksi fitur |  Tidak | Tidak |  Ya |
|  Multikolinearitas | Rentan |  Tangguh | Tangguh | 
| Kompleksitas model |  Penuh | Penuh |  Lebih ringkas |

### Visualisasi Efek Penalti

- **OLS:** koefisien bebas bergerak untuk meminimalkan error.
- **Ridge:** semua koefisien menyusut bertahap ketika $\lambda$ membesar.
- **Lasso:** beberapa koefisien menjadi nol ketika $\lambda$ diperbesar.

---

## 8. Kapan Menggunakan Ridge dan Kapan Lasso?

### Gunakan Ridge Jika...

- Banyak fitur sama-sama penting.
- Terdapat multikolinearitas.
- Fokus utamanya adalah kestabilan dan akurasi prediksi.
- Anda ingin mempertahankan semua fitur dalam model.

### Gunakan Lasso Jika...

- Ingin model yang lebih ringkas.
- Ingin seleksi fitur otomatis.
- Diduga hanya sebagian kecil fitur yang dominan.
- Interpretasi model yang sederhana sangat penting.

### Kombinasi: Elastic Net

Dalam praktik, sering digunakan **Elastic Net** yang menggabungkan penalti $L1$ dan $L2$:

$$
\min_{\beta} \sum_{i=1}^{n} (y_i - \hat{y}_i)^2 + \lambda_1 \sum_{j=1}^{p} \lvert \beta_j \rvert  + \lambda_2 \sum_{j=1}^{p} \beta_j^2
$$

Elastic Net memberikan keuntungan baik Ridge (stabil terhadap multikolinearitas) maupun Lasso (seleksi fitur).

---

## 9. Implementasi Python

### 9.1 Ridge Regression

```python
from sklearn.linear_model import Ridge
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline

# Ridge dengan alpha = lambda
ridge_model = make_pipeline(
    StandardScaler(),
    Ridge(alpha=1.0)
)

ridge_model.fit(X_train, y_train)
y_pred_ridge = ridge_model.predict(X_test)
```

### 9.2 Lasso Regression

```python
from sklearn.linear_model import Lasso
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline

# Lasso dengan alpha = lambda
lasso_model = make_pipeline(
    StandardScaler(),
    Lasso(alpha=0.1)
)

lasso_model.fit(X_train, y_train)
y_pred_lasso = lasso_model.predict(X_test)
```

> **Catatan:** Standardisasi fitur sangat penting sebelum menerapkan Ridge atau Lasso karena penalti sensitif terhadap skala fitur.

---

## 10. Interpretasi Hasil dalam Konteks Pertanian

### 10.1 Ridge: Semua Faktor Dipertimbangkan

Dalam prediksi hasil panen, Ridge cocok ketika kita percaya bahwa banyak variabel lingkungan dan budidaya secara kolektif memengaruhi hasil panen, meskipun beberapa di antaranya saling berkorelasi.

### 10.2 Lasso: Memilih Faktor Kunci

Lasso cocok ketika kita ingin menyederhanakan model dan hanya menyimpan faktor-faktor yang paling berpengaruh. Misalnya, dari 10 fitur, mungkin hanya 4 atau 5 yang benar-benar dominan dalam memprediksi hasil panen.

### 10.3 Kalimat Penutup

> Pada masalah prediksi hasil panen, **Ridge** membantu ketika banyak variabel sama-sama relevan, sedangkan **Lasso** membantu ketika kita juga ingin mengetahui fitur mana yang benar-benar penting.

---

## 11. Ringkasan

1. **OLS** adalah dasar regresi linear yang meminimalkan jumlah kuadrat error.
2. **Multikolinearitas** dapat membuat koefisien OLS tidak stabil.
3. **Ridge Regression** menambahkan penalti $L2$ untuk menyusutkan semua koefisien dan mengatasi multikolinearitas.
4. **Lasso Regression** menambahkan penalti $L1$ untuk menyusutkan koefisien dan melakukan seleksi fitur otomatis.
5. Gunakan **Ridge** jika banyak fitur sama-sama penting dan ada multikolinearitas.
6. Gunakan **Lasso** jika ingin model yang lebih ringkas dan dapat diinterpretasikan.
7. **Standardisasi fitur** wajib dilakukan sebelum menerapkan Ridge atau Lasso.
8. **Elastic Net** menggabungkan keunggulan kedua metode.
