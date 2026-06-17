import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '..', 'src', 'data', 'psd');

const PER_BAB_COUNT = 30;
const UAS_COUNT = 100;

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function getPool(concepts, attr) {
  return concepts.map((c) => c[attr]).filter(Boolean);
}

function getRelatedTerms(concept, allConcepts) {
  let pool = allConcepts
    .filter((c) => c.group === concept.group && c.term !== concept.term)
    .map((c) => c.term);
  if (pool.length < 3) {
    const extra = allConcepts
      .filter((c) => c.group !== concept.group && c.term !== concept.term)
      .map((c) => c.term);
    pool = shuffle([...pool, ...extra]);
  }
  return pool;
}

function getRelatedAttrPool(concept, allConcepts, attr) {
  let pool = allConcepts
    .filter((c) => c.group === concept.group && c[attr] && c.term !== concept.term)
    .map((c) => c[attr]);
  if (new Set(pool).size < 3) {
    const extra = allConcepts
      .filter((c) => c.group !== concept.group && c[attr] && c.term !== concept.term)
      .map((c) => c[attr]);
    pool = [...pool, ...extra];
  }
  return pool;
}

function pickDistractors(value, pool, count = 3) {
  const unique = [...new Set(pool.filter((v) => v !== value))];
  return shuffle(unique).slice(0, count);
}

function makeOptions(correctText, distractorTexts) {
  let distractors = pickDistractors(correctText, distractorTexts, 3);
  // Ensure always 4 options
  if (distractors.length < 3) {
    const fillers = [
      'tidak ada hubungannya dengan konsep tersebut',
      'merupakan konsep yang berlawanan dengan pernyataan di atas',
      'hanya berlaku pada kondisi tertentu yang tidak umum',
      'tidak dapat ditentukan dari informasi yang diberikan',
    ];
    while (distractors.length < 3) {
      const filler = fillers[distractors.length % fillers.length];
      if (!distractors.includes(filler) && filler !== correctText) {
        distractors.push(filler);
      } else {
        distractors.push(`pilihan tambahan ${distractors.length + 1}`);
      }
    }
  }
  const texts = shuffle([correctText, ...distractors]);
  const correctId = String.fromCharCode(97 + texts.indexOf(correctText));
  return {
    options: texts.map((text, i) => ({ id: String.fromCharCode(97 + i), text })),
    correctAnswer: correctId,
  };
}

function jsValue(value, indent = 4) {
  const pad = ' '.repeat(indent);
  if (value === null || typeof value === 'boolean' || typeof value === 'number') {
    return String(value);
  }
  if (typeof value === 'string') {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';
    const items = value.map((v) => `${pad}  ${jsValue(v, indent + 2)}`).join(',\n');
    return `[\n${items},\n${pad}]`;
  }
  if (typeof value === 'object') {
    const entries = Object.entries(value)
      .map(([k, v]) => `${pad}  ${k}: ${jsValue(v, indent + 2)}`)
      .join(',\n');
    return `{\n${entries},\n${pad}}`;
  }
  return String(value);
}

function stringifyQuestion(q) {
  const entries = Object.entries(q)
    .map(([key, value]) => `    ${key}: ${jsValue(value, 4)}`)
    .join(',\n');
  return `  {\n${entries}\n  }`;
}

function makeIdentifyQuestion(concept, allConcepts, idx, bab, title) {
  const { options, correctAnswer } = makeOptions(concept.term, getRelatedTerms(concept, allConcepts));
  return {
    id: `psd-${bab}-${(idx + 1).toString().padStart(3, '0')}`,
    type: 'multiple_choice',
    bab,
    babTitle: title,
    question: `Manakah istilah yang tepat untuk konsep yang ${concept.definition}?`,
    options,
    correctAnswer,
    explanation: `${concept.term} adalah ${concept.definition}`,
    difficulty: concept.difficulty || 'medium',
    tags: ['pilihan-ganda', concept.category],
  };
}

function makeScenarioQuestion(concept, allConcepts, idx, bab, title) {
  const scenario = concept.whenToUse || concept.definition;
  const { options, correctAnswer } = makeOptions(concept.term, getRelatedTerms(concept, allConcepts));
  return {
    id: `psd-${bab}-${(idx + 1).toString().padStart(3, '0')}`,
    type: 'multiple_choice',
    bab,
    babTitle: title,
    question: `Ketika ${scenario}, manakah metode atau konsep yang paling tepat?`,
    options,
    correctAnswer,
    explanation: `${concept.term} adalah pilihan yang tepat karena ${concept.definition}`,
    difficulty: concept.difficulty || 'medium',
    tags: ['pilihan-ganda', concept.category],
  };
}

function makeWhenQuestion(concept, allConcepts, idx, bab, title) {
  const pool = getRelatedAttrPool(concept, allConcepts, 'whenToUse');
  const { options, correctAnswer } = makeOptions(concept.whenToUse, pool);
  return {
    id: `psd-${bab}-${(idx + 1).toString().padStart(3, '0')}`,
    type: 'multiple_choice',
    bab,
    babTitle: title,
    question: `Kapan ${concept.term} paling cocok digunakan?`,
    options,
    correctAnswer,
    explanation: `${concept.term} paling cocok digunakan ketika ${concept.whenToUse}.`,
    difficulty: concept.difficulty || 'medium',
    tags: ['pilihan-ganda', concept.category],
  };
}

function makeWeaknessQuestion(concept, allConcepts, idx, bab, title) {
  const pool = getRelatedAttrPool(concept, allConcepts, 'weakness');
  const { options, correctAnswer } = makeOptions(concept.weakness, pool);
  return {
    id: `psd-${bab}-${(idx + 1).toString().padStart(3, '0')}`,
    type: 'multiple_choice',
    bab,
    babTitle: title,
    question: `Apa kelemahan atau risiko utama dari ${concept.term}?`,
    options,
    correctAnswer,
    explanation: `Kelemahan utama ${concept.term} adalah ${concept.weakness}.`,
    difficulty: concept.difficulty || 'medium',
    tags: ['pilihan-ganda', concept.category],
  };
}

function makeAdvantageQuestion(concept, allConcepts, idx, bab, title) {
  const pool = getRelatedAttrPool(concept, allConcepts, 'advantage');
  const { options, correctAnswer } = makeOptions(concept.advantage, pool);
  return {
    id: `psd-${bab}-${(idx + 1).toString().padStart(3, '0')}`,
    type: 'multiple_choice',
    bab,
    babTitle: title,
    question: `Apa keunggulan utama dari ${concept.term}?`,
    options,
    correctAnswer,
    explanation: `Keunggulan utama ${concept.term} adalah ${concept.advantage}.`,
    difficulty: concept.difficulty || 'medium',
    tags: ['pilihan-ganda', concept.category],
  };
}

function makePurposeQuestion(concept, allConcepts, idx, bab, title) {
  const pool = getRelatedAttrPool(concept, allConcepts, 'purpose');
  const { options, correctAnswer } = makeOptions(concept.purpose, pool);
  return {
    id: `psd-${bab}-${(idx + 1).toString().padStart(3, '0')}`,
    type: 'multiple_choice',
    bab,
    babTitle: title,
    question: `Apa tujuan utama dari ${concept.term}?`,
    options,
    correctAnswer,
    explanation: `Tujuan utama ${concept.term} adalah ${concept.purpose}.`,
    difficulty: concept.difficulty || 'medium',
    tags: ['pilihan-ganda', concept.category],
  };
}

function makeEffectQuestion(concept, allConcepts, idx, bab, title) {
  const pool = getRelatedAttrPool(concept, allConcepts, 'effect');
  const { options, correctAnswer } = makeOptions(concept.effect, pool);
  return {
    id: `psd-${bab}-${(idx + 1).toString().padStart(3, '0')}`,
    type: 'multiple_choice',
    bab,
    babTitle: title,
    question: `Apa efek utama dari ${concept.term}?`,
    options,
    correctAnswer,
    explanation: `Efek utama ${concept.term} adalah ${concept.effect}.`,
    difficulty: concept.difficulty || 'medium',
    tags: ['pilihan-ganda', concept.category],
  };
}

function makeCorrectStatementQuestion(concept, allConcepts, idx, bab, title) {
  const correctStatement = `${concept.term} adalah ${concept.definition}`;
  const related = allConcepts.filter((c) => c.term !== concept.term && c.group === concept.group);
  const fallback = allConcepts.filter((c) => c.term !== concept.term && c.group !== concept.group);
  const distractors = shuffle([...related, ...fallback])
    .slice(0, 3)
    .map((c) => `${c.term} adalah ${c.definition}`);
  const { options, correctAnswer } = makeOptions(correctStatement, [
    ...distractors,
    ...allConcepts.map((c) => `${c.term} adalah ${c.definition}`),
  ]);
  return {
    id: `psd-${bab}-${(idx + 1).toString().padStart(3, '0')}`,
    type: 'multiple_choice',
    bab,
    babTitle: title,
    question: `Manakah pernyataan yang benar tentang ${concept.term}?`,
    options,
    correctAnswer,
    explanation: `Pernyataan yang benar tentang ${concept.term} adalah: ${correctStatement}.`,
    difficulty: concept.difficulty || 'medium',
    tags: ['pilihan-ganda', concept.category],
  };
}

