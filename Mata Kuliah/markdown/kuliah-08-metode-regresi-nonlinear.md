# Kuliah 08 - Metode Regresi Nonlinear

**Topik:** Regresi Polynomial, Fungsi Tangga (Step Function), dan Basis Function  
**Pengampu:** Yeni Herdiyeni, Program Studi Kecerdasan Buatan, IPB University  
**Tanggal:** 16 April 2026

---

## 1. Pendahuluan: Filosofi Regresi Nonlinear

Dalam regresi linear sederhana, hubungan antara variabel independen $x$ dan variabel dependen $y$ diasumsikan berbentuk garis lurus:

$$
\hat{y} = \beta_0 + \beta_1 x
$$

Namun, banyak fenomena nyata - mulai dari pertanian, kesehatan, hingga industri - memiliki hubungan yang **tidak linear**. Misalnya, penambahan pupuk mungkin meningkatkan hasil panen pada awalnya, tetapi setelah titik optimal tertentu, penambahan lebih lanjut justru dapat menurunkan produksi karena keracunan nutrisi atau salinitas tanah.

**Inti dari regresi nonlinear** yang dibahas dalam kuliah ini bukanlah membuat model yang sulit diestimasi secara matematis. Sebaliknya, pendekatannya adalah:

> **Membuat model tetap linear pada parameter, tetapi lebih fleksibel terhadap bentuk hubungan $x \rightarrow y$.**

Dengan kata lain, kita mengubah $x$ menjadi sekumpulan fitur baru $h_1(x), h_2(x), \dots, h_M(x)$, lalu melakukan regresi linear pada fitur-fitur hasil transformasi tersebut.

### Bentuk Umum Basis Function Regression

$$
\hat{y}(x) = \beta_0 + \sum_{m=1}^{M} \beta_m h_m(x)
$$

Di mana:
- $\beta_0$ adalah intercept,
- $\beta_m$ adalah koefisien untuk basis ke-$m$,
- $h_m(x)$ adalah fungsi basis ke-$m$ yang mengubah bentuk representasi $x$.

Model ini tetap linear terhadap parameter $\beta$, sehingga estimasi dengan **Ordinary Least Squares (OLS)** masih dapat digunakan. Yang berubah adalah bahasa representasi dari $x$.

### Tiga Keluarga Penting

| No |  Metode | Fungsi Basis |  Karakteristik |
| ----|--------| --------------|---------------| 
| 1 |  **Polynomial Regression** | $h_m(x) = x^m$ | Global, halus, mudah diinterpretasi | 
| 2 |  **Step Function Regression** | $h_m(x) = \mathbb{I}(x \in A_m)$ | Lokal per interval, diskrit, mudah dibaca | 
| 3 |  **Basis Function Regression** | Spline, RBF, Fourier, dll. |  Lokal/fleksibel, kuat untuk pola kompleks |

> **Filosofi utama:** Hubungan data dapat dibuat fleksibel dengan memilih bahasa representasi yang tepat untuk $x$: global, lokal, halus, atau bertingkat.

---

## 2. Regresi Polynomial

### 2.1 Konsep dan Model Matematis

Regresi polynomial memperluas regresi linear dengan menambahkan pangkat-pangkat dari $x$:

$$
\hat{y}(x) = \beta_0 + \beta_1 x + \beta_2 x^2 + \beta_3 x^3 + \dots + \beta_d x^d
$$

Di mana $d$ adalah derajat (degree) polynomial. Setiap pangkat $x^m$ memberikan kemampuan tambahan bagi kurva untuk "membengkok".

**Filosofi polynomial:** satu kurva global mencoba menjelaskan seluruh domain input.

### 2.2 Transformasi Fitur

Setiap data $x$ diubah menjadi vektor fitur baru:

$$
x \rightarrow (x, x^2, x^3, x^4, x^5)
$$

Dalam bentuk matriks desain:

$$
X_{\text{poly}} =
\begin{bmatrix}
x_1 & x_1^2 & x_1^3 & x_1^4 & x_1^5 \\
x_2 & x_2^2 & x_2^3 & x_2^4 & x_2^5 \\
\vdots & \vdots & \vdots & \vdots & \vdots \\
x_n & x_n^2 & x_n^3 & x_n^4 & x_n^5
\end{bmatrix}
$$

Kita menciptakan ruang fitur baru yang lebih kaya, tetapi estimasi parameter tetap menggunakan least squares.

### 2.3 Estimasi Parameter

$$
\min_{\beta} \sum_{i=1}^{n} (y_i - \hat{y}(x_i))^2
$$

Model tetap linear terhadap parameter, sehingga solusi closed-form OLS masih berlaku:

$$
\hat{\beta} = (X_{\text{poly}}^T X_{\text{poly}})^{-1} X_{\text{poly}}^T y
$$

### 2.4 Use Case: Pertanian - Prediksi Hasil Panen

Regresi polynomial cocok untuk memprediksi hasil panen berdasarkan dosis pupuk, intensitas penyiraman, atau umur tanaman. Hubungannya sering tidak linear:

- Pada awalnya, penambahan pupuk meningkatkan hasil.
- Setelah titik tertentu, peningkatannya melambat.
- Jika berlebihan, hasil bisa menurun.

Interpretasi:
- **Orde rendah**: kurva sederhana, lebih stabil.
- **Orde lebih tinggi**: lebih fleksibel.
- **Terlalu tinggi**: risiko overfitting, terutama di tepi domain.

### 2.5 Implementasi Python

```python
import numpy as np
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import PolynomialFeatures
from sklearn.linear_model import LinearRegression

# x perlu diubah menjadi matriks kolom
x = x.reshape(-1, 1)

model = make_pipeline(
    PolynomialFeatures(degree=5, include_bias=False),
    LinearRegression()
)

model.fit(x, y)
y_pred = model.predict(xx.reshape(-1, 1))
```

> **Parameter kunci:** `degree` mengontrol fleksibilitas. Degree kecil menghasilkan bias tinggi (underfitting), sedangkan degree besar menghasilkan varians tinggi dan rawan overfitting.

### 2.6 Kelebihan dan Kelemahan

**Kelebihan:**
- Sederhana dan mudah dijelaskan.
- Cocok untuk pola halus dan global.
- Ekstensi alami dari regresi linear.

**Kelemahan:**
- Mudah tidak stabil di tepi domain (efek Runge).
- Sensitif terhadap derajat yang terlalu tinggi.
- Satu fungsi global sulit menangkap pola lokal yang kompleks.

---

## 3. Regresi Fungsi Tangga (Step Function)

### 3.1 Konsep dan Model Matematis

Step function membagi domain $x$ menjadi beberapa interval diskrit, dan setiap interval memiliki level prediksi yang relatif konstan:

$$
\hat{y}(x) = \beta_0 + \sum_{m=1}^{M} \beta_m \mathbb{I}(c_{m-1} \leq x < c_m)
$$

Di mana:
- $c_0 < c_1 < \dots < c_M$ adalah titik potong (cut points) atau batas interval.
- $\mathbb{I}(\cdot)$ adalah fungsi indikator yang bernilai 1 jika kondisi benar, dan 0 jika salah.

**Filosofi step function:** data dibagi menjadi beberapa interval, dan setiap interval memiliki level rata-rata sendiri.

### 3.2 Use Case: Medis - Risiko Komplikasi Pasien

Dalam praktik klinis, dokter sering menggunakan kategori ambang, misalnya kadar gula darah:

| Kategori |  Rentang | Interpretasi | 
|----------| ---------|--------------| 
| Normal |  $x < 100$ | Risiko rendah | 
| Borderline |  $100 \leq x < 126$ | Risiko sedang | 
| Tinggi |  $x \geq 126$ | Risiko tinggi | 

Model:

$$
\hat{y} = \beta_0 + \beta_1 \mathbb{I}(x \in A_1) + \beta_2 \mathbb{I}(x \in A_2) + \beta_3 \mathbb{I}(x \in A_3)
$$

Makna:
- Dalam satu interval, prediksi relatif konstan.
- Saat melewati ambang, prediksi berubah meloncat.
- Sangat mudah dijelaskan ke pengguna non-teknis.

### 3.3 Transformasi Fitur: Binning dan One-Hot Encoding

