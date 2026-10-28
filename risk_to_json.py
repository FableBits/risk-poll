# This script exports data from MySQL tables to JSON files, organized by metric and place.


# %%
import mysql.connector
import sqlalchemy
from sqlalchemy import create_engine, text
from mysql.connector import Error
from getpass import getpass
import pandas as pd
import numpy as np
import itertools
import os
import json

# %%
user = "*******"
password = getpass("MySQL password: ")
database = "*******"

engine = create_engine(f"mysql+pymysql://{user}:{password}@localhost/{database}")

try:
    with engine.connect() as conn:
        # Wrap query in text() function
        result = conn.execute(text("SELECT '✅ Connection successful' AS status"))
        print(result.scalar())  # Fetch the first column of first row
except Exception as e:
    print(f"❌ Connection failed: {e}")

# %%
query1 = "SELECT * FROM risk_cube_country"
query2 = "SELECT * FROM risk_cube_glr"

# %%
df_country = pd.read_sql(query1, engine)
df_glregion = pd.read_sql(query2, engine)

# %%
OUTPUT_BASE = "data"
SIZE_LIMIT_KB = 100  # if a metric+place file exceeds this, split further by year

country_cols = ["year", "dimension", "dimension_value", "value_label", "pct", "low_sample"]
glregion_cols = ["year", "dimension_1", "dimension_1_value", "dimension_2", "dimension_2_value", "value_label", "pct", "low_sample"]

def write_json(records, path):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(records, f, ensure_ascii=False, separators=(",", ":"))
    return os.path.getsize(path) / 1024  # KB

def export_by_metric_and_place(df, cols, place_col, subfolder):
    base_folder = os.path.join(OUTPUT_BASE, subfolder)
    os.makedirs(base_folder, exist_ok=True)

    metrics = df["metric"].unique()
    print(f"Exporting {len(metrics)} metrics into {base_folder}/ ...")

    oversized = []

    for metric in metrics:
        metric_folder = os.path.join(base_folder, metric)
        os.makedirs(metric_folder, exist_ok=True)

        metric_df = df[df["metric"] == metric]
        places = metric_df[place_col].unique()

        for place in places:
            subset = metric_df.loc[metric_df[place_col] == place, cols]
            records = subset.to_dict(orient="records")

            safe_place = str(place).replace("/", "-").strip()
            file_path = os.path.join(metric_folder, f"{safe_place}.json")
            size_kb = write_json(records, file_path)

            if size_kb > SIZE_LIMIT_KB:
                oversized.append((metric, place, size_kb))

        print(f"  {metric}: {len(places)} place files written")

    print(f"Done: {subfolder}\n")
    return oversized


def split_oversized_by_year(df, cols, place_col, subfolder, oversized_list):
    base_folder = os.path.join(OUTPUT_BASE, subfolder)

    print(f"Splitting {len(oversized_list)} oversized files further by year...")
    for metric, place, old_size in oversized_list:
        metric_folder = os.path.join(base_folder, metric)
        safe_place = str(place).replace("/", "-").strip()

        # remove the old, too-big single file for this place
        old_file = os.path.join(metric_folder, f"{safe_place}.json")
        if os.path.exists(old_file):
            os.remove(old_file)

        place_folder = os.path.join(metric_folder, safe_place)
        os.makedirs(place_folder, exist_ok=True)

        subset_all_years = df[(df["metric"] == metric) & (df[place_col] == place)]
        years = subset_all_years["year"].unique()

        for year in years:
            year_subset = subset_all_years.loc[subset_all_years["year"] == year, cols]
            records = year_subset.to_dict(orient="records")
            file_path = os.path.join(place_folder, f"{year}.json")
            write_json(records, file_path)

        print(f"  {metric}/{safe_place}: split into {len(years)} year files (was {old_size:.1f} KB)")

    print("Done splitting oversized files.\n")


# --- Run for country ---
oversized_country = export_by_metric_and_place(df_country, country_cols, "country", "country")
if oversized_country:
    split_oversized_by_year(df_country, country_cols, "country", "country", oversized_country)

