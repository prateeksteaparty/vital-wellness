import pandas as pd

def sanitize_dataset():
    try:
        # Load the raw dataset
        df = pd.read_csv("vital_data.csv")
        print(f"Loaded {len(df)} rows from vital_data.csv.")
        
        # 1. Normalize column headers to lowercase and strip whitespace
        df.columns = df.columns.str.strip().str.lower()
        
        # 2. Standardize categorical and metadata columns
        meta_cols = ['diet_compatibility', 'lifestyle_tags', 'age_group_tags', 'gender_tags']
        for col in meta_cols:
            if col in df.columns:
                # Lowercase, strip internal whitespace surrounding pipes, and fill missing values
                df[col] = df[col].fillna('all').astype(str).str.lower()
                df[col] = df[col].apply(lambda x: "|".join([t.strip() for t in x.split("|")]))
        
        # 3. Standardize text fields for clean tokenization
        text_cols = ['name', 'symptom_keywords', 'cause_tags', 'description', 'food_sources']
        for col in text_cols:
            if col in df.columns:
                df[col] = df[col].fillna('').astype(str).str.strip()
                
        # 4. Save the cleaned data back, overwriting the original safely
        df.to_csv("vital_data.csv", index=False)
        print("Success! vital_data.csv successfully sanitized and formatted for production!")
        
    except FileNotFoundError:
        print("Error: Could not find 'vital_data.csv' in this directory. Make sure the script is in the same folder as the CSV.")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

if __name__ == "__main__":
    sanitize_dataset()