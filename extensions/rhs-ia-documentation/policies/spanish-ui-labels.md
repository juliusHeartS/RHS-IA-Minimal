# Spanish UI labels

Spanish documentation follows the labels actually shown by RHS-IA. It does not add a documentation-specific language selector or translate identifiers, command IDs, setting keys, paths, URLs, package names, extension IDs, or brands.

## Verified mappings

| English label | Spanish label used | Evidence |
| --- | --- | --- |
| RHS-IA Documentation | Documentación de RHS-IA | `package.nls.es.json`: `viewContainer.title`, `view.contextualTitle`; `localization/es.json`: `home` |
| Documentation | Documentación | `package.nls.es.json`: `view.title` |
| Command Palette | Paleta de comandos | `.build/extensions/ms-ceintl.vscode-language-pack-es/translations/main.i18n.json`: `vs/editor/common/standaloneStrings.quickCommandActionLabel` |
| Keyboard Shortcuts | Métodos abreviados de teclado | `.build/extensions/ms-ceintl.vscode-language-pack-es/translations/main.i18n.json`: `vs/workbench/contrib/preferences/browser/preferences.contribution.keyboardShortcuts` |
| Primary Side Bar | Barra lateral principal | `.build/extensions/ms-ceintl.vscode-language-pack-es/translations/main.i18n.json`: `vs/workbench/browser/actions/layoutActions.primary sidebar` |
| Source Control | Control de código fuente | `.build/extensions/ms-ceintl.vscode-language-pack-es/translations/main.i18n.json`: `vs/workbench/contrib/scm/browser/scm.contribution.source control` |
| Run and Debug | Ejecutar y depurar | `.build/extensions/ms-ceintl.vscode-language-pack-es/translations/main.i18n.json`: `debug.hideSlowPreLaunchWarning` |
| View | Ver | `.build/extensions/ms-ceintl.vscode-language-pack-es/translations/main.i18n.json`: `vs/platform/action/common/actionCommonCategories.view` |
| Help | Ayuda | `.build/extensions/ms-ceintl.vscode-language-pack-es/translations/main.i18n.json`: `vs/platform/action/common/actionCommonCategories.help` |
| Appearance | Apariencia | `.build/extensions/ms-ceintl.vscode-language-pack-es/translations/main.i18n.json`: `vs/workbench/contrib/preferences/browser/settingsLayout.appearance` |
| View: Open View | Ver: Abrir vista | `.build/extensions/ms-ceintl.vscode-language-pack-es/translations/main.i18n.json`: `vs/workbench/contrib/quickaccess/browser/viewQuickAccess.openView` plus the `View` category |
| Open Folder | Abrir carpeta | `.build/extensions/ms-ceintl.vscode-language-pack-es/translations/main.i18n.json`: `vs/platform/dialogs/electron-main/dialogMainService.openFolder` |
| New Folder | Nueva carpeta... | `.build/extensions/ms-ceintl.vscode-language-pack-es/translations/main.i18n.json`: `vs/workbench/contrib/files/browser/fileActions.newFolder` |
| Extensions | Extensiones | `.build/extensions/ms-ceintl.vscode-language-pack-es/translations/main.i18n.json`: `vs/workbench/contrib/extensions/browser/extensions.contribution.extensions` |
| Output | Salida | `.build/extensions/ms-ceintl.vscode-language-pack-es/translations/main.i18n.json`: `vs/workbench/contrib/output/browser/output.contribution.output` |
| Reload Window | Recargar ventana | `.build/extensions/ms-ceintl.vscode-language-pack-es/translations/main.i18n.json`: `vs/workbench/browser/actions/windowActions.reloadWindow` |
| Show Running Extensions | Mostrar extensiones en ejecución | `.build/extensions/ms-ceintl.vscode-language-pack-es/translations/main.i18n.json`: `vs/workbench/contrib/extensions/browser/abstractRuntimeExtensionsEditor.showRuntimeExtensions` |
| Format Document | Dar formato al documento | `.build/extensions/ms-ceintl.vscode-language-pack-es/translations/main.i18n.json`: `vs/editor/contrib/format/browser/formatActions.formatDocument.label` |
| Step Over | Depurar paso a paso por procedimientos | `.build/extensions/ms-ceintl.vscode-language-pack-es/translations/main.i18n.json`: `vs/workbench/contrib/debug/browser/debugCommands.stepOverDebug` |
| Step Into | Depurar paso a paso por instrucciones | `.build/extensions/ms-ceintl.vscode-language-pack-es/translations/main.i18n.json`: `vs/workbench/contrib/debug/browser/debugCommands.stepIntoDebug` |
| Step Out | Salir de la depuración | `.build/extensions/ms-ceintl.vscode-language-pack-es/translations/main.i18n.json`: `vs/workbench/contrib/debug/browser/debugCommands.stepOutDebug` |
| Continue | Continuar | `.build/extensions/ms-ceintl.vscode-language-pack-es/translations/main.i18n.json`: `vs/workbench/contrib/debug/browser/debugCommands.continueDebug` |
| Stop | Detener | `.build/extensions/ms-ceintl.vscode-language-pack-es/translations/main.i18n.json`: `vs/workbench/contrib/debug/browser/debugCommands.stop` |
| Problems | Problemas | `.build/extensions/ms-ceintl.vscode-language-pack-es/translations/main.i18n.json`: `vs/workbench/contrib/markers/browser/markers.contribution.problems` |
| Reopen Editor With | Volver a abrir el editor con... | `.build/extensions/ms-ceintl.vscode-language-pack-es/translations/main.i18n.json`: `vs/workbench/browser/parts/editor/editor.contribution.reopenWith` |

| Viewer | Visor | `src/vs/base/node/sp.positron.nls.ts`: `positron.viewer` |
| Connections | Conexiones | `src/vs/base/node/sp.positron.nls.ts`: `positron.connections`; owning `positronConnections.contribution.ts` |
| Developer | Desarrollador | Bundled `main.i18n.json`: `vs/platform/action/common/actionCommonCategories.developer`; combine with verified command titles above |

## Labels intentionally kept in English

`Auxiliary Bar` is the source/runtime term used by the workbench and has no corresponding Spanish overlay entry in the inspected language-pack JSON. `Language Help` is the user-facing title contributed by `src/vs/workbench/contrib/positronHelp/browser/positronHelp.contribution.ts` (`positron.languageHelp`) and has no Spanish overlay entry in the inspected bundle. `Data Explorer`, `Catalog Explorer`, `Remote SSH`, `Dev Containers`, `Packages`, `Plots`, `Run`, `Run App`, `Shell Command: Install 'rhs-ia' command in PATH` remain English where their owning extension or current source does not provide a verified Spanish label. `Problems`, `Format Document`, `Step Over`, `Step Into`, `Step Out`, `Continue`, `Stop`, and `Reopen Editor With` are translated as recorded above.

The evidence bundle is build-specific. If the RHS-IA language pack or an owning extension adds a Spanish translation, update this record and the documentation together.

The RHS-IA overlays `src/vs/base/node/sp.positron.nls.ts` and `sp.positron.session.nls.ts` supplement the Microsoft pack. Notebook interruption/restart are described as operations rather than introducing guessed button labels. The translated documentation label and runtime toolbar strings are provided by this extension.
