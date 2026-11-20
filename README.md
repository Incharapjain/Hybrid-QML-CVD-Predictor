## 6. Model Evaluation

Run the evaluation script using Python:

```bash
python <evaluation_script>.py
```

> Note: Replace `<evaluation_script>.py` with the actual evaluation script filename available in the repository.

---

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

---

## 8. Experimental Results

The proposed CNN-VQC model was compared with two baseline models using an independent 600-sample test set.

| Model | Accuracy (%) |
|---|---:|
| CNN-QELM | 92.33 |
| CNN-QCNN | 93.14 |
| CNN-VQC | 93.56 |

The proposed CNN-VQC architecture achieved the highest classification accuracy among the evaluated models.

---

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

---

## 10. Limitations

- The quantum circuit is evaluated using PennyLane's `default.qubit` simulator.
- Real quantum hardware execution has not been performed.
- Model performance is based on a single patient-wise data split.
- Further evaluation using larger clinical datasets is required.
- A classical CNN-only ablation study is needed to isolate the contribution of the quantum component.
- Computational training and inference times have not been measured.

---

## 11. Future Enhancements

- Evaluation on real quantum hardware.
- Integration of Explainable AI techniques.
- Validation using larger and more diverse ECG datasets.
- Repeated experiments and cross-validation.
- Comparison with additional classical and quantum architectures.
- Further clinical validation of the risk-stratification component.

---

## 12. References

1. Goldberger et al., *PhysioBank, PhysioToolkit, and PhysioNet: Components of a New Research Resource for Complex Physiologic Signals*, Circulation, 2000.
2. [PennyLane Documentation](https://docs.pennylane.ai/)
3. [PyTorch Documentation](https://pytorch.org/docs/)
4. [MIT-BIH Arrhythmia Database](https://physionet.org/content/mitdb/1.0.0/)

**Project:** Q-CardioNet – A Hybrid CNN-Quantum Variational Circuit for Robust ECG Arrhythmia Classification.

---

## 13. Team Members

- Dhanyashree G Suvarna
- Inchara P Jain
- Thrupthi V Bhandary
- Pratham P Alva

**Department:** Computer Science and Engineering  
**Institution:** Sahyadri College of Engineering and Management, Mangaluru, India.
