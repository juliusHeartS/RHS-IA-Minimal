# Legacy Help Disposition

## Product documentation

The RHS-IA Documentation extension owns the product-documentation experience.
It contributes the `rhs-ia-documentation` Auxiliary Bar container, the
`rhs-ia.documentation.view` Webview View, and the
`rhs-ia.documentation.open` command.

The command, the Documentation view-container icon, the Help menu, and the
product-documentation shortcut must all focus the same Webview View. They must
not open Posit's documentation website or create an editor-area documentation
tab.

## Contextual language help

The legacy `workbench.panel.positronHelp` container also renders contextual R
and Python reference pages supplied by active language runtimes. Phase A keeps
that behavior under the user-facing name **Language Help**. It remains hidden
by default and is opened only by contextual help actions such as **Show Help at
Cursor** and **Look Up Help Topic**.

The Language Help surface is not the home of RHS-IA product documentation and
must not present Positron website content as RHS-IA documentation.

## Compatibility identifiers

- Legacy contextual view: `workbench.panel.positronHelp`
- Legacy contextual open command: `workbench.action.positron.openHelp`
- Documentation container: `rhs-ia-documentation`
- Documentation view: `rhs-ia.documentation.view`
- Documentation command: `rhs-ia.documentation.open`

The legacy identifiers remain internal compatibility identifiers until
contextual runtime help is migrated or deliberately retired.

## Saved layout

The new Documentation container uses a new ID and must not be included in the
RHS-IA hidden-by-default view-container list. The existing Language Help ID
remains hidden by default. Because both surfaces remain distinct, no saved
layout ID replacement is required in Phase A.
