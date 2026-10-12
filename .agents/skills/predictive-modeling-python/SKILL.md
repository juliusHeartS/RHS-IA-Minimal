---
name: predictive-modeling-python
description: Modeling and machine learning with scikit-learn in Python. Use when the user requests to model their data, build or fit a model, predict outcomes, or compare or tune models.
license: MIT
compatibility: Requires Python with scikit-learn >= 1.4 installed.
---

# Predictive modeling with scikit-learn in Python

This skill covers iterative predictive modeling on tabular, i.i.d. data using scikit-learn in Python. For time-series, grouped, or text-heavy problems, adapt the workflow accordingly (e.g., `TimeSeriesSplit`, `GroupKFold`).

## Process overview

### 1. Split the data and explore the training data

- Locate the data that the user would like to model.
- Only look at the data enough to know it's clean before splitting. Do not do extensive exploration before splitting.
- Review the conversation for any prior exploration of this dataset (beyond basic summaries like `.head()` or `.describe()`). If extensive exploration was done on the full dataset, suggest starting a new session for modeling so that prior findings don't bias modeling decisions and wait for the user's reply. If the user prefers to continue, acknowledge the prior exploration and explain that you'll re-examine the training data after splitting.
- Split into training and test sets. After splitting, only explore and train on the training data.

Here is some example code:

```python
import sklearn
from sklearn.model_selection import train_test_split

sklearn.set_config(transform_output="pandas")

X = df.drop(columns=["outcome_col"])
y = df["outcome_col"]

# For regression:
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# For classification (preserves class proportions):
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
```

Call `sklearn.set_config(transform_output="pandas")` at the start so pipeline steps preserve column names.

### 2. Identify outcome variable and predictors

- Identify the outcome variable and candidate predictors. Ask whether it is reasonable to assume that all columns other than the outcome are predictors.
- Determine the modeling task:
  - Numeric outcome: regression
  - Categorical or binary outcome: classification
  - If ambiguous (e.g., integer outcome with few unique values), ask the user for clarification.

### 3. Set up cross-validation

Create a cross-validation object and reuse it for every model in the session.

For example:

```python
from sklearn.model_selection import KFold, StratifiedKFold

# For regression
cv = KFold(n_splits=10, shuffle=True, random_state=1)

# For classification (preserves class proportions in each fold)
cv = StratifiedKFold(n_splits=10, shuffle=True, random_state=1)
```

### 4. Determine metrics

Define a fixed scoring dictionary that will be used for every model in the session. Discuss the metric choice with the user before fitting the first model.

For example:

```python
# Determine metrics for the session and use these for every model
scoring = {
    "rmse": "neg_root_mean_squared_error",
    "r2": "r2",
}

# Binary classification example
scoring = {
    "roc_auc": "roc_auc",
    "accuracy": "accuracy",
}

# For multiclass, use "roc_auc_ovr" or "roc_auc_ovo" instead of "roc_auc"
```

Always define scoring explicitly. Do not rely on an estimator's default `.score()` method, which varies by estimator type and can be misleading.

### 5. Iterative modeling

Each model follows this scikit-learn pattern: build a `Pipeline` with a `ColumnTransformer` for preprocessing and an estimator, evaluate with `cross_validate`, and collect results. Pass the same `cv` and `scoring` objects to every `cross_validate` call.

**Always put preprocessing inside the pipeline.** Never fit a scaler, encoder, or imputer outside the pipeline — this is the most common source of data leakage in scikit-learn workflows.

For example:

```python
from sklearn.compose import ColumnTransformer, make_column_selector
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import cross_validate

preprocessor = ColumnTransformer([
    ("num", Pipeline([
        ("imputer", SimpleImputer(strategy="median")),
        ("scaler", StandardScaler()),
    ]), make_column_selector(dtype_include="number")),
    ("cat", Pipeline([
        ("imputer", SimpleImputer(strategy="most_frequent")),
        ("encoder", OneHotEncoder(handle_unknown="ignore", sparse_output=False)),
    ]), make_column_selector(dtype_exclude="number")),
])

pipe = Pipeline([
    ("preprocessor", preprocessor),
    ("model", LinearRegression()),
])

results = cross_validate(pipe, X_train, y_train, cv=cv, scoring=scoring)
```

Do not call `.values` or `.to_numpy()` on the DataFrame before passing it to the pipeline — this strips column names and breaks `ColumnTransformer` column selection.

**Start with a baseline.** Your first model should establish baseline metrics by fitting a dummy model:

- For regression: `DummyRegressor(strategy="mean")`
- For classification: `DummyClassifier(strategy="most_frequent")`

