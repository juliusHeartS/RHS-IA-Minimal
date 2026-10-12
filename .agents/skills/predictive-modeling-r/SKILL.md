---
name: predictive-modeling-r
description: Modeling and machine learning with tidymodels in R. Use when the user requests to model their data, build or fit a model, predict outcomes, or compare or tune models.
license: MIT
compatibility: Requires R with tidymodels installed.
---

# Predictive modeling with tidymodels in R

This skill explains how to carry out an iterative predictive modeling workflow using the tidymodels framework in R. You will work alongside the user to build accurate machine learning models through systematic iteration.

## Process overview

### 1. Split the data and explore the training data

- Locate the data that the user would like to model.
- Only look at the data enough to know it's clean before splitting. Do not do extensive exploration before splitting.
- Review the conversation for any prior exploration of this dataset (beyond basic summaries like `head()` or `summary()`). If extensive exploration was done on the full dataset, suggest starting a new session for modeling so that prior findings don't bias modeling decisions and wait for the user's reply. If the user prefers to continue, acknowledge the prior exploration and explain that you'll re-examine the training data after splitting.
- Split into training and test sets. After splitting, only explore and train on the training data.

Here is some example code:

```r
library(tidymodels)

set.seed(149)
split <- initial_split(df, strata = outcome_col)
train <- training(split)
test <- testing(split)
```

### 2. Identify outcome variable and predictors

- Identify the outcome variable and candidate predictors. Ask whether it is reasonable to assume that all variables other than the outcome are predictors.
- Determine the modeling mode:
  - Numeric outcome: `"regression"`
  - Factor outcome: `"classification"`
  - Character outcome: convert to factor with reasonable levels first
  - Integer outcome: use judgment about whether the problem is fundamentally regression or classification. If you are unsure, ask the user for clarification.
- In tidymodels, models do not infer the mode from the outcome type. You must convert the outcome to numeric or factor and set the mode explicitly for any model that supports both modes.

### 3. Split data into resamples

If appropriate, split the training data into resamples.

For example:

```r
folds <- vfold_cv(train, v = 10)
```

### 4. Determine metrics

Define a fixed metric set that will be used for every model in the session. Discuss the metric choice with the user before fitting the first model.

For example:

```r
# Determine metrics for the session and use these for every model
metrics <- metric_set(rmse, rsq)  # regression example
metrics_class <- metric_set(roc_auc, brier_class, accuracy)  # classification example
```

### 5. Iterative modeling

Each model follows this tidymodels pattern: write a recipe appropriate for the data, define a model specification, combine them in a workflow, and fit against resamples. Pass the same `folds` and `metrics` objects to every `fit_resamples()` or `tune_grid()` call.

**Tailor the recipe to the model and data.** Only add preprocessing steps that address a specific data characteristic you've observed or a requirement of the model type. A minimal recipe — or even just the formula with no steps — is a valid starting point.

For example:

```r
rec <- recipe(outcome ~ ., data = train) %>%
  step_dummy(all_nominal_predictors())

spec <- linear_reg()

wf <- workflow() %>%
  add_recipe(rec) %>%
  add_model(spec)

results <- fit_resamples(wf, resamples = folds, metrics = metrics)
collect_metrics(results)
```

**Start with a baseline.** Your first models should establish baseline error metrics by fitting a null model:

- For regression: `null_model(mode = "regression")`
- For 2-class classification: `null_model(mode = "classification")`
- For multi-class classification: `null_model(mode = "classification")`

**Then, build incrementally.** After reviewing the baseline result with the user, use your expertise to propose a single targeted, reasonable change to the feature engineering or the model specification and explain why you think it will be an improvement. Each new model should build on what worked before, changing one thing at a time so you can understand when additional complexity pays off. After each model, stop and discuss the results with the user before proposing the next step. For the first model after the null baseline, consider suggesting a relatively simple model.

Iteration has two levers: the model specification and the feature engineering. Rather than defaulting to more complex models to drive down errors, consider whether alternative representations of the predictors would allow for stronger fits. Feature engineering changes---transformations, interactions, derived and features, motivated by exploratory data analysis interspersed in model iteration---can be as impactful as switching model families.

**Tuning.** Use default hyperparameters for initial models. Once you've identified a promising model family, introduce tuning to optimize it. Tuning is one of the levers to pull during iteration, not a separate phase.

```r
tune_results <- tune_grid(wf, resamples = folds, metrics = metrics, grid = 10)
show_best(tune_results)
```

tidymodels supports the future framework, e.g. `library(future); plan(multisession, workers = n)` to parallelize long-running computations. Before resampling, use `parallel::detectCores()` to determine the maximum number of cores available and then ask the user if they would like to use parallel processing and, if so, how many cores to use. Keep using the extra cores throughout the work unless the user asks you to stop. When needed, read `tune::parallelism` to learn more.

Consider suggesting final evaluation when: the last 2-3 models haven't meaningfully improved performance, you've tried multiple model families and feature engineering strategies, or the user indicates they're satisfied. Suggest the transition and wait for user input, and do not decide unilaterally.

### 6. Evaluating on the test set

