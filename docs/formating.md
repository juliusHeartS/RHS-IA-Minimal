# Formatting and Indentation Rules for Agents

<RULE>
## Strict Tab Indentation
The RHS-IA fork inherits a strict precommit `hygiene` check that enforces formatting before a commit is processed.

**CRITICAL:** You MUST use **tabs (`\t`)** instead of **spaces** for indentation across all core files, specifically:
- CSS (`.css`)
- TypeScript / TSX (`.ts`, `.tsx`)
- JavaScript / JSX (`.js`, `.jsx`)

### Why?
Using spaces for indentation anywhere in a file will immediately abort the user's `git commit` process, throwing a fatal `Bad whitespace indentation` error from the `precommit` hygiene hook. 

Always double-check that your output uses hard tabs (`\t`) rather than formatting with 2 or 4 spaces!
</RULE>
