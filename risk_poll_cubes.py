# In this python script we connect to the sql database  where we have created 
# the risk cube tables and we poplulate them with the weighted survey data.


# %%
import mysql.connector
import sqlalchemy
from sqlalchemy import create_engine, text
from mysql.connector import Error
from getpass import getpass
import pandas as pd
import numpy as np

# %%
user = "brutalist"
password = getpass("MySQL password: ")
database = "********"

engine = create_engine(f"mysql+pymysql://{user}:{password}@localhost/{database}")

try:
    with engine.connect() as conn:
        # Wrap query in text() function
        result = conn.execute(text("SELECT '✅ Connection successful' AS status"))
        print(result.scalar())  # Fetch the first column of first row
except Exception as e:
    print(f"❌ Connection failed: {e}")


# %%
query1 = "SELECT * FROM risq_19"
query2 = "SELECT * FROM risq_21"
query3 = "SELECT * FROM risq_23"
query4 = "SELECT * FROM risq_25"

# %%
df_risk = pd.read_sql(query1, engine)

# %%
df_19 = pd.read_sql(query1, engine)
df_21 = pd.read_sql(query2, engine)
df_23 = pd.read_sql(query3, engine)
df_25 = pd.read_sql(query4, engine)

# %%
year_dfs = {2019: df_19, 2021: df_21, 2023: df_23, 2025: df_25}

# %%
metrics = [
    {"metric_name": "Greatest_Risk", "columns": {2019: "L3_A", 2021: "WP22331", 2023: "WP22331", 2025: "WP22331"}},
    {"metric_name": "Disaster5Y", "columns": {2021: "WP22245", 2023: "WP23344", 2025: "WP24213"}},
    {"metric_name": "Climate_Change", "columns": {2019: "L5", 2021: "WP20719", 2023: "WP20719", 2025: "WP20719"}},
    {"metric_name": "More_Safe", "columns": {2019: "L2", 2021: "WP20711", 2023: "WP20711"}},
    {"metric_name": "No_Income_Month", "columns": {2021: "WP22228", 2023: "WP22228", 2025: "WP22228"}},
    {"metric_name": "Government_Cares", "columns": {2021: "WP22231", 2023: "WP22231", 2025: "WP22231"}},
    {"metric_name": "Neighbors_Care", "columns": {2021: "WP22232", 2023: "WP22232", 2025: "WP22232"}},
    {"metric_name": "Worried_Food", "columns": {2019: "L6A", 2021: "WP20720", 2023: "WP20720", 2025: "WP20720"}},
    {"metric_name": "Worried_Water", "columns": {2019: "L6B", 2021: "WP20721", 2023: "WP20721", 2025: "WP20721"}},
    {"metric_name": "Worried_Crime", "columns": {2019: "L6C", 2021: "WP20722", 2023: "WP20722", 2025: "WP20722"}},
    {"metric_name": "Worried_Weather", "columns": {2019: "L6D", 2021: "WP20723", 2023: "WP20723", 2025: "WP20723"}},
    {"metric_name": "Worried_Mental", "columns": {2019: "L6G", 2021: "WP20726", 2023: "WP20726", 2025: "WP20726"}},
    {"metric_name": "Worried_Work", "columns": {2021: "WP22214", 2023: "WP22214", 2025: "WP22214"}},
    {"metric_name": "Exp2Y_Food", "columns": {2019: "L8A", 2021: "WP22442", 2023: "WP22442", 2025: "WP22442"}},
    {"metric_name": "Exp2Y_Water", "columns": {2019: "L8B", 2021: "WP22443", 2023: "WP22443", 2025: "WP22443"}},
    {"metric_name": "Exp2Y_Crime", "columns": {2019: "L8C", 2021: "WP22444", 2023: "WP22444", 2025: "WP22444"}},
    {"metric_name": "Exp2Y_Weather", "columns": {2019: "L8D", 2021: "WP22445", 2023: "WP22445", 2025: "WP22445"}},
    {"metric_name": "Exp2Y_Mental", "columns": {2019: "L8G", 2021: "WP22447", 2023: "WP22447", 2025: "WP22447"}},
    {"metric_name": "Exp2Y_Work", "columns": {2021: "WP22448", 2023: "WP22448", 2025: "WP22448"}},
    {"metric_name": "Discrim_Color", "columns": {2021: "WP22259", 2023: "WP22259", 2025: "WP22259"}},
    {"metric_name": "Discirm_Religion", "columns": {2021: "WP22260", 2023: "WP22260", 2025: "WP22260"}},
    {"metric_name": "Discrim_Ethnic", "columns": {2021: "WP22261", 2023: "WP22261", 2025: "WP22261"}},
    {"metric_name": "Discrim_Gender", "columns": {2021: "WP22262", 2023: "WP22262", 2025: "WP22262"}},
    {"metric_name": "Discrim_Disability", "columns": {2021: "WP22263", 2023: "WP22263", 2025: "WP22263"}},
    {"metric_name": "Resilience_idv", "columns": {2021: "resilience_idv", 2023: "resilience_idv", 2025: "resilience_idv"}},
    {"metric_name": "Resilience_hhl", "columns": {2021: "resilience_hhl", 2023: "resilience_hhl", 2025: "resilience_hhl"}},
    {"metric_name": "Resilience_com", "columns": {2021: "resilience_com", 2023: "resilience_com", 2025: "resilience_com"}},
    {"metric_name": "Resilience_soc", "columns": {2021: "resilience_soc", 2023: "resilience_soc", 2025: "resilience_soc"}}
]