The test set may only be used in final model evaluation when the model development process is clearly complete. Do not touch the test set during iterative modeling. Always ask the user if it's ok to evaluate the final model on the test set and wait for their response. The reason for this is that once you use test performance to influence modeling decisions, the test set no longer provides an unbiased estimate of how the model will perform on unseen data.

Example code:

```r
final_fit <- last_fit(wf, split, metrics = metrics)
collect_metrics(final_fit)
```

## Pitfalls to avoid

Follow these guidelines to avoid common mistakes.

**Metric consistency.** Define a `metric_set()` once and pass it to every `fit_resamples()`, `tune_grid()`, and `last_fit()` call. Do not switch from RMSE to MAE, or from ROC AUC to accuracy, between models.

**Resamples consistency.** Create the resampling folds once and pass the same `folds` object to every model.

**Train/test discipline.** All exploration, feature engineering, and model fitting must use the training data only. The test set exists for one final evaluation after modeling is complete. Any earlier use contaminates it. Do not `glimpse(test)`, do not compute summaries on `test`, do not use `test` to check "how we're doing" mid-session.

**Mode setting.** Models like `decision_tree()`, `rand_forest()`, `boost_tree()`, `nearest_neighbor()`, and `svm_rbf()` support both regression and classification. Always set the mode explicitly because forgetting this can produce confusing errors or silently wrong results.

**Imputation belongs in the recipe.** Handle missing values with recipe imputation steps (e.g., `step_impute_median()`, `step_impute_knn()`, `step_impute_bag()`) rather than ad hoc fixes, so the same imputation logic applies consistently at prediction time.

**Unnecessary preprocessing.** Do not add recipe steps that aren't motivated by a specific data characteristic or model requirement. For example, normalizing predictors is unnecessary for tree-based models, and adding spline terms without evidence of nonlinearity adds complexity without benefit. Start with minimal preprocessing and add steps when the data or results tell you to.

**Outcome transformations belong outside the recipe.** Do not use `step_log()` or similar on the outcome variable inside a recipe. The outcome is not available at prediction time, so the recipe will error. Since log is not a learned transformation, it is safe to apply it to the outcome column before passing the data to `recipe()`. Note that metrics will then be on the transformed scale and cannot be compared directly to models fit on the original scale.

## Reporting results

### During training

After each model fit on the training data, present:
- The metric values with standard errors (from `collect_metrics()`)
- A brief interpretation of why the change did or didn't help compared to previous models

Once two or more models have been fit, include a running comparison table. Choose whichever metrics are most appropriate for the problem. The column names below are just examples. Mark the current best-performing model with **best**. Keep the table consistent across the session, using the same columns and model order each time you update it.


Example for a regression problem:

| # | Model | Description | RMSE | R² |
|---|---|---|---|---|
| 1 | null_model | baseline | 5.32 ± 0.24 | 0.00 ± 0.00 |
| 2 | linear_reg | normalized predictors | 3.41 ± 0.18 | 0.59 ± 0.04 |
| 3 | rand_forest | tree-based model | 2.87 ± 0.15 | 0.71 ± 0.03 **best** |

### After evaluation on the test set

Present a summary table for the final model only, comparing CV and test metrics.

Example:

| Metric | CV estimate | Test |
|---|---|---|
| RMSE | 2.87 | 2.74 |
| R² | 0.71 | 0.73 |

The user may ask to save the resulting model to disk. When saving a fitted model, save the entire workflow rather than extracting the underlying model fit. The workflow preserves the full pipeline — preprocessing and model — so predictions are reproducible.

Use the bundle package before serializing. Some model types (e.g., xgboost, keras, torch) contain non-serializable components that will silently produce incorrect predictions after a `saveRDS()` / `readRDS()` round trip without bundling.

```r
library(bundle)

final_wf <- extract_workflow(final_fit) |> bundle()
saveRDS(final_wf, "model.rds")

# Later:
final_wf <- readRDS("model.rds") |> unbundle()
predict(final_wf, new_data)
```

## Pacing

- **One model per turn.** Fit one model per response, show the results, and discuss with the user before moving on. Do not chain multiple `fit_resamples()` or `tune_grid()` calls in a single turn. The goal is not to do so much that the user can't keep up. You want the user to understand what's happening so that they can provide input, clarify assumptions, etc.
- After showing results, suggest what to try next and let the user decide. Do not automatically start the next model.

## Suggestions

Put the most recommended next step first. If there is a step you think is highly recommended and almost certain that the user should take, you can add (Recommended) after the suggestion, but use this sparingly. Tailor the specific suggestions to the data and results you have seen so far.

**After data loading / before splitting:** Write suggestions that will confirm the outcome variable and predictors, and explain that the first step will be establishing a baseline (the null model) before moving to more complex approaches.

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

- Do not include `cat()` or `print()` calls for status messages, confirmations, or narration in R code (e.g., `cat("Training set:", nrow(train), "rows\n")`). Just run the code and let the output speak for itself. Describe what you did in plain text outside the code block.
- Visualizations (in EDA, of residuals, of model fit against data, etc.) are welcome. Users are more easily able to interpret a visualization than text. If making multiple related plots in one turn, consider combining them into a single figure with a package like patchwork rather than producing separate plots (e.g., for residual plots).
- Do not print intermediate objects like model specs, workflows, or resampling objects unless strictly necessary.
