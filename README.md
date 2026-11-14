# Q-CardioNet: Hybrid CNN-Quantum Variational Circuit for ECG Arrhythmia Classification

## 1. Project Overview

Q-CardioNet is a hybrid Quantum-Classical Deep Learning framework designed for automated ECG arrhythmia classification.

The system combines a **1D Convolutional Neural Network (CNN)** with an **8-qubit Variational Quantum Circuit (VQC)** to extract meaningful features from ECG signals and classify different types of cardiac arrhythmias.

The CNN extracts spatial-temporal features from ECG heartbeat signals, while the quantum circuit performs quantum feature transformation and contributes to the final classification.

The framework classifies ECG signals into five categories:

- Normal
- LBBB (Left Bundle Branch Block)
- RBBB (Right Bundle Branch Block)
- APB (Atrial Premature Beat)
- PVC (Premature Ventricular Contraction)

## 2. Key Features

- Hybrid CNN-Quantum architecture.
- ECG signal preprocessing and noise reduction.
- R-peak detection using the Pan-Tompkins algorithm.
- Heartbeat segmentation and Z-score normalization.
- Classical feature extraction using 1D-CNN.
- Quantum feature encoding using Angle Embedding.
- 8-qubit Variational Quantum Circuit.
- Cyclic closed-ring CNOT entanglement.
- Five-class arrhythmia classification.
- Rule-based clinical risk stratification.
- Comparison with SVM-VQC and PCA-VQC baseline models.

## 3. System Architecture

The proposed framework follows the pipeline below:

1. ECG Data Acquisition
2. ECG Signal Preprocessing
3. R-Peak Detection
4. Heartbeat Segmentation
5. Z-Score Normalization
6. 1D-CNN Feature Extraction
7. Classical-to-Quantum Projection
8. Quantum Angle Embedding
9. Variational Quantum Circuit
10. Quantum Expectation Measurement
11. Softmax Classification
12. Clinical Risk Stratification

### Model Architecture

**Classical Feature Extractor:**
- Input: 180 × 1 ECG heartbeat segment.
- Conv1D Layer 1: 16 filters, kernel size 5.
- Batch Normalization and ReLU.
- Max Pooling.
- Conv1D Layer 2: 32 filters, kernel size 5.
- Batch Normalization and ReLU.
- Max Pooling.
- Flattening: 1,440 features.
- Fully Connected Layer: 16-dimensional feature vector.

**Quantum Component:**
- 8 qubits.
- PennyLane quantum simulator.
- Angle Embedding using RX gates.
- Two variational layers.
- RX, RY and RZ rotation gates.
- Cyclic closed-ring CNOT entanglement.
- Pauli-Z expectation measurements.

**Classification Component:**
- Dense classification layer.
- Softmax activation.
- Five arrhythmia classes.

## 4. Technologies Used

| Category | Technologies |
|---|---|
| Programming Language | Python |
| Deep Learning | PyTorch |
| Quantum Machine Learning | PennyLane |
| ECG Processing | WFDB |
| Numerical Computing | NumPy |
| Data Processing | Pandas |
| Machine Learning | Scikit-learn |
| Signal Processing | SciPy |
| Visualization | Matplotlib |

## 5. Dataset

The project uses two ECG data sources:

### A. MIT-BIH Arrhythmia Database

- Source: PhysioNet
- Number of records: 48
- Sampling frequency: 360 Hz
- Purpose: Benchmark model development and evaluation.

Dataset link:

https://physionet.org/content/mitdb/1.0.0/

### B. Clinical Hospital ECG Dataset

- Source: Hospital ECG recordings.
- Number of recordings: 105
- Original sampling frequency: 1000 Hz.
- Purpose: Cross-domain clinical evaluation.

The clinical dataset is proprietary and is not publicly distributed with this repository.

### Dataset Processing

- Hospital ECG recordings are resampled from 1000 Hz to 360 Hz using Fourier resampling.
- R-peaks are detected using the Pan-Tompkins algorithm.
- Heartbeats are initially extracted using 200-sample windows.
- Ten samples are trimmed from each edge.
- Final heartbeat representation: 180 × 1.
- Z-score normalization is applied.

The integrated dataset contains 112,163 heartbeat segments across five arrhythmia classes.

**Note:** The original patient-level partitioning is maintained to prevent data leakage. The training, validation and testing split follows an approximate 70:15:15 ratio.

## 6. Installation and Execution

### Prerequisites