```python
from sklearn.dummy import DummyRegressor

pipe = Pipeline([
    ("model", DummyRegressor(strategy="mean")),
])

results = cross_validate(pipe, X_train, y_train, cv=cv, scoring=scoring)
```

**Then, build incrementally.** After reviewing the baseline result with the user, use your expertise to propose a single targeted, reasonable change to the feature engineering or the model specification and explain why you think it will be an improvement. Each new model should build on what worked before, changing one thing at a time so you can understand when additional complexity pays off. After each model, stop and discuss the results with the user before proposing the next step. For the first model after the baseline, consider suggesting a relatively simple model.

Iteration has two levers: the model specification and the feature engineering. Rather than defaulting to more complex models to drive down errors, consider whether alternative representations of the predictors would allow for stronger fits. Feature engineering changes — transformations, interactions, derived features, motivated by exploratory data analysis interspersed in model iteration — can be as impactful as switching model families.

**Tuning.** Use default hyperparameters for initial models. Once you've identified a promising model family, introduce tuning to optimize it. Tuning is one of the levers to pull during iteration, not a separate phase. Set `refit` to the session's primary metric so that the best model is selected on the same metric used throughout.

```python
from sklearn.model_selection import RandomizedSearchCV
from scipy.stats import randint, uniform

param_distributions = {
    "model__max_iter": randint(100, 500),
    "model__max_depth": randint(3, 10),
    "model__learning_rate": uniform(0.01, 0.3),
}

search = RandomizedSearchCV(
    pipe, param_distributions, n_iter=20,
    cv=cv, scoring=scoring, refit=primary_metric, random_state=42,
)
search.fit(X_train, y_train)
```

Prefer `RandomizedSearchCV` over `GridSearchCV` as a starting point — it explores the hyperparameter space more efficiently.

scikit-learn supports parallelism via the `n_jobs` parameter. Before the first long-running computation, use `os.cpu_count()` to determine the maximum number of cores available and ask the user if they would like to use parallel processing. Keep using the extra cores throughout the work unless the user asks you to stop.

Consider suggesting final evaluation when: the last 2–3 models haven't meaningfully improved performance, you've tried multiple model families and feature engineering strategies, or the user indicates they're satisfied. Suggest the transition and wait for user input.

### 6. Evaluating on the test set

The test set may only be used in final model evaluation when the model development process is clearly complete. Do not touch the test set during iterative modeling. Always ask the user if it's ok to evaluate the final model on the test set and wait for their response. The reason for this is that once you use test performance to influence modeling decisions, the test set no longer provides an unbiased estimate of how the model will perform on unseen data.

Example code:

```python
from sklearn.metrics import root_mean_squared_error, r2_score

pipe.fit(X_train, y_train)
y_pred = pipe.predict(X_test)

print(root_mean_squared_error(y_test, y_pred))
print(r2_score(y_test, y_pred))
```

## Pitfalls to avoid

**Metric consistency.** Define a `scoring` dictionary once and pass it to every `cross_validate`, `GridSearchCV`, `RandomizedSearchCV`, or manual evaluation call. Do not switch from RMSE to MAE, or from ROC AUC to accuracy, between models.

**CV consistency.** Create the cross-validation object once and pass the same `cv` object to every model.

**Train/test discipline.** All exploration, feature engineering, and model fitting must use the training data only. The test set exists for one final evaluation after modeling is complete. Any earlier use contaminates it. Do not call `.describe()` on `X_test`, do not compute summaries on the test data, do not use the test set to check "how we're doing" mid-session.

**Preprocessing inside the pipeline.** Never fit a scaler, encoder, or imputer outside the pipeline. This leaks information from validation folds into training and produces optimistic CV estimates.

**Unnecessary preprocessing.** Do not add preprocessing steps that aren't motivated by a specific data characteristic or model requirement. For example, scaling is unnecessary for tree-based models, and adding polynomial features without evidence of nonlinearity adds complexity without benefit. Start with minimal preprocessing and add steps when the data or results tell you to.

**Target transformations.** Do not manually transform `y` (e.g., `np.log(y)`) and forget to inverse-transform predictions. Use `TransformedTargetRegressor` to wrap the pipeline so that the transformation and its inverse are applied automatically:

```python
from sklearn.compose import TransformedTargetRegressor
import numpy as np

model = TransformedTargetRegressor(
    regressor=pipe,
    func=np.log1p,
    inverse_func=np.expm1,
)
```

Note that metrics will then be on the original scale (because the inverse transform is applied before scoring), which is what you want.

**Negative scoring convention.** Scikit-learn scorers like `"neg_root_mean_squared_error"` return negative values because scikit-learn maximizes internally. When reporting metrics to the user, negate them (e.g., `-results["test_rmse"].mean()`).

## Reporting results

### During training

After each model fit on the training data, present:
- The metric values with standard deviations (from `cross_validate` results)
- A brief interpretation of why the change did or didn't help compared to previous models

Once two or more models have been fit, include a running comparison table. Choose whichever metrics are most appropriate for the problem. The column names below are just examples. Mark the current best-performing model with **best**. Keep the table consistent across the session, using the same columns and model order each time you update it.

Example for a regression problem:

| # | Model | Description | RMSE | R² |
|---|---|---|---|---|
| 1 | DummyRegressor | baseline | 5.32 ± 0.24 | 0.00 ± 0.00 |
| 2 | LinearRegression | scaled predictors | 3.41 ± 0.18 | 0.59 ± 0.04 |
| 3 | HistGradientBoostingRegressor | default hyperparameters | 2.87 ± 0.15 | 0.71 ± 0.03 **best** |

### After evaluation on the test set

Present a summary table for the final model only, comparing CV and test metrics.

Example:

| Metric | CV estimate | Test |
|---|---|---|
| RMSE | 2.87 | 2.74 |
| R² | 0.71 | 0.73 |

The user may ask to save the resulting model to disk. When saving a fitted model, save the entire pipeline rather than extracting the underlying estimator. The pipeline preserves the full workflow — preprocessing and model — so predictions are reproducible.

```python
import joblib

# If tuning was used, save the best pipeline from the search:
joblib.dump(search.best_estimator_, "model.joblib")

# If no tuning, save the fitted pipeline directly:
pipe.fit(X_train, y_train)
joblib.dump(pipe, "model.joblib")

# Later:
model = joblib.load("model.joblib")
model.predict(new_data)
```

Note that pipelines saved with one scikit-learn version may not load cleanly in another. If the user needs long-term persistence, suggest pinning the scikit-learn version in their environment.

## Pacing

- **One model per turn.** Fit one model per response, show the results, and discuss with the user before moving on. Do not chain multiple `cross_validate` or tuning calls in a single turn. The goal is not to do so much that the user can't keep up. You want the user to understand what's happening so that they can provide input, clarify assumptions, etc.
- After showing results, suggest what to try next and let the user decide. Do not automatically start the next model.

## Suggestions

Put the most recommended next step first. If there is a step you think is highly recommended and almost certain that the user should take, you can add (Recommended) after the suggestion, but use this sparingly. Tailor the specific suggestions to the data and results you have seen so far.

**After data loading / before splitting:** Write suggestions that will confirm the outcome variable and predictors, and explain that the first step will be establishing a baseline (the dummy model) before moving to more complex approaches.

**After baselines:** Suggest a specific next modeling direction based on what the data looks like. Use your own expertise, understanding of the data, and results from the baseline models to craft these suggestions.

**After several models (3+):** Start suggesting strategies the user might not think of — revisiting EDA, interaction terms, or transformations. For example: "Revisit the training data to look for feature engineering opportunities" or "Check for correlated errors in our model's predictions"

**After evaluation on the test set:** Provide suggested next steps, like visualizing model predictions or creating a way to share or deploy the model.

### When performance plateaus

When performance plateaus, suggest more aggressive changes or wrapping up. For example: "Try a fundamentally different model type" or "The current best model looks solid. Evaluate on the test set."

- Examine predictor correlations and consider removing or combining redundant predictors.
- Explore interaction terms between the strongest predictors.
- Add polynomial features to capture nonlinear relationships.
- Look for outliers that might benefit from robust preprocessing or removal.
- Consider dimensionality reduction (e.g., PCA) when multicollinearity is present.
- Check for skewed distributions in predictors and apply transformations.
- Examine the outcome distribution and consider whether a transformation reduces error.
- Try a different preprocessing workflow.

## Communication with the user

- Do not include `print()` calls for status messages, confirmations, or narration in Python code (e.g., `print("Training set:", len(X_train), "rows")`). Just run the code and let the output speak for itself. Describe what you did in plain text outside the code block.
- Visualizations (in EDA, of residuals, of model fit against data, etc.) are welcome. Users are more easily able to interpret a visualization than text. If making multiple related plots in one turn, consider combining them into a single figure with subplots rather than producing separate plots (e.g., for residual plots).
- Do not print intermediate objects like pipeline representations or CV result dictionaries unless strictly necessary.