# --- Run for glregion ---
oversized_glregion = export_by_metric_and_place(df_glregion, glregion_cols, "region", "glregion")
if oversized_glregion:
    split_oversized_by_year(df_glregion, glregion_cols, "region", "glregion", oversized_glregion)

print("All exports complete.")
print(f"Oversized country files handled: {len(oversized_country)}")
print(f"Oversized region files handled: {len(oversized_glregion)}")

# %%
def folder_stats(base):
    total_files = 0
    total_size = 0
    for root, dirs, files in os.walk(base):
        for f in files:
            if f.endswith(".json"):
                total_files += 1
                total_size += os.path.getsize(os.path.join(root, f))
    return total_files, total_size / (1024 * 1024)  # MB

for folder in ["data/country", "data/glregion"]:
    count, size_mb = folder_stats(folder)
    print(f"{folder}: {count} files, {size_mb:.1f} MB total")

# %%
def remove_flat_json_files(base):
    removed = []
    for entry in os.listdir(base):
        full_path = os.path.join(base, entry)
        if os.path.isfile(full_path) and entry.endswith(".json"):
            os.remove(full_path)
            removed.append(entry)
    return removed

removed_country = remove_flat_json_files("data/country")
removed_glregion = remove_flat_json_files("data/glregion")

print(f"Removed {len(removed_country)} old flat files from data/country: {removed_country}")
print(f"Removed {len(removed_glregion)} old flat files from data/glregion: {removed_glregion}")

# %%
def biggest_files(base, top_n=10):
    sizes = []
    for root, dirs, files in os.walk(base):
        for f in files:
            if f.endswith(".json"):
                path = os.path.join(root, f)
                sizes.append((os.path.getsize(path), path))
    sizes.sort(reverse=True)
    for size, path in sizes[:top_n]:
        print(f"{size/1024:.1f} KB  {path}")

print("Largest country files:")
biggest_files("data/country")
print("\nLargest region files:")
biggest_files("data/glregion")

# %%
OUTPUT_BASE = "data"
SIZE_LIMIT_KB = 100

glregion_cols = ["dimension_2", "dimension_2_value", "value_label", "pct", "low_sample"]

def write_json(records, path):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(records, f, ensure_ascii=False, separators=(",", ":"))
    return os.path.getsize(path) / 1024

def export_glregion_deep(df, subfolder="glregion"):
    base_folder = os.path.join(OUTPUT_BASE, subfolder)

    # clean out old glregion export entirely before rebuilding
    if os.path.exists(base_folder):
        import shutil
        shutil.rmtree(base_folder)
    os.makedirs(base_folder, exist_ok=True)

    metrics = df["metric"].unique()
    still_oversized = []

    for metric in metrics:
        metric_df = df[df["metric"] == metric]
        regions = metric_df["region"].unique()

        for region in regions:
            safe_region = str(region).replace("/", "-").strip()
            region_df = metric_df[metric_df["region"] == region]
            years = region_df["year"].unique()

            for year in years:
                year_df = region_df[region_df["year"] == year]
                dim1_values = year_df["dimension_1"].unique()

                for dim1 in dim1_values:
                    safe_dim1 = str(dim1).replace("/", "-").strip()
                    subset = year_df.loc[year_df["dimension_1"] == dim1, glregion_cols]
                    records = subset.to_dict(orient="records")

                    folder = os.path.join(base_folder, metric, safe_region, str(year))
                    os.makedirs(folder, exist_ok=True)
                    file_path = os.path.join(folder, f"{safe_dim1}.json")
                    size_kb = write_json(records, file_path)

                    if size_kb > SIZE_LIMIT_KB:
                        still_oversized.append((metric, region, year, dim1, size_kb))

        print(f"{metric}: done ({len(regions)} regions)")

    return still_oversized


oversized = export_glregion_deep(df_glregion)
print(f"\nTotal files still over {SIZE_LIMIT_KB} KB after dimension_1 split: {len(oversized)}")
for row in oversized[:20]:
    print(row)



