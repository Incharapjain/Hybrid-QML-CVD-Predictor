import wfdb
import numpy as np
import os

# Get the absolute path of the directory this script is in
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Point directly to your local datasets folder structure where the files exist
# (This maps to: backend/../datasets/mitdb/100)
record_path = os.path.join(BASE_DIR, "datasets", "mitdb", "100")

print(f"🔄 Attempting to read clinical profile from: {record_path}")

try:
    # Read a 180-sample heartbeat segment from your target dataset file
    record = wfdb.rdrecord(record_path, sampfrom=0, sampto=180)
    ecg_signal = record.p_signal[:, 0] # Extract Lead MLII

    # Save as a standard plain text file in the root folder
    output_path = os.path.join(BASE_DIR, "patient_ecg_sample.txt")
    np.savetxt(output_path, ecg_signal, fmt='%.4f', delimiter=',')
    print(f"✅ Conversion complete! '{output_path}' is ready to upload.")

except FileNotFoundError:
    print(f"❌ Error: Could not find the dataset files at '{record_path}'.")
    print("👉 Please verify that both '100.dat' and '100.hea' are present in your datasets/mitdb/ folder.")