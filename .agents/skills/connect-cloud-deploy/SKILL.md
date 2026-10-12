---
name: connect-cloud-deploy
description: Deploys applications and documents to Posit Connect Cloud using the rsconnect R package. Supports Shiny apps, Quarto documents, R Markdown, Streamlit, Dash, Bokeh, and Jupyter notebooks. Use when users want to deploy, publish, or share content to Connect Cloud, or when they mention rsconnect, deployApp, connectCloudUser, or Posit Connect Cloud.
compatibility: Requires R and the rsconnect package.
metadata:
  author: posit-pbc
  version: "1.0"
---

# Deploying to Posit Connect Cloud

Use this guide to support users in deploying applications and data documents to **Posit Connect Cloud** via the `rsconnect` R package.

## Supported Content Types

* **R-based:** Shiny, Quarto, R Markdown
* **Python-based:** Streamlit, Dash, Bokeh, Quarto, Jupyter Notebooks

## Deployment Workflow (R/RStudio)

### 1. Environment Setup

The user must first install the `rsconnect` package to bridge their local IDE with the cloud service.

**Installation (user must run this themselves):**
```r
install.packages("rsconnect")
```

### 2. Authentication & Synchronization

Users need to link their local environment to their Posit Connect Cloud account.

**Check for existing accounts:**
```r
library(rsconnect)
accounts <- rsconnect::accounts()

if (nrow(accounts) > 0) {
  cat("✓ Account(s) linked:\n")
  print(accounts)
} else {
  cat("✗ No accounts linked\n")
  cat("Please run: rsconnect::connectCloudUser() to authenticate\n")
}
```

**If no account is linked, user must authenticate:**
- Command: `rsconnect::connectCloudUser()`
- Action: This opens a browser window for authorization
- Verification: Run `rsconnect::accounts()` to confirm the account is linked

### 3. Deployment

Deployment depends on the project structure.

**Example Directory Structure:**
```text
/MyProject/
├── Dashboard/
│   └── app.R
└── other_code.R
```

**Deployment Commands:**

For an app in a specific folder:
```r
rsconnect::deployApp(
  appDir = "Dashboard",
  appTitle = "My App Name",  # Optional but recommended
  launch.browser = TRUE       # Opens browser when complete
)
```

For deployment from the current working directory:
```r
rsconnect::deployApp(
  appTitle = "My App Name",
  launch.browser = TRUE
)
```

For deployment with absolute path:
```r
rsconnect::deployApp(
  appDir = "/full/path/to/project",
  appTitle = "My App Name",
  launch.browser = TRUE
)
```

**Note:** If multiple accounts are linked, the user will be prompted to select one.

### 4. Post-Deployment

* **Success:** The browser will automatically open to the content's **administration page** on Connect Cloud
* **Failure:** Direct the user to review the logs and error messages printed in the R console

## Common Issues and Solutions

### Absolute Paths Warning
If deployment shows warnings about absolute paths:
- These are files detected with hard-coded absolute paths
- They won't prevent deployment but should be converted to relative paths
- Use paths relative to the project directory instead

### Dependencies
- `rsconnect` automatically detects R package dependencies from your code
- The deployment bundle will include a snapshot of required package versions
- No need to manually specify dependencies in most cases

## Key Functions Reference

| Function | Purpose |
|----------|---------|
| `connectCloudUser()` | Authenticates the user via browser |
| `accounts()` | Lists all configured accounts |
| `deployApp()` | Deploys a directory containing an app (Shiny, Dash, etc.) |
| `deployDoc()` | Deploys a single document (Rmd, Quarto, etc.) |
| `deploySite()` | Deploys a full website (Rmarkdown/Quarto sites) |
| `removeAccount()` | Removes a stored account from the local machine |

## Deployment Checklist

When helping users deploy, follow these steps in order:

1. Check if `rsconnect` is installed
2. Verify account is linked with `rsconnect::accounts()`
3. Determine correct `appDir` path (or use current directory)
4. Set a meaningful `appTitle`
5. Run `rsconnect::deployApp()` with appropriate parameters
6. Monitor console output for errors
7. Confirm browser opens to admin page on success

## Additional Resources

For more advanced configurations, users should refer to the [official rsconnect documentation](https://rstudio.github.io/rsconnect/).