const groupMaps = {
  'bab-8-nonlinear': {
    'Regresi polynomial': 'methods',
    'Step function regression': 'methods',
    'Basis function regression': 'methods',
    'Spline': 'methods',
    'Gaussian RBF': 'methods',
    'Generalized Additive Model': 'methods',
    'Overfitting': 'fitting',
    'Underfitting': 'fitting',
    'Bias-variance tradeoff': 'fitting',
    'Flexibility': 'fitting',
    'Transformasi fitur': 'preprocessing',
    'PolynomialFeatures': 'preprocessing',
    'KBinsDiscretizer': 'preprocessing',
    'Degree pada polynomial': 'preprocessing',
    'n_bins': 'preprocessing',
  },
  'bab-9-ml-intro': {
    'Supervised learning': 'ml_concepts',
    'Unsupervised learning': 'ml_concepts',
    'Reinforcement learning': 'ml_concepts',
    'Training set': 'ml_concepts',
    'Validation set': 'ml_concepts',
    'Test set': 'ml_concepts',
    'Feature': 'ml_concepts',
    'Label': 'ml_concepts',
    'Overfitting': 'ml_concepts',
    'Underfitting': 'ml_concepts',
    'Predictive analytics': 'analytics_metrics',
    'Prescriptive analytics': 'analytics_metrics',
    'Diagnostic analytics': 'analytics_metrics',
    'MAE': 'analytics_metrics',
    'MSE': 'analytics_metrics',
    'R-squared': 'analytics_metrics',
  },
  'bab-10-ml-lanjut': {
    'Feature engineering': 'pipeline',
    'EDA': 'pipeline',
    'train_test_split': 'pipeline',
    'stratify': 'pipeline',
    'K-Means': 'clustering',
    'Centroid': 'clustering',
    'Elbow method': 'clustering',
    'WCSS': 'clustering',
    'Silhouette score': 'clustering',
    'StandardScaler': 'clustering',
    'Confusion matrix': 'classification',
    'Precision': 'classification',
    'Recall': 'classification',
    'F1-score': 'classification',
    'Feature importance': 'classification',
  },
  'bab-11-shrinkage': {
    'OLS': 'methods',
    'Ridge regression': 'methods',
    'Lasso regression': 'methods',
    'Elastic Net': 'methods',
    'Lambda': 'regularization',
    'L1 penalty': 'regularization',
    'L2 penalty': 'regularization',
    'Regularization': 'regularization',
    'Coefficient shrinkage': 'regularization',
    'Multikolinearitas': 'shrinkage_concepts',
    'Feature selection': 'shrinkage_concepts',
    'Sparse model': 'shrinkage_concepts',
    'Standardisasi': 'shrinkage_concepts',
    'RSS': 'shrinkage_concepts',
    'Bias-variance tradeoff': 'shrinkage_concepts',
  },
  'bab-12-storytelling': {
    'Data storytelling': 'storytelling',
    'Dashboard': 'storytelling',
    'Data visualization': 'storytelling',
    'Actionable recommendation': 'storytelling',
    'THI': 'domain',
    'Heat stress': 'domain',
    'Confusion matrix': 'classification_metrics',
    'Precision': 'classification_metrics',
    'Recall': 'classification_metrics',
    'F1-score': 'classification_metrics',
    'Feature importance': 'classification_metrics',
    'K-Means clustering': 'clustering_tools',
    'StandardScaler': 'clustering_tools',
    'PCA': 'clustering_tools',
    'Elbow method': 'clustering_tools',
    'Silhouette score': 'clustering_tools',
  },
};

function assignGroups(banks) {
  banks.forEach((bank) => {
    const map = groupMaps[bank.file] || {};
    bank.concepts.forEach((c) => {
      c.group = map[c.term] || 'general';
    });
  });
}
const generators = [
  { key: 'identify', fn: makeIdentifyQuestion, needs: 'term' },
  { key: 'scenario', fn: makeScenarioQuestion, needs: 'term' },
  { key: 'when', fn: makeWhenQuestion, needs: 'whenToUse' },
  { key: 'weakness', fn: makeWeaknessQuestion, needs: 'weakness' },
  { key: 'advantage', fn: makeAdvantageQuestion, needs: 'advantage' },
  { key: 'purpose', fn: makePurposeQuestion, needs: 'purpose' },
  { key: 'effect', fn: makeEffectQuestion, needs: 'effect' },
  { key: 'statement', fn: makeCorrectStatementQuestion, needs: 'definition' },
];

function hasEnoughDistractors(concept, allConcepts, attr) {
  const pool = getRelatedAttrPool(concept, allConcepts, attr);
  return new Set(pool).size >= 3;
}

function generateForConcept(concept, allConcepts, startIdx, bab, title) {
  const questions = [];

  // Prefer application/understanding questions over plain identify
  const deeper = generators.filter(
    (g) => g.key !== 'identify' && concept[g.needs] && (g.needs === 'term' || hasEnoughDistractors(concept, allConcepts, g.needs))
  );

  if (deeper.length > 0) {
    const selected = shuffle(deeper).slice(0, 2);
    selected.forEach((g, i) => {
      questions.push(g.fn(concept, allConcepts, startIdx + i, bab, title));
    });
  } else {
    questions.push(makeIdentifyQuestion(concept, allConcepts, startIdx, bab, title));
    questions.push(makeCorrectStatementQuestion(concept, allConcepts, startIdx + 1, bab, title));
  }

  return questions;
}