# %%
dimensions = [
    {"dimension": "none", "column": None},
    {"dimension": "Gender", "column": "Gender"},
    {"dimension": "Age Group", "column": "AgeGroups4"},
    {"dimension": "Education", "column": "Education"},
    {"dimension": "Income Group", "column": "INCOME_5"},
    {"dimension": "Urbanicity", "column": "Urbanicity2"},
]

# %%
# First we populate the country table


# %%
def compute_country_level(df, year, metric_name, answer_col, dim_name, dim_col):
    df_valid = df[df[answer_col].notna() & df["PROJWT"].notna()]
    group_cols = ["Country"] + ([dim_col] if dim_col else [])   # capital C

    counts = (
        df_valid.groupby(group_cols + [answer_col])["PROJWT"]
        .agg(n="sum", raw_count="count")
        .reset_index()
    )
    base = (
        df_valid.groupby(group_cols)["PROJWT"]
        .agg(base_n="sum", group_raw_count="count")
        .reset_index()
    )
    merged = counts.merge(base, on=group_cols)

    merged["pct"] = merged["n"] * 100.0 / merged["base_n"]
    merged["year"] = year
    merged["metric"] = metric_name
    merged["dimension"] = dim_name
    merged["dimension_value"] = merged[dim_col] if dim_col else "none"
    merged["value_label"] = merged[answer_col]
    merged["country"] = merged["Country"]   # normalize to lowercase for the output schema
    merged["low_sample"] = merged["group_raw_count"] < 30

    return merged[["year","country","dimension","dimension_value","metric","value_label","pct","n","base_n","raw_count","group_raw_count","low_sample"]]

# %%
def compute_global_level(df, year, metric_name, answer_col, dim_name, dim_col):
    df_valid = df[df[answer_col].notna() & df["PROJWT"].notna()]
    group_cols = [dim_col] if dim_col else []

    if group_cols:
        counts = (
            df_valid.groupby(group_cols + [answer_col])["PROJWT"]
            .agg(n="sum", raw_count="count")
            .reset_index()
        )
        base = (
            df_valid.groupby(group_cols)["PROJWT"]
            .agg(base_n="sum", group_raw_count="count")
            .reset_index()
        )
        merged = counts.merge(base, on=group_cols)
    else:
        counts = (
            df_valid.groupby([answer_col])["PROJWT"]
            .agg(n="sum", raw_count="count")
            .reset_index()
        )
        counts["base_n"] = df_valid["PROJWT"].sum()
        counts["group_raw_count"] = len(df_valid)
        merged = counts

    merged["pct"] = merged["n"] * 100.0 / merged["base_n"]
    merged["year"] = year
    merged["country"] = "Global"
    merged["metric"] = metric_name
    merged["dimension"] = dim_name
    merged["dimension_value"] = merged[dim_col] if dim_col else "none"
    merged["value_label"] = merged[answer_col]
    merged["low_sample"] = merged["group_raw_count"] < 30
    
    return merged[["year","country","dimension","dimension_value","metric","value_label","pct","n","base_n","raw_count","group_raw_count","low_sample"]]