Misalkan $x \in [0, 1]$ dibagi menjadi 8 interval:

$$
A_1 = [0, 0.125), \quad A_2 = [0.125, 0.25), \quad \dots, \quad A_8 = [0.875, 1]
$$

Setiap nilai $x$ diubah menjadi vektor indikator:

$$
x \rightarrow (\mathbb{I}(x \in A_1), \mathbb{I}(x \in A_2), \dots, \mathbb{I}(x \in A_8))
$$

Contoh: jika $x \in A_3$, maka representasinya adalah $(0, 0, 1, 0, 0, 0, 0, 0)$.

### 3.4 Implementasi Python

```python
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import KBinsDiscretizer
from sklearn.linear_model import LinearRegression

x = x.reshape(-1, 1)

model = make_pipeline(
    KBinsDiscretizer(n_bins=8, encode="onehot-dense", strategy="uniform"),
    LinearRegression()
)

model.fit(x, y)
y_pred = model.predict(xx.reshape(-1, 1))
```

> **Parameter kunci:** `n_bins` menentukan resolusi model. Bin sedikit menghasilkan model terlalu kasar (high bias), sedangkan bin terlalu banyak membuat model sensitif terhadap noise (high variance).

### 3.5 Kelebihan dan Kelemahan

**Kelebihan:**
- Sangat mudah diinterpretasikan.
- Cocok untuk sistem berbasis ambang atau cut-off.
- Representasi diskrit sesuai dengan keputusan klinis atau kebijakan.

**Kelemahan:**
- Batas antar-bin tidak halus.
- Hasil bergantung pada jumlah dan posisi titik potong.
- Kurang fleksibel untuk pola yang berubah secara gradual.

---

## 4. Regresi Basis Function

### 4.1 Konsep Umum

Regresi basis function adalah kerangka umum yang mencakup polynomial dan step function sebagai kasus khusus. Bentuk umumnya:

$$
\hat{y}(x) = \beta_0 + \sum_{m=1}^{M} \beta_m h_m(x)
$$

Kita dapat memilih basis $h_m(x)$ sesuai dengan geometri dan karakteristik masalah:

| Jenis Basis |  Karakteristik | Cocok untuk | 
|-------------| ---------------|-------------| 
| **Polynomial** |  Global, halus | Pola mulus di seluruh domain | 
| **Step/Indikator** |  Lokal per interval | Sistem berbasis ambang | 
| **Spline** |  Halus dan lokal | Pola kompleks dengan kehalusan | 
| **Gaussian RBF** |  Lokal di sekitar pusat | Pola non-seragam, multi-modal | 
| **Fourier** |  Periodik | Data dengan pola musiman/siklis | 

**Filosofi basis function:** kita merancang basis sesuai geometri masalah. Basis lokal memberikan fleksibilitas tinggi tanpa harus menggoyang seluruh kurva.

### 4.2 Use Case: Industri - Prediksi Kualitas Produk

Dalam sistem industri, pola sering kompleks dan lokal:
- Pada rentang suhu tertentu, kualitas stabil.
- Pada area lain, terjadi penurunan tajam.
- Beberapa efek hanya muncul di wilayah tertentu.

Basis function cocok ketika pola data tidak cukup dijelaskan oleh satu kurva global sederhana.

### 4.3 Radial Basis Function (RBF) Gaussian

Salah satu basis lokal yang populer adalah Gaussian RBF:

$$
h_j(x) = \exp\left(-\gamma (x - c_j)^2\right)
$$

Di mana:
- $c_j$ adalah center atau titik referensi ke-$j$.
- $\gamma$ mengontrol lebar fungsi Gaussian.

Setiap basis berbentuk lonceng (bell curve):
- Nilai tinggi dekat center.
- Nilai mengecil saat menjauh dari center.
- $\gamma$ besar $\Rightarrow$ kurva sempit dan sangat lokal.
- $\gamma$ kecil $\Rightarrow$ kurva lebar dan lebih global.

### 4.4 Implementasi Python: RBF Custom Transformer

```python
import numpy as np
from sklearn.pipeline import make_pipeline
from sklearn.linear_model import LinearRegression

class RBFFeatures:
    def __init__(self, centers, gamma=90):
        self.centers = np.asarray(centers)
        self.gamma = gamma

    def fit(self, X, y=None):
        return self

    def transform(self, X):
        X = np.asarray(X).reshape(-1, 1)
        return np.exp(-self.gamma * (X - self.centers) ** 2)


# Membuat 12 pusat basis di selang [0, 1]
centers = np.linspace(0, 1, 12).reshape(1, -1)

model = make_pipeline(
    RBFFeatures(centers=centers, gamma=90),
    LinearRegression()
)

model.fit(x, y)
y_pred = model.predict(xx.reshape(-1, 1))
```

### 4.5 Representasi Matriks Fitur RBF

$$
\Phi =
\begin{bmatrix}
h_1(x_1) & h_2(x_1) & \dots & h_M(x_1) \\
h_1(x_2) & h_2(x_2) & \dots & h_M(x_2) \\
\vdots & \vdots & \ddots & \vdots \\
h_1(x_n) & h_2(x_n) & \dots & h_M(x_n)
\end{bmatrix}
$$

Setiap kolom adalah satu Gaussian basis, dan setiap baris adalah representasi satu data dalam ruang basis.

### 4.6 Model Matematis RBF Regression

$$
\hat{y}(x) = \beta_0 + \sum_{j=1}^{M} \beta_j \exp\left(-\gamma (x - c_j)^2\right)
$$

Estimasi parameter tetap menggunakan least squares:

$$
\min_{\beta} \sum_{i=1}^{n} (y_i - \hat{y}(x_i))^2
$$

Model ini **linear terhadap parameter** tetapi **nonlinear terhadap variabel $x$**.

---

## 5. Perspektif Umum: Nonlinear sebagai Linear di Ruang Fitur Baru

Semua metode yang dibahas memiliki satu kesamaan mendasar:

> **Nonlinear regression ini sebenarnya adalah linear regression di ruang fitur baru.**

Perbedaannya terletak pada bagaimana kita merepresentasikan $x$:

| Metode |  Cara Berpikir | Representasi | 
|--------| ---------------|--------------| 
| **Polynomial** |  Berpikir global | Satu cerita besar untuk semua data | 
| **Step Function** |  Berpikir diskrit | Memecah dunia menjadi kategori | 
| **RBF/Basis Function** |  Berpikir lokal | Banyak sudut pandang lokal yang saling overlap | 

### Pesan Penting

Bukan modelnya yang berbeda, tetapi **cara kita merepresentasikan dan memahami data**.

---

## 6. Kapan Menggunakan Metode yang Mana?

| Polynomial |  Step Function | Basis Function (RBF/Spline) | 
|------------| ---------------|------------------------------| 
| Pola halus global |  Ingin segmentasi kasar | Pola kompleks dan lokal | 
| Domain sempit |  Perlu interpretasi interval | Ingin fleksibilitas terkontrol | 
| Ingin model sederhana |  Hubungan tidak perlu halus | Siap melakukan tuning basis | 
| Efek berubah secara gradual |  Sistem berbasis ambang | Data memiliki pola multi-modal | 

---

## 7. Penutup Filosofis

Regresi nonlinear bukan sekadar menggambar kurva bengkok. Intinya adalah **mewakili realitas dengan basis yang sesuai**, lalu mengestimasi bobotnya secara sistematis.

Dengan memahami polynomial, step function, dan basis function, kita memiliki kerangka berpikir untuk memilih representasi data yang paling tepat sesuai konteks domain.

---

## 8. Ringkasan

1. **Regresi polynomial** menggunakan pangkat $x$ untuk membuat kurva global yang halus.
2. **Regresi fungsi tangga** membagi $x$ menjadi interval diskrit dengan prediksi konstan per interval.
3. **Regresi basis function** menggunakan basis umum seperti RBF, spline, atau Fourier untuk fleksibilitas lebih tinggi.
4. Semua metode tetap linear terhadap parameter, sehingga dapat diestimasi dengan OLS.
5. Pemilihan metode bergantung pada karakteristik pola data: global, diskrit, atau lokal.
6. Fleksibilitas harus diimbangi dengan waspada terhadap overfitting.
