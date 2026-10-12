---
name: report
description: Create Quarto documents or Jupyter notebooks from conversations. Use when users requests a report, Quarto document, or notebook export based on the details of the current conversation.
license: MIT
---

# Creating reports

The user may ask you to create a report. This will take the form of a Quarto document or Jupyter notebook.

If the user asks you to create a Quarto document or Jupyter notebook from the conversation, use the <REPORT></REPORT> tag to emit the document, as described below. DO NOT use the `documentCreate` tool to create the document, unless specifically asked to use it.

1. First, make sure you know how to load all of the data that you plan to use for the analysis. If your analysis depends on data that was loaded by the user into the R session, not by your code, you must ask the user to tell you how the report should load that data.
2. Second, respond to the user with a proposed report outline so they have a chance to review and edit it. Ask the user to confirm the outline before continuing.
3. Once an outline is agreed upon, create the report by emitting the document in special <REPORT FORMAT="quarto" FILENAME="xxx.qmd"></REPORT> or <REPORT FORMAT="jupyter" FILENAME="xxx.ipynb"></REPORT> tags, but replace the "xxx" with a filename of your choice.

## Format selection

* If the user asked for a Quarto report, use <REPORT FORMAT="quarto"></REPORT> tags.
* If the user asked for a Jupyter notebook, use <REPORT FORMAT="jupyter"></REPORT> tags, and send the content as Markdown, with code in triple-backtick code blocks. Do not include output cells; the user will run the notebook to compute those.

## AI disclaimer

Always include the following AI disclaimer in a callout at the top of the report.

### Quarto disclaimer

::: {.callout-note}
This report was generated using AI under general human direction. At the time of generation, the contents have not been comprehensively reviewed by a human analyst.

<!--
To indicate human review: Delete the line above about contents not being reviewed, and replace this comment with:
The contents have been reviewed and validated by [Your Name], [Your Role] on [Date].
-->
:::

### Jupyter disclaimer

**This report was generated using AI under general human direction. At the time of generation, the contents have not been comprehensively reviewed by a human analyst.**

To indicate human review: Delete the line above about contents not being reviewed, and replace this comment with:
The contents have been reviewed and validated by [Your Name], [Your Role] on [Date].

## Narrative

* When writing prose, never interpret the output of code that you haven't already run. If you haven't previously run the code in the conversation, you can either run the code to check the output or leave it uninterpreted with a comment for the user to add their interpretation. You shouldn't interpret code that you haven't seen the output of in case the output is unexpected.
* The headings should follow a hierarchical order, i.e., start with H1 (denoted with `#`), then H2 (denoted with `##`), and so on. Do not jump from an H1 to an H3 to achieve a smaller font size.
* The headings should be capitalized using "Sentence case", not "Title Case", unless the user specifically asks for "Title Case".
* Always leave an empty line between headings and the following content as well as before and after code cells and fenced divs (e.g., callout blocks, tabsets, etc.).
* When possible, data-derived numbers that appear in the Markdown sections of Quarto documents should be written as `{r}` or `{python}` expressions (e.g., `{r} mean(x)` or `{python} mean(x)`) rather than hard-coded, for reproducibility.
* Inline code expressions can only reference objects that have already been defined in a preceding code cell. Do not use inline expressions that reference data before the code cell that loads or computes that data. For example, do not write an introduction paragraph with `{r} nrow(df)` before the `load-data` code cell that defines `df`.

## Code cells

### Terminology

Use the term "code cell" instead of "code chunk" when referring to executable code cells in Quarto documents and in Jupyter notebooks, e.g.,

```{r}
# This is a code cell with R code
```

```{python}
# This is a code cell with Python code
```

### Labels

* Label all code cells with a short label that is descriptive of what the code in the cell does.
* Do not leave spaces in code cell labels, use dashes to separate words.
* Do not repeat code cell labels in a Quarto document or a Jupyter notebook.

### Loading packages and data

* IMPORTANT: The report will be generated using a clean R or Python session with no data or packages loaded.
* Make sure to include code to load necessary packages in a code cell labelled `load-packages` and the data in a code cell labelled `load-data`. These code cells should be near the top of the report, before any code cells that use the packages and the data.
* IMPORTANT: If you do not know how to load the data, ask the user to tell you how to load it before you create the report.
* If adding new code that uses a function from a package that is not already loaded, make sure to load the package in the `load-packages` code cell.

### Code cell options

* Assume that the user would like code cells to be shown by default.
* Do not set `message: false` or `warning: false` unless requested by the user.

### Examples

#### R example

Bad: Using the data without code to load the data, using a single code cell for multiple tasks, not labelling code cells.

```{r}
library(tidyverse)
summary(df)
```

Bad: Using inline expressions before the code cell that loads the data. This will fail because `df` is not yet defined when the inline expression is evaluated.

````markdown
# Introduction

The dataset contains `{r} nrow(df)` observations and `{r} ncol(df)` variables.

```{r}
#| label: load-data
df <- read_csv("my_data.csv")
```
````

Good: Code to load the data before using it, using separate code cells for separate tasks, labelling code cells. Inline expressions appear only after the code cell that defines the referenced objects.

```{r}
#| label: load-packages
library(tidyverse)
```

```{r}
#| label: load-data
df <- read_csv("my_data.csv")
```

The dataset contains `{r} nrow(df)` observations and `{r} ncol(df)` variables.

```{r}
#| label: summarize-data
summary(df)
```

#### Python example

```{python}
import polars as pl

# Load data
df = pl.read_csv("data.csv")
```

# Generating the report

As you prepare to generate the report, tell the user that it might take a while.
