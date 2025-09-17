print(">>> Script started <<<")
import pandas as pd
import os

os.makedirs('data', exist_ok=True)

true_path = 'data/True.csv'
fake_path = 'data/Fake.csv'

if not os.path.exists(true_path):
    print("❌ File not found:", true_path)
    exit()

if not os.path.exists(fake_path):
    print("❌ File not found:", fake_path)
    exit()

print("✅ Found both CSV files")

# Load datasets
df_true = pd.read_csv(true_path)
df_fake = pd.read_csv(fake_path)
print("Loaded True.csv with", len(df_true), "rows")
print("Loaded Fake.csv with", len(df_fake), "rows")

# Add labels: 0 = real, 1 = fake
df_true["label"] = 0
df_fake["label"] = 1

# Merge title + text if available
def make_text(df):
    if "title" in df.columns and "text" in df.columns:
        return df["title"].fillna('') + " " + df["text"].fillna('')
    if "text" in df.columns:
        return df["text"].fillna('')
    if "title" in df.columns:
        return df["title"].fillna('')
    return df.astype(str).agg(" ".join, axis=1)

df_true["text"] = make_text(df_true)
df_fake["text"] = make_text(df_fake)

df_true = df_true[["text", "label"]]
df_fake = df_fake[["text", "label"]]

df = pd.concat([df_true, df_fake], ignore_index=True).sample(frac=1, random_state=42).reset_index(drop=True)

output_path = "data/train.csv"
df.to_csv(output_path, index=False)

print("✅ Saved merged dataset to", output_path)
print("Total rows:", len(df))
print(df.head())