const banks = [
  {
    file: 'bab-8-nonlinear',
    bab: 8,
    title: 'Regresi Nonlinear',
    concepts: [
      { term: 'Regresi polynomial', definition: 'menggunakan pangkat x, x^2, x^3, dan seterusnya untuk membentuk kurva', category: 'teknik', difficulty: 'easy', whenToUse: 'pola hubungan antar variabel bersifat halus dan global', weakness: 'mudah overfitting jika derajat polinomial terlalu tinggi', advantage: 'sederhana dan mudah dijelaskan' },
      { term: 'Step function regression', definition: 'membagi domain input menjadi interval-interval dan memberi nilai konstan per interval', category: 'teknik', difficulty: 'medium', whenToUse: 'keputusan didasarkan pada rentang nilai atau ambang batas', weakness: 'batas antar interval tidak halus', advantage: 'sangat mudah diinterpretasikan' },
      { term: 'Basis function regression', definition: 'mengubah variabel input menjadi sekumpulan fungsi basis sebelum regresi linear', category: 'teknik', difficulty: 'medium', whenToUse: 'pola data kompleks, lokal, atau tidak seragam', weakness: 'perlu memilih dan men-tune basis yang tepat', advantage: 'sangat fleksibel' },
      { term: 'Spline', definition: 'fungsi basis yang halus dan bersifat lokal, terdiri dari segmen-segmen polinomial', category: 'teknik', difficulty: 'hard', whenToUse: 'pola data halus tetapi berubah di bagian tertentu', weakness: 'pembagian knots dapat memengaruhi hasil', advantage: 'lebih halus daripada fungsi tangga' },
      { term: 'Gaussian RBF', definition: 'fungsi basis berbentuk lonceng yang aktif di sekitar titik center', category: 'teknik', difficulty: 'hard', whenToUse: 'pola data bersifat lokal di sekitar titik-titik tertentu', weakness: 'sensitif terhadap pemilihan center dan parameter gamma', advantage: 'dapat menangkap pola non-linear yang kompleks' },
      { term: 'Overfitting', definition: 'model terlalu kompleks sehingga menyesuaikan diri berlebihan pada data latih', category: 'konsep', difficulty: 'easy', whenToUse: 'terjadi saat model memiliki banyak parameter atau data latih sedikit', weakness: 'performa buruk pada data baru', purpose: 'perlu dideteksi agar model dapat melakukan generalisasi dengan baik' },
      { term: 'Underfitting', definition: 'model terlalu sederhana sehingga gagal menangkap pola penting', category: 'konsep', difficulty: 'easy', whenToUse: 'terjadi saat model kurang kompleks dibanding pola data', weakness: 'error pada data latih dan data uji sama-sama tinggi', purpose: 'menunjukkan bahwa model perlu ditingkatkan kompleksitasnya' },
      { term: 'Bias-variance tradeoff', definition: 'keseimbangan antara kesederhanaan model dan sensitivitas terhadap data', category: 'konsep', difficulty: 'hard', whenToUse: 'saat memilih kompleksitas model agar tidak underfit atau overfit', weakness: 'model terlalu sederhana menyebabkan bias tinggi, terlalu kompleks menyebabkan varians tinggi', purpose: 'menemukan model yang generalisasi baik' },
      { term: 'Transformasi fitur', definition: 'mengubah variabel input menjadi representasi baru sebelum dilakukan regresi', category: 'konsep', difficulty: 'medium', whenToUse: 'hubungan asli non-linear tetapi ingin tetap menggunakan model linear pada parameter', advantage: 'memungkinkan regresi linear menangkap pola non-linear', purpose: 'membuat representasi data yang lebih sesuai bagi model' },
      { term: 'PolynomialFeatures', definition: 'transformer scikit-learn yang membuat fitur pangkat dari fitur asli', category: 'tools', difficulty: 'medium', whenToUse: 'saat ingin membangun model regresi polynomial', advantage: 'otomatis menghasilkan x, x^2, x^3, dan seterusnya', purpose: 'membantu pembentukan basis polynomial' },
      { term: 'KBinsDiscretizer', definition: 'transformer scikit-learn yang mengubah fitur numerik menjadi kategori interval', category: 'tools', difficulty: 'medium', whenToUse: 'saat ingin membangun model fungsi tangga', weakness: 'jumlah dan posisi bin memengaruhi hasil', purpose: 'mengubah data kontinu menjadi data kategori' },
      { term: 'Degree pada polynomial', definition: 'derajat tertinggi pangkat yang digunakan dalam regresi polynomial', category: 'parameter', difficulty: 'easy', whenToUse: 'mengontrol fleksibilitas kurva', weakness: 'nilai terlalu tinggi meningkatkan risiko overfitting', advantage: 'menentukan seberapa fleksibel kurva yang dapat dibentuk' },
      { term: 'n_bins', definition: 'jumlah interval yang digunakan dalam binning atau fungsi tangga', category: 'parameter', difficulty: 'easy', whenToUse: 'mengontrol resolusi segmentasi data', weakness: 'terlalu sedikit terlalu kasar, terlalu banyak terlalu sensitif', purpose: 'menentukan berapa banyak segmen dalam step function' },
      { term: 'Generalized Additive Model', definition: 'model regresi yang menggunakan fungsi fleksibel untuk setiap prediktor secara additive', category: 'teknik', difficulty: 'hard', whenToUse: 'pola non-linear additive pada banyak prediktor', advantage: 'lebih fleksibel dari regresi linear sederhana', purpose: 'memodelkan hubungan non-linear secara additive' },
      { term: 'Flexibility', definition: 'kemampuan model menyesuaikan bentuk kurva terhadap pola data', category: 'konsep', difficulty: 'easy', whenToUse: 'ditingkatkan untuk menangkap pola kompleks', weakness: 'terlalu fleksibel dapat menyebabkan overfitting', advantage: 'memungkinkan model mengikuti pola data dengan lebih baik' },
    ],
  },
  {
    file: 'bab-9-ml-intro',
    bab: 9,
    title: 'Pengenalan Machine Learning',
    concepts: [
      { term: 'Supervised learning', definition: 'belajar dari data yang memiliki pasangan input dan label target', category: 'tipe', difficulty: 'easy', whenToUse: 'ingin memprediksi nilai atau kategori berdasarkan data berlabel', advantage: 'dapat mengevaluasi performa dengan jelas karena ada target', purpose: 'membangun model prediksi dari data berlabel' },
      { term: 'Unsupervised learning', definition: 'belajar dari data tanpa label untuk menemukan pola tersembunyi', category: 'tipe', difficulty: 'easy', whenToUse: 'ingin mengelompokkan atau menyederhanakan data', advantage: 'tidak memerlukan data yang sudah diberi label', purpose: 'menemukan struktur tersembunyi dalam data' },
      { term: 'Reinforcement learning', definition: 'belajar melalui interaksi dengan lingkungan berdasarkan aksi dan reward', category: 'tipe', difficulty: 'medium', whenToUse: 'sistem harus belajar mengambil keputusan secara bertahap', advantage: 'dapat belajar dari feedback lingkungan', purpose: 'menemukan kebijakan aksi yang memaksimalkan reward' },
      { term: 'Training set', definition: 'bagian data yang digunakan untuk melatih parameter model', category: 'data', difficulty: 'easy', advantage: 'tempat model belajar pola dari data', purpose: 'mengestimasi parameter model' },
      { term: 'Validation set', definition: 'bagian data yang digunakan untuk memilih model dan menyetel hyperparameter', category: 'data', difficulty: 'medium', advantage: 'membantu memilih model terbaik tanpa memakai test set', purpose: 'mencegah overfitting pada data latih' },
      { term: 'Test set', definition: 'bagian data yang digunakan untuk mengevaluasi performa akhir model', category: 'data', difficulty: 'easy', advantage: 'mengukur generalisasi pada data yang benar-benar baru', purpose: 'memberikan estimasi performa di dunia nyata' },
      { term: 'Feature', definition: 'variabel input yang digunakan model untuk membuat prediksi', category: 'konsep', difficulty: 'easy', advantage: 'menyediakan informasi yang digunakan model', purpose: 'merepresentasikan karakteristik data input' },
      { term: 'Label', definition: 'nilai target yang ingin diprediksi oleh model', category: 'konsep', difficulty: 'easy', advantage: 'memberikan target yang jelas untuk dipelajari model', purpose: 'menjadi acuan prediksi dalam supervised learning' },
      { term: 'Overfitting', definition: 'model terlalu kompleks sehingga sangat baik di latih tetapi buruk di data baru', category: 'konsep', difficulty: 'easy', whenToUse: 'terdeteksi ketika training error jauh lebih rendah dari validation error', weakness: 'performa buruk pada data yang belum pernah dilihat', purpose: 'menunjukkan bahwa model belajar noise, bukan pola umum' },
      { term: 'Underfitting', definition: 'model terlalu sederhana sehingga gagal menangkap pola penting', category: 'konsep', difficulty: 'easy', whenToUse: 'terdeteksi ketika training dan testing error sama-sama tinggi', weakness: 'model tidak mampu menangkap pola utama', purpose: 'menunjukkan bahwa model perlu lebih kompleks' },
      { term: 'MAE', definition: 'rata-rata nilai absolut selisih prediksi dan nilai aktual', category: 'metrik', difficulty: 'medium', advantage: 'mudah diinterpretasikan dalam satuan asli', weakness: 'tidak memberikan penalti ekstra pada error besar', purpose: 'mengukur rata-rata besar kesalahan prediksi' },
      { term: 'MSE', definition: 'rata-rata kuadrat selisih prediksi dan nilai aktual', category: 'metrik', difficulty: 'medium', advantage: 'memberikan penalti lebih besar pada error besar', weakness: 'sensitif terhadap outlier', purpose: 'mengukur kesalahan prediksi dengan penalti kuadrat' },
      { term: 'R-squared', definition: 'koefisien determinasi yang mengukur proporsi variasi data yang dijelaskan model', category: 'metrik', difficulty: 'medium', advantage: 'memberikan gambaran seberapa baik model mengikuti pola data', weakness: 'dapat meningkat seiring bertambahnya fitur meski tidak bermakna', purpose: 'mengevaluasi goodness-of-fit model regresi' },
      { term: 'Predictive analytics', definition: 'jenis analisis yang menjawab pertanyaan apa yang akan terjadi di masa depan', category: 'jenis', difficulty: 'easy', whenToUse: 'ingin memprediksi hasil atau kejadian mendatang', advantage: 'menggunakan data historis untuk perkiraan', purpose: 'menghasilkan prediksi berbasis data' },
      { term: 'Prescriptive analytics', definition: 'jenis analisis yang menjawab pertanyaan apa yang sebaiknya dilakukan', category: 'jenis', difficulty: 'medium', whenToUse: 'ingin mendapatkan rekomendasi tindakan', advantage: 'memberikan saran konkret untuk pengambilan keputusan', purpose: 'menentukan tindakan optimal berdasarkan prediksi' },
    ],
  },
  {
    file: 'bab-10-ml-lanjut',
    bab: 10,
    title: 'Supervised dan Unsupervised Learning',
    concepts: [
      { term: 'Feature engineering', definition: 'proses membentuk fitur baru agar lebih representatif bagi model', category: 'teknik', difficulty: 'medium', whenToUse: 'ketika fitur asli tidak cukup menangkap pola', advantage: 'memasukkan pemahaman domain ke dalam model', purpose: 'meningkatkan kemampuan model dengan fitur yang lebih baik' },
      { term: 'EDA', definition: 'tahap eksplorasi data untuk memahami karakteristik sebelum modeling', category: 'tahapan', difficulty: 'easy', whenToUse: 'dilakukan sebelum membangun model', advantage: 'membantu mendeteksi outlier, distribusi, dan relasi', purpose: 'menentukan strategi modeling yang tepat' },
      { term: 'K-Means', definition: 'algoritma clustering yang membagi data ke K kelompok berdasarkan kedekatan dengan centroid', category: 'algoritma', difficulty: 'medium', whenToUse: 'mengelompokkan data tanpa label', weakness: 'perlu menentukan jumlah K di awal', purpose: 'menemukan kelompok data yang saling mirip' },
      { term: 'Centroid', definition: 'titik pusat dari sebuah cluster dalam algoritma K-Means', category: 'konsep', difficulty: 'easy', advantage: 'mewakili rata-rata karakteristik cluster', purpose: 'menjadi acuan pengelompokan data' },
      { term: 'Elbow method', definition: 'metode menentukan jumlah cluster optimal dari titik siku pada plot WCSS', category: 'metrik', difficulty: 'medium', whenToUse: 'saat memilih nilai K yang tepat', advantage: 'memberikan petunjuk visual K optimal', purpose: 'membantu menentukan jumlah cluster' },
      { term: 'WCSS', definition: 'total kuadrat jarak data ke centroid dalam cluster', category: 'metrik', difficulty: 'hard', advantage: 'mengukur kompakness cluster', purpose: 'digunakan untuk mengevaluasi kualitas cluster' },
      { term: 'Silhouette score', definition: 'metrik yang mengukur seberapa baik cluster terpisah', category: 'metrik', difficulty: 'hard', advantage: 'memberikan gambaran keterpisahan cluster', purpose: 'mengevaluasi kualitas clustering' },
      { term: 'StandardScaler', definition: 'preprocessing untuk menstandarisasi fitur agar memiliki mean 0 dan standar deviasi 1', category: 'tools', difficulty: 'medium', whenToUse: 'sebelum clustering atau model yang sensitif terhadap skala', advantage: 'mencegah fitur berskala besar mendominasi', purpose: 'menyamakan skala antar fitur' },
      { term: 'Confusion matrix', definition: 'tabel perbandingan prediksi model dengan nilai aktual', category: 'metrik', difficulty: 'medium', advantage: 'menunjukkan jenis kesalahan prediksi', purpose: 'mengevaluasi klasifikasi secara detail' },
      { term: 'Precision', definition: 'proporsi prediksi positif yang benar-benar positif', category: 'metrik', difficulty: 'hard', whenToUse: 'penting saat ingin mengurangi false positive', advantage: 'mengukur keandalan prediksi positif', purpose: 'mengevaluasi akurasi prediksi positif' },
      { term: 'Recall', definition: 'proporsi kasus positif aktual yang berhasil ditemukan model', category: 'metrik', difficulty: 'hard', whenToUse: 'penting saat ingin mengurangi false negative', advantage: 'mengukur kemampuan menemukan semua positif', purpose: 'mengevaluasi kelengkapan deteksi positif' },
      { term: 'F1-score', definition: 'rata-rata harmonik antara precision dan recall', category: 'metrik', difficulty: 'hard', whenToUse: 'ketika precision dan recall sama-sama penting', advantage: 'memberikan keseimbangan kedua metrik', purpose: 'mengevaluasi klasifikasi secara menyeluruh' },
      { term: 'train_test_split', definition: 'fungsi untuk membagi data menjadi training dan testing set', category: 'tools', difficulty: 'easy', advantage: 'memisahkan data latih dan data uji', purpose: 'mengevaluasi generalisasi model' },
      { term: 'stratify', definition: 'parameter untuk mempertahankan proporsi kelas saat pembagian data', category: 'parameter', difficulty: 'hard', whenToUse: 'penting untuk data dengan kelas tidak seimbang', advantage: 'memastikan proporsi kelas tetap terjaga', purpose: 'menghindari bias distribusi kelas' },
      { term: 'Feature importance', definition: 'ukuran yang menunjukkan seberapa besar kontribusi suatu fitur dalam model', category: 'metrik', difficulty: 'medium', advantage: 'membantu memahami faktor yang paling berpengaruh', purpose: 'menjelaskan pengaruh masing-masing fitur' },
    ],
  },
  {
    file: 'bab-11-shrinkage',
    bab: 11,
    title: 'Shrinkage Methods',
    concepts: [
      { term: 'OLS', definition: 'metode regresi linear yang meminimalkan jumlah kuadrat error', category: 'konsep', difficulty: 'easy', advantage: 'sederhana dan mudah diinterpretasikan', weakness: 'koefisien bisa tidak stabil jika ada multikolinearitas', purpose: 'menjadi model baseline regresi linear' },
      { term: 'Multikolinearitas', definition: 'kondisi prediktor saling berkorelasi tinggi', category: 'konsep', difficulty: 'medium', weakness: 'koefisien regresi menjadi tidak stabil', purpose: 'menjelaskan kenapa OLS perlu regularisasi' },
      { term: 'Ridge regression', definition: 'regresi dengan penalti L2 pada kuadrat koefisien', category: 'teknik', difficulty: 'medium', whenToUse: 'banyak fitur saling berkorelasi', effect: 'menyusut semua koefisien tetapi umumnya tidak nol', advantage: 'menstabilkan koefisien' },
      { term: 'Lasso regression', definition: 'regresi dengan penalti L1 pada nilai absolut koefisien', category: 'teknik', difficulty: 'medium', whenToUse: 'ingin melakukan seleksi fitur otomatis', effect: 'dapat mengnolkan sebagian koefisien', advantage: 'menghasilkan model yang lebih ringkas' },
      { term: 'Elastic Net', definition: 'regresi yang menggabungkan penalti L1 dan L2', category: 'teknik', difficulty: 'hard', whenToUse: 'ingin kelebihan Ridge dan Lasso sekaligus', advantage: 'dapat menyusut dan menyeleksi koefisien', purpose: 'mengatasi kelemahan masing-masing metode' },
      { term: 'Lambda', definition: 'parameter yang mengontrol kekuatan penalti regularisasi', category: 'parameter', difficulty: 'medium', whenToUse: 'disetel saat training Ridge, Lasso, atau Elastic Net', effect: 'semakin besar nilainya, koefisien semakin mengecil', purpose: 'mengontrol seberapa kuat shrinkage' },
      { term: 'L1 penalty', definition: 'penalti berbasis jumlah nilai absolut koefisien', category: 'konsep', difficulty: 'medium', whenToUse: 'digunakan dalam Lasso regression', advantage: 'dapat menghasilkan sparse model' },
      { term: 'L2 penalty', definition: 'penalti berbasis jumlah kuadrat koefisien', category: 'konsep', difficulty: 'medium', whenToUse: 'digunakan dalam Ridge regression', advantage: 'menyusut koefisien secara merata' },
      { term: 'Standardisasi', definition: 'menyamakan skala fitur sebelum regularisasi', category: 'teknik', difficulty: 'medium', whenToUse: 'wajib sebelum Ridge atau Lasso', advantage: 'memastikan penalti tidak memihak fitur berskala besar', purpose: 'menyamakan satuan antar fitur' },
      { term: 'Feature selection', definition: 'proses memilih fitur yang paling relevan', category: 'teknik', difficulty: 'medium', whenToUse: 'ingin menyederhanakan model', advantage: 'Lasso melakukannya secara otomatis', purpose: 'mengurangi kompleksitas dan noise' },
      { term: 'Sparse model', definition: 'model yang hanya memiliki sedikit koefisien tidak nol', category: 'konsep', difficulty: 'medium', advantage: 'lebih mudah diinterpretasikan', purpose: 'menyederhanakan model dengan menghilangkan fitur tidak penting' },
      { term: 'RSS', definition: 'jumlah kuadrat selisih nilai aktual dan prediksi', category: 'metrik', difficulty: 'medium', purpose: 'diminimalkan oleh OLS', advantage: 'mengukur total error kuadrat' },
      { term: 'Regularization', definition: 'teknik menambahkan penalti untuk mengurangi kompleksitas model', category: 'konsep', difficulty: 'easy', whenToUse: 'saat model overfitting', advantage: 'mencegah koefisien terlalu besar', purpose: 'meningkatkan generalisasi' },
      { term: 'Bias-variance tradeoff', definition: 'keseimbangan antara kesalahan akibat asumsi terlalu sederhana dan sensitivitas terhadap data', category: 'konsep', difficulty: 'hard', whenToUse: 'saat menyetel kekuatan regularisasi', purpose: 'menemukan model yang generalisasi baik' },
      { term: 'Coefficient shrinkage', definition: 'proses mengecilkan besar koefisien regresi', category: 'konsep', difficulty: 'medium', whenToUse: 'dilakukan oleh Ridge dan Lasso', advantage: 'menstabilkan estimasi dan mengurangi varians', purpose: 'mencegah koefisien terlalu ekstrem' },
    ],
  },
  {
    file: 'bab-12-storytelling',
    bab: 12,
    title: 'Data Storytelling dan Dashboarding',
    concepts: [
      { term: 'Data storytelling', definition: 'mengubah hasil analisis data menjadi cerita runtut berbasis bukti', category: 'konsep', difficulty: 'easy', whenToUse: 'saat menyajikan hasil analisis ke audiens', advantage: 'membantu pengambilan keputusan', purpose: 'menghubungkan data dengan tindakan' },
      { term: 'Dashboard', definition: 'tampilan yang memantau indikator penting dan mengikuti alur cerita', category: 'konsep', difficulty: 'easy', whenToUse: 'saat ingin memantau kondisi secara berkala', advantage: 'membantu audiens mengikuti alur cerita', purpose: 'menyajikan insight dan rekomendasi' },
      { term: 'Data visualization', definition: 'menyajikan pola dalam data melalui grafik', category: 'konsep', difficulty: 'easy', whenToUse: 'saat ingin menunjukkan tren atau perbandingan', advantage: 'memudahkan identifikasi pola', purpose: 'membantu eksplorasi dan komunikasi data' },
      { term: 'THI', definition: 'indeks yang menggabungkan suhu dan kelembapan untuk mengukur tekanan panas', category: 'fitur', difficulty: 'medium', whenToUse: 'saat mengevaluasi kenyamanan ternak', advantage: 'merangkum dua faktor lingkungan menjadi satu angka', purpose: 'mendeteksi heat stress' },
      { term: 'Heat stress', definition: 'kondisi stres panas yang memengaruhi performa ternak', category: 'konsep', difficulty: 'medium', whenToUse: 'terjadi saat THI tinggi', weakness: 'dapat menurunkan produktivitas', purpose: 'menjelaskan dampak lingkungan panas' },
      { term: 'Confusion matrix', definition: 'tabel prediksi versus aktual untuk evaluasi klasifikasi', category: 'metrik', difficulty: 'medium', advantage: 'menunjukkan jenis kesalahan secara detail', purpose: 'mengevaluasi performa klasifikasi' },
      { term: 'Precision', definition: 'dari semua prediksi positif, berapa yang benar-benar positif', category: 'metrik', difficulty: 'hard', whenToUse: 'penting saat ingin mengurangi false positive', advantage: 'mengukur keandalan prediksi positif', purpose: 'mengevaluasi akurasi prediksi positif' },
      { term: 'Recall', definition: 'dari semua kasus positif aktual, berapa yang ditemukan model', category: 'metrik', difficulty: 'hard', whenToUse: 'penting saat ingin mengurangi false negative', advantage: 'mengukur kelengkapan deteksi', purpose: 'mengevaluasi kemampuan menemukan kasus positif' },
      { term: 'F1-score', definition: 'keseimbangan precision dan recall', category: 'metrik', difficulty: 'hard', whenToUse: 'ketika precision dan recall sama-sama penting', advantage: 'memberikan metrik tunggal yang seimbang', purpose: 'mengevaluasi klasifikasi secara menyeluruh' },
      { term: 'Feature importance', definition: 'ukuran yang menunjukkan seberapa besar kontribusi suatu fitur dalam model', category: 'metrik', difficulty: 'medium', advantage: 'membantu memahami faktor yang paling berpengaruh', purpose: 'menjelaskan pengaruh masing-masing fitur' },
      { term: 'K-Means clustering', definition: 'mengelompokkan data berdasarkan kemiripan tanpa label', category: 'algoritma', difficulty: 'medium', whenToUse: 'saat ingin menemukan segmen atau profil', advantage: 'tidak memerlukan label', purpose: 'menemukan kelompok data yang mirip' },
      { term: 'StandardScaler', definition: 'menstandarisasi fitur sebelum clustering', category: 'tools', difficulty: 'medium', whenToUse: 'saat fitur memiliki skala berbeda', advantage: 'mencegah fitur berskala besar mendominasi', purpose: 'menyamakan skala sebelum clustering' },
      { term: 'PCA', definition: 'teknik reduksi dimensi untuk visualisasi data berdimensi tinggi', category: 'teknik', difficulty: 'hard', whenToUse: 'saat ingin menampilkan data banyak dimensi dalam 2D', advantage: 'membantu visualisasi cluster', purpose: 'mengurangi dimensi untuk visualisasi' },
      { term: 'Elbow method', definition: 'metode menentukan jumlah cluster dari plot inertia', category: 'metrik', difficulty: 'medium', whenToUse: 'saat memilih K untuk K-Means', advantage: 'memberikan petunjuk visual K optimal', purpose: 'menentukan jumlah cluster' },
      { term: 'Actionable recommendation', definition: 'rekomendasi konkret yang dapat langsung ditindaklanjuti', category: 'konsep', difficulty: 'medium', whenToUse: 'di akhir data storytelling', advantage: 'menghubungkan insight dengan keputusan nyata', purpose: 'mendorong tindakan berbasis data' },
    ],
  },
];