- Python 3.10 or a compatible Python version.
- pip package manager.
- Git.
- Sufficient RAM for ECG preprocessing and quantum simulation.

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd Q-CardioNet
```

### Step 2: Create a Virtual Environment

```bash
python -m venv venv
```

Activate the environment.

**Windows:**

```bash
venv\Scripts\activate
```

**Linux / macOS:**

```bash
source venv/bin/activate
```

### Step 3: Install Dependencies

If a `requirements.txt` file is available:

```bash
pip install -r requirements.txt
```

The project requires the following Python libraries:

```bash
pip install torch pennylane numpy pandas
pip install scikit-learn matplotlib wfdb scipy
```

### Step 4: Download the Dataset

Download the MIT-BIH Arrhythmia Database from:

https://physionet.org/content/mitdb/1.0.0/

Place the downloaded records in the dataset directory according to the project's data-loading configuration.

The clinical hospital dataset must be provided separately by an authorized data owner.

### Step 5: Configure Dataset Paths

Update the dataset paths in the preprocessing or configuration script to point to the downloaded MIT-BIH records and, where authorized, the clinical ECG dataset.

### Step 6: Run ECG Preprocessing

Execute the preprocessing script to perform:

- ECG signal loading.
- Resampling.
- Noise reduction.
- R-peak detection.
- Heartbeat segmentation.
- Z-score normalization.
- Patient-wise data splitting.

```bash
python <preprocessing_script>.py
```

### Step 7: Train the Model

Run the model training script to train the hybrid CNN-VQC architecture.

```bash
python <training_script>.py
```

The model uses the Adam optimizer with a learning rate of 0.01 and Cross-Entropy Loss.

### Step 8: Evaluate the Model

Execute the evaluation script to calculate:

- Accuracy
- Precision
- Recall
- F1-score
- Confusion Matrix
- ROC Curves
- AUC

```bash
python <evaluation_script>.py
```

**Note:** The script filenames above are placeholders. Replace them with the actual filenames used in the repository.

## 7. Model Configuration

| Parameter | Configuration |
|---|---|
| Input Dimension | 180 × 1 |
| CNN Latent Dimension | 16 |
| Quantum Input Dimension | 8 |
| Number of Qubits | 8 |
| Variational Layers | 2 |
| Rotation Gates | RX, RY, RZ |
| Entanglement | Closed-ring CNOT |
| Measurement | Pauli-Z |
| Output Classes | 5 |
| Optimizer | Adam |
| Learning Rate | 0.01 |
| Loss Function | Cross-Entropy Loss |
| Dropout | 0.1 |

## 8. Experimental Results

The proposed CNN-VQC model was compared with two baseline models using an independent 600-sample test set.

| Model | Accuracy | Precision | Recall | F1-Score |
|---|---:|---:|---:|---:|
| PCA-VQC | 74.67% | 80.85% | 74.67% | 77.19% |
| SVM-VQC | 88.00% | 89.00% | 88.00% | 88.00% |
| CNN-VQC | 93.56% | 86.38% | 90.81% | 88.10% |

The proposed CNN-VQC architecture achieved the highest classification accuracy among the evaluated models.

## 9. Clinical Risk Stratification

The framework provides an additional rule-based risk classification based on the predicted arrhythmia category.

| Arrhythmia Class | Risk Level |
|---|---|
| Normal | Low |
| RBBB | Elevated |
| APB | Elevated |
| LBBB | High |
| PVC | High |

The risk-stratification component is intended as research-oriented clinical decision support and does not replace professional medical diagnosis.

## 10. Limitations

- The quantum circuit is evaluated using PennyLane's default.qubit simulator.
- Real quantum hardware execution has not been performed.
- Model performance is based on a single patient-wise data split.
- Further evaluation using larger clinical datasets is required.
- A classical CNN-only ablation study is needed to isolate the contribution of the quantum component.
- Computational training and inference times have not been measured.

## 11. Future Enhancements

- Evaluation on real quantum hardware.
- Integration of Explainable AI techniques.
- Validation using larger and more diverse ECG datasets.
- Repeated experiments and cross-validation.
- Comparison with additional classical and quantum architectures.
- Further clinical validation of the risk-stratification component.

## 12. References

1. Goldberger et al., "PhysioBank, PhysioToolkit, and PhysioNet: Components of a New Research Resource for Complex Physiologic Signals," Circulation, 2000.

2. PennyLane Documentation: https://docs.pennylane.ai/

3. PyTorch Documentation: https://pytorch.org/docs/

4. MIT-BIH Arrhythmia Database: https://physionet.org/content/mitdb/1.0.0/

---

**Project:** Q-CardioNet – A Hybrid CNN-Quantum Variational Circuit for Robust ECG Arrhythmia Classification.

**Institution:** Sahyadri College of Engineering and Management, Mangaluru, India.