# %%
results = []
for year, df in year_dfs.items():
    for metric in metrics:
        answer_col = metric["columns"].get(year)
        if answer_col is None:
            continue  # metric missing this year — skip safely
        for dim in dimensions:
            results.append(compute_country_level(df, year, metric["metric_name"], answer_col, dim["dimension"], dim["column"]))
            results.append(compute_global_level(df, year, metric["metric_name"], answer_col, dim["dimension"], dim["column"]))

df_new = pd.concat(results, ignore_index=True)

# %%
df_new.to_sql("risk_cube_country", con=engine, if_exists="replace", index=False)

# %%
# Then we populate the global region table

# %%
def compute_region_level(df, year, metric_name, answer_col, dims):
    df_valid = df[df[answer_col].notna() & df["PROJWT"].notna()]
    dim_cols = [d["column"] for d in dims]
    group_cols = ["GlobalRegion"] + dim_cols

    counts = (
        df_valid.groupby(group_cols + [answer_col])["PROJWT"]
        .agg(n="sum", raw_count="count")
        .reset_index()
    )
    base = (
        df_valid.groupby(group_cols)["PROJWT"]
        .agg(base_n="sum", group_raw_count="count")
        .reset_index()
    )
    merged = counts.merge(base, on=group_cols)

    merged["pct"] = merged["n"] * 100.0 / merged["base_n"]
    merged["year"] = year
    merged["metric"] = metric_name
    merged["value_label"] = merged[answer_col]
    merged["region"] = merged["GlobalRegion"]
    merged["low_sample"] = merged["group_raw_count"] < 30

    for i in range(2):
        if i < len(dims):
            merged[f"dimension_{i+1}"] = dims[i]["dimension"]
            merged[f"dimension_{i+1}_value"] = merged[dims[i]["column"]]
        else:
            merged[f"dimension_{i+1}"] = "none"
            merged[f"dimension_{i+1}_value"] = "none"

    return merged[[
        "year","region","dimension_1","dimension_1_value","dimension_2","dimension_2_value",
        "metric","value_label","pct","n","base_n","raw_count","group_raw_count","low_sample"
    ]]

# %%
def compute_region_global_level(df, year, metric_name, answer_col, dims):
    df_valid = df[df[answer_col].notna() & df["PROJWT"].notna()]
    dim_cols = [d["column"] for d in dims]

    if dim_cols:
        counts = (
            df_valid.groupby(dim_cols + [answer_col])["PROJWT"]
            .agg(n="sum", raw_count="count")
            .reset_index()
        )
        base = (
            df_valid.groupby(dim_cols)["PROJWT"]
            .agg(base_n="sum", group_raw_count="count")
            .reset_index()
        )
        merged = counts.merge(base, on=dim_cols)
    else:
        counts = (
            df_valid.groupby([answer_col])["PROJWT"]
            .agg(n="sum", raw_count="count")
            .reset_index()
        )
        counts["base_n"] = df_valid["PROJWT"].sum()
        counts["group_raw_count"] = df_valid["PROJWT"].count()
        merged = counts

    merged["pct"] = merged["n"] * 100.0 / merged["base_n"]
    merged["year"] = year
    merged["metric"] = metric_name
    merged["value_label"] = merged[answer_col]
    merged["region"] = "Global"
    merged["low_sample"] = merged["group_raw_count"] < 30

    for i in range(2):
        if i < len(dims):
            merged[f"dimension_{i+1}"] = dims[i]["dimension"]
            merged[f"dimension_{i+1}_value"] = merged[dims[i]["column"]]
        else:
            merged[f"dimension_{i+1}"] = "none"
            merged[f"dimension_{i+1}_value"] = "none"

    return merged[[
        "year","region","dimension_1","dimension_1_value","dimension_2","dimension_2_value",
        "metric","value_label","pct","n","base_n","raw_count","group_raw_count","low_sample"
    ]]

# %%
combos = [[]] + [[d] for d in dimensions] + [list(pair) for pair in itertools.combinations(dimensions, 2)]

results = []
for year, df in year_dfs.items():
    for metric in metrics:
        answer_col = metric["columns"].get(year)
        if answer_col is None:
            continue
        for combo in combos:
            results.append(compute_region_level(df, year, metric["metric_name"], answer_col, combo))
            results.append(compute_region_global_level(df, year, metric["metric_name"], answer_col, combo))

df_region_new = pd.concat(results, ignore_index=True)

# %%
df_region_new.to_sql("risk_cube_glr", con=engine, if_exists="replace", index=False)