assignGroups(banks);

// Generate per-BAB files (30 questions each)
for (const bank of banks) {
  const questions = [];
  bank.concepts.forEach((concept) => {
    const generated = generateForConcept(concept, bank.concepts, questions.length, bank.bab, bank.title);
    questions.push(...generated);
  });

  // Ensure exactly PER_BAB_COUNT questions
  const finalQuestions = questions.slice(0, PER_BAB_COUNT);

  // Reassign sequential ids
  finalQuestions.forEach((q, i) => {
    q.id = `psd-${bank.bab}-${(i + 1).toString().padStart(3, '0')}`;
  });

  const varName = `bab${bank.bab}Questions`;
  const header = `// Bank Soal BAB ${bank.bab}: ${bank.title}\nconst ${varName} = [\n`;
  const body = finalQuestions.map(stringifyQuestion).join(',\n');
  const footer = `\n];\n\nexport default ${varName};\n`;
  fs.writeFileSync(path.join(DATA_DIR, `${bank.file}.js`), header + body + footer, 'utf-8');
  console.log(`Generated ${bank.file}: ${finalQuestions.length} questions`);
}

// Generate UAS question bank (100 MC questions from BAB 8-12)
const allConcepts = banks.flatMap((b) => b.concepts.map((c) => ({ ...c, bab: b.bab, babTitle: b.title })));
const uasQuestions = [];
allConcepts.forEach((concept) => {
  const generated = generateForConcept(concept, allConcepts, uasQuestions.length, concept.bab, concept.babTitle);
  uasQuestions.push(...generated);
});

// Reassign sequential ids and shuffle
const uasSelected = shuffle(uasQuestions).slice(0, UAS_COUNT);
uasSelected.forEach((q, i) => {
  q.id = `psd-uas-${(i + 1).toString().padStart(3, '0')}`;
});

const uasHeader = `// Bank Soal UAS - Campuran Semua BAB 8-12\nexport const quizUAS = [\n`;
const uasBody = uasSelected.map(stringifyQuestion).join(',\n');
const uasFooter = `\n];\n\nexport function getUASQuestions(count = quizUAS.length) {\n  const shuffled = [...quizUAS].sort(() => Math.random() - 0.5);\n  return shuffled.slice(0, count);\n}\n\nexport default quizUAS;\n`;
fs.writeFileSync(path.join(DATA_DIR, 'quiz-uas.js'), uasHeader + uasBody + uasFooter, 'utf-8');
console.log(`Generated quiz-uas: ${uasSelected.length} questions`);
