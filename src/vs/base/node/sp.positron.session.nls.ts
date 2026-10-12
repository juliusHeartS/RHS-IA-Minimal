/*---------------------------------------------------------------------------------------------
 *  Copyright (C) 2026 Posit Software, PBC. All rights reserved.
 *  Licensed under the Elastic License 2.0. See LICENSE.txt for license information.
 *--------------------------------------------------------------------------------------------*/

export const positronSessionNlsData: Record<string, Record<string, string>> = {
	'vs/platform/positronActionBar/browser/components/actionBarFilter': {
		'positronFilterPlaceholder': 'Filtrar',
		'positronClearFilter': 'Limpiar filtro',
		'positronFilterOptions': 'Opciones de filtro'
	},
	'vs/workbench/contrib/positronConsole/browser/components/actionBar': {
		'positronConsoleState.Starting': 'Iniciando',
		'positronConsoleState.Interrupting': 'Interrumpiendo',
		'positronConsoleState.ShuttingDown': 'Cerrando',
		'positronConsoleState.Restarting': 'Reiniciando',
		'positronConsoleState.Reconnecting': 'Reconectando',
		// allow-any-unicode-next-line
		'positronInterruptExecution': 'Interrumpir ejecución',
		'positronToggleTrace': 'Mostrar u ocultar seguimiento',
		// allow-any-unicode-next-line
		'positronToggleWordWrap': 'Alternar ajuste de línea',
		'positronClearConsole': 'Limpiar consola',
		'positronOpenInEditor': 'Abrir en el editor',
		// allow-any-unicode-next-line
		'positronDeleteSession': 'Eliminar sesión',
		'positronRestartSession': 'Reiniciar {0}',
		// allow-any-unicode-next-line
		'positronSession': 'Sesión'
	},
	'vs/workbench/contrib/positronConsole/browser/components/activityErrorMessage': {
		'positronHideTraceback': 'Ocultar rastreo',
		'positronShowTraceback': 'Mostrar rastreo'
	},
	'vs/workbench/contrib/positronConsole/browser/components/activityErrorQuickFix': {
		'positronConsoleAssistantFixPrompt': 'Corrige este error de la consola.',
		'positronConsoleAssistantExplainPrompt': 'Explica este error de la consola.',
		// allow-any-unicode-next-line
		'positronConsoleAssistantUnavailable': 'El Asistente RHS-IA no está disponible. Instale la extensión del Asistente RHS-IA para usar las funciones Corregir y Explicar.',
		'positronConsoleAssistantFix': 'Corregir',
		'positronConsoleAssistantExplain': 'Explicar',
		'positronConsoleAssistantErrorAttachmentName': 'Error de consola'
	},
	'vs/workbench/contrib/positronConsole/browser/components/activityOutputPlot': {
		// allow-any-unicode-next-line
		'activityOutputPlotLinkTitle': 'Seleccione este gráfico en el panel Gráficos.'
	},
	'vs/workbench/contrib/positronConsole/browser/components/consoleInput': {
		// allow-any-unicode-next-line
		'positronConsole.incompleteError': 'No se puede ejecutar el código: {0} ({1})',
		// allow-any-unicode-next-line
		'positronConsole.incompleteUnknownError': 'No se puede ejecutar el código: {0}'
	},
	'vs/workbench/contrib/positronConsole/browser/components/consoleInstance': {
		'positron.console.copy': 'Copiar',
		'positron.console.paste': 'Pegar',
		'positron.console.selectAll': 'Seleccionar todo'
	},
	'vs/workbench/contrib/positronConsole/browser/components/consoleInstanceInfoButton': {
		// allow-any-unicode-next-line
		'positron.console.info.label': 'Información de la consola',
		'positron.console.info.showKernelOutputChannel': 'Mostrar canal de salida {0}',
		// allow-any-unicode-next-line
		'positron.console.info.kernel': 'Kernel',
		'positron.console.info.supervisor': 'Supervisor',
		'positron.console.info.lsp': 'LSP',
		// allow-any-unicode-next-line
		'positron.console.info.sessionId': 'ID de sesión: {0}',
		'positron.console.info.state': 'Estado: {0}',
		'positron.console.info.runtimePath': 'Ruta: {0}',
		'positron.console.info.runtimeSource': 'Fuente: {0}'
	},
	'vs/workbench/contrib/positronConsole/browser/components/consoleInstanceItems': {
		// allow-any-unicode-next-line
		'positron.console.extensionsRestarting': 'Extensiones reiniciándose...'
	},
	'vs/workbench/contrib/positronConsole/browser/components/consoleResourceMonitor': {
		'positron.console.showResourceMonitor': 'Mostrar monitor de recursos',
		'positron.console.resourceMonitor.cpuTooltip': 'Uso de CPU: {0}',
		'positron.console.resourceMonitor.memoryTooltip': 'Uso de memoria: {0}',
		'positron.console.resourceMonitor.ariaLabel': 'Monitor de recursos: CPU {0}, memoria {1}',
		'positron.console.resourceMonitor.ariaLabelEmpty': 'Monitor de recursos'
	},
	'vs/workbench/contrib/positronConsole/browser/components/consoleTab': {
		'positron.console.renameInstance': 'Cambiar nombre...',
		'positron.console.deleteInstance': 'Eliminar',
		'positron.console.showResourceMonitor': 'Mostrar monitor de recursos',
		// allow-any-unicode-next-line
		'positron.console.renameSession.error': 'No se pudo cambiar el nombre de la sesión {0}: {1}',
		// allow-any-unicode-next-line
		'positronDeleteSessionError': 'No se pudo eliminar la sesión: {0}'
	},
	'vs/workbench/contrib/positronConsole/browser/components/currentWorkingDirectory': {
		'positronCurrentWorkingDirectory': 'Directorio de trabajo actual',
		'positron.dataExplorer.copy': 'Copiar'
	},
	'vs/workbench/contrib/positronConsole/browser/components/emptyConsole': {
		// allow-any-unicode-next-line
		'positron.console.empty.noSessionRunning': 'No hay ninguna sesión en ejecución.',
		'positron.useWord': 'Usar',
		// allow-any-unicode-next-line
		'positron.console.startSession': 'Iniciar una sesión',
		'positron.toStartOne': 'para comenzar.'
	},
	'vs/workbench/contrib/positronConsole/browser/components/historyBrowserPopup': {
		'positronConsoleHistoryMatchesEmpty': 'No hay elementos de historial coincidentes'
	},
	'vs/workbench/contrib/positronConsole/browser/components/outputRunWithLinks': {
		// allow-any-unicode-next-line
		'invalidUri': 'La URL "{0}" no es válida: {1}'
	},
	'vs/workbench/contrib/positronConsole/browser/components/resourceUsageGraph': {
		'positronConsole.resourceUsageGraph.title': 'Uso de CPU'
	},
	'vs/workbench/contrib/positronConsole/browser/components/resourceUsageStats': {
		'positronConsole.resourceUsageStats.cpuLabel': 'CPU',
		'positronConsole.resourceUsageStats.memoryLabel': 'MEM'
	},
	'vs/workbench/contrib/positronConsole/browser/components/runtimeRestartButton': {
		'positron.restartLabel': 'Reiniciar {0}'
	},
	'vs/workbench/contrib/positronConsole/browser/components/runtimeStartupProgress': {
		'positron.runtimeStartup.newSession': 'Preparando',
		'positron.runtimeStartup.existingSession': 'Reconectando'
	},
	'vs/workbench/contrib/positronConsole/browser/components/runtimeStatus': {
		// allow-any-unicode-next-line
		'positronRuntimeStatusActiveIcon': 'Icono para indicar el estado "activo" de una sesión de intérprete.',
		// allow-any-unicode-next-line
		'positronRuntimeStatusDisconnectedIcon': 'Icono para indicar el estado "desconectado" de una sesión de intérprete.',
		// allow-any-unicode-next-line
		'positronRuntimeStatusIdleIcon': 'Icono para indicar el estado "inactivo" de una sesión de intérprete.'
	},
	'vs/workbench/contrib/positronConsole/browser/components/startupStatus': {
		'positron.console.initializing': 'Esperando extensiones',
		// allow-any-unicode-next-line
		'positron.console.awaitingTrust': 'No se pueden iniciar consolas en modo restringido. [Confíe en esta carpeta](command:workbench.trust.manage) para habilitar las consolas.',
		'positron.console.newFolderTasks': 'Configurando el espacio de trabajo',
		'positron.console.reconnecting': 'Reconectando',
		'positron.console.starting': 'Iniciando',
		// allow-any-unicode-next-line
		'positron.console.discoveringInterpreters': 'Descubriendo intérpretes'
	},
	'vs/workbench/contrib/positronConsole/browser/positronConsole.contribution': {
		'positronConsoleViewIcon': 'Icono de vista de la vista de la consola RHS-IA.',
		'positron.console': 'Consola',
		'miOpenConsole': '&&Consola',
		'positronConsole.find': 'Consola: Buscar'
	},
	'vs/workbench/contrib/positronConsole/browser/components/submittingOverlay': {
		'positron.console.submitting': 'Enviando...',
		'positron.console.submitting.cancel': 'Cancelar'
	},
	'vs/workbench/contrib/positronConsole/browser/editorCodeSubmission/editorSubmittingWidget': {
		'positron.editorSubmitting.label': 'Enviando',
		// allow-any-unicode-next-line
		'positron.editorSubmitting.dialogMessage': 'RHS-IA está detectando el código que se enviará en la línea {0}.',
		'positron.editorSubmitting.cancel': 'Cancelar',
		'positron.editorSubmitting.runAsIs': 'Ejecutar tal cual'
	},
	'vs/workbench/contrib/positronConsole/browser/positronConsoleActions': {
		'positronConsoleCategory': 'Consola',
		// allow-any-unicode-next-line
		'positron.executeCode.noLanguage': 'No se puede ejecutar el código. No se puede detectar el idioma de entrada.',
		// allow-any-unicode-next-line
		'positron.executeCode.noRuntime': 'No se puede ejecutar el código. No se puede iniciar un intérprete para el lenguaje {0}.',
		// allow-any-unicode-next-line
		'positron.executeCode.syntaxRejectionAtLine': 'No se puede ejecutar el código debido a un error de sintaxis cerca de la línea {0}.',
		// allow-any-unicode-next-line
		'positron.executeCode.jumpToSyntaxRejectionLine': 'Saltar a la línea',
		// allow-any-unicode-next-line
		'positron.executeCode.syntaxRejection': 'No se puede ejecutar el código debido a un error de sintaxis.',
		'workbench.action.positronConsole.clearConsole': 'Limpiar consola',
		'workbench.action.positronConsole.clearConsole.description': 'Borra toda la salida del panel de consola activo.',
		// allow-any-unicode-next-line
		'positron.clearConsole.noActiveConsole': 'No se puede limpiar la consola porque no hay una consola activa.',
		'workbench.action.positronConsole.clearInputHistory': 'Limpiar historial de entrada',
		// allow-any-unicode-next-line
		'positron.inputHistory.noActiveConsole': 'No se puede limpiar el historial de entrada porque no hay una consola activa.',
		// allow-any-unicode-next-line
		'workbench.action.positronConsole.engageHistoryInfixSearch': 'Búsqueda inversa en el historial',
		'positron.engageHistoryInfixSearch.noActiveConsole': 'No se puede buscar en el historial de entrada. No hay una consola activa.',
		'clearInputHistoryTitle': 'Limpiar historial de entrada',
		// allow-any-unicode-next-line
		'clearInputHistoryPrompt': '¿Está seguro de que desea borrar el historial de entrada de {0}? Esto no se puede deshacer.',
		// allow-any-unicode-next-line
		'positron.inputHistory.cleared': 'Se limpió el historial de entrada de {0}.',
		// allow-any-unicode-next-line
		'workbench.action.positronConsole.executeCode': 'Ejecutar código',
		// allow-any-unicode-next-line
		'positron.executeCode.noModel': 'No se puede ejecutar el código. No se puede encontrar el documento en {0}.',
		// allow-any-unicode-next-line
		'workbench.action.positronConsole.executeCodeWithoutAdvancing': 'Ejecutar código sin avanzar',
		// allow-any-unicode-next-line
		'positron.executeCodeAfterCursor.noEditor': 'No se encontró ningún editor.',
		// allow-any-unicode-next-line
		'positron.executeCodeBeforeCursor.noCode': 'No se encontró ningún código antes de la posición del cursor.',
		// allow-any-unicode-next-line
		'positron.executeCodeAfterCursor.noCode': 'No se encontró ningún código después de la posición del cursor.',
		// allow-any-unicode-next-line
		'workbench.action.positronConsole.executeCodeBeforeCursor': 'Ejecutar código desde el principio hasta la línea actual',
		// allow-any-unicode-next-line
		'workbench.action.positronConsole.executeCodeAfterCursor': 'Ejecutar código desde la línea actual hasta el final',
		'workbench.action.positronConsole.focusConsole': 'Enfocar la consola',
		'workbench.action.positronConsole.navigateInputHistoryDown': 'Ir a la entrada siguiente del historial',
		// allow-any-unicode-next-line
		'positron.navigateInputHistory.noActiveConsole': 'No se puede navegar por el historial de entrada porque no hay una consola activa.',
		'workbench.action.positronConsole.navigateInputHistoryUp': 'Ir a la entrada anterior del historial',
		'workbench.action.positronConsole.navigateInputHistoryUpUsingPrefixMatch': 'Ir a la entrada anterior del historial que coincida con el prefijo',
		// allow-any-unicode-next-line
		'workbench.action.positronConsole.showNotebookConsole': 'Mostrar consola del cuaderno',
		'positron.noActiveNotebook': 'Sin cuaderno activo; ejecute este comando con un cuaderno abierto en un editor para ver su consola.'
	},
	'vs/workbench/contrib/positronConsole/browser/positronConsoleView': {
		// allow-any-unicode-next-line
		'console.session.quickLaunch': 'Inicio rápido de sesión...',
		'console.startSession.none': 'Sin sesiones',
		'console.startSession.other': 'Iniciar otra...'
	},
	'vs/workbench/contrib/positronPlots/browser/components/actionBars': {
		// allow-any-unicode-next-line
		'positronShowPreviousPlot': 'Mostrar gráfico anterior',
		// allow-any-unicode-next-line
		'positronShowNextPlot': 'Mostrar siguiente gráfico',
		// allow-any-unicode-next-line
		'positronSavePlot': 'Guardar gráfico',
		// allow-any-unicode-next-line
		'positronCopyPlotToClipboard': 'Copiar gráfico al portapapeles',
		// allow-any-unicode-next-line
		'positronOpenPlotInNewWindow': 'Abrir gráfico en ventana nueva',
		// allow-any-unicode-next-line
		'positronOpenPlotsGalleryInNewWindow': 'Abrir galería de gráficos en una ventana nueva',
		// allow-any-unicode-next-line
		'positronClearAllPlots': 'Limpiar todos los gráficos',
		'positron.darkFilter': 'Filtro oscuro',
		'positron.darkFilterNone': 'Sin filtro',
		'positron.darkFilterFollowTheme': 'Seguir tema',
		// allow-any-unicode-next-line
		'positronDarkFilterTooltip': 'Establezca si se aplica un filtro oscuro a los gráficos.',
		// allow-any-unicode-next-line
		'positron.openDarkFilterSettings': 'Cambiar valor predeterminado en Configuración...',
		'positron.zoom': 'Zoom',
		// allow-any-unicode-next-line
		'positronZoomPlotTooltip': 'Establecer el zoom del gráfico',
		'positronZoomFit': 'Adaptar',
		'positronZoomFifty': '50%',
		'positronZoomSeventyFive': '75%',
		'positronZoomActual': '100%',
		'positronZoomDouble': '200%',
		// allow-any-unicode-next-line
		'positron.sizingPolicy': 'Tamaño',
		// allow-any-unicode-next-line
		'positronSizingPolicyTooltip': 'Establecer cómo se determinan la forma y el tamaño del gráfico.',
		// allow-any-unicode-next-line
		'positronNewCustomSize': 'Nuevo tamaño personalizado...',
		// allow-any-unicode-next-line
		'positronChangeCustomSize': 'Cambiar tamaño personalizado...',
		'positron.openInEditor': 'Abrir en el editor',
		// allow-any-unicode-next-line
		'positron-editor-open-in-editor-dropdown': 'Seleccionar dónde abrir el gráfico',
		// allow-any-unicode-next-line
		'positron.plotCode': 'Código',
		// allow-any-unicode-next-line
		'positronPlotCodeActions': 'Acciones del código del gráfico',
		// allow-any-unicode-next-line
		'positronPlots.copyCode': 'Copiar código',
		// allow-any-unicode-next-line
		'positronPlots.revealInConsole': 'Mostrar código en la consola',
		// allow-any-unicode-next-line
		'positronPlots.runCodeAgain': 'Ejecutar código nuevamente',
		'positronPlots.openSourceFile': 'Abrir archivo fuente',
		'positron-editor-new-window': 'Abrir en ventana nueva',
		// allow-any-unicode-next-line
		'positron-editor-new-tab': 'Abrir en la pestaña Editor',
		// allow-any-unicode-next-line
		'positron-editor-new-tab-right': 'Abrir en la pestaña Editor al lado',
		// allow-any-unicode-next-line
		'positronPlotSizeTooSmall': 'El tamaño de gráfico personalizado {0}x{1} no es válido. El tamaño debe ser al menos de 100x100.',
		// allow-any-unicode-next-line
		'positronPlots.copyCodeInfo': 'Código de gráfico copiado al portapapeles: {0}',
		// allow-any-unicode-next-line
		'positronPlots.revealInConsoleError': 'El código que generó este gráfico ya no está presente en la consola.'
	},
	'vs/workbench/contrib/positronPlots/browser/components/dynamicPlotInstance': {
		// allow-any-unicode-next-line
		'positronPlots.policyRenderError': 'Error al representar el gráfico al tamaño \'{0}\': {1} ({2})'
	},
	'vs/workbench/contrib/positronPlots/browser/components/placeholderThumbnail': {
		// allow-any-unicode-next-line
		'positron.plots.placeholderThumbnail': 'Marcador de posición de miniatura de gráfico'
	},
	'vs/workbench/contrib/positronPlots/browser/components/plotGalleryThumbnail': {
		// allow-any-unicode-next-line
		'positronRemovePlot': 'Eliminar gráfico'
	},
	'vs/workbench/contrib/positronPlots/browser/htmlPlotClient': {
		'positronPlots.htmlPlotClient.defaultName': 'interactivo {0}'
	},
	'vs/workbench/contrib/positronPlots/browser/modalDialogs/savePlotModalDialog': {
		'positron.savePlotModalDialog.pathDoesNotExist': 'La ruta no existe.',
		// allow-any-unicode-next-line
		'positron.savePlotModalDialog.title': 'Guardar gráfico',
		'positron.savePlotModalDialog.select': 'Seleccionar',
		'positron.savePlotModalDialog.fileExists': 'El archivo ya existe',
		// allow-any-unicode-next-line
		'positron.savePlotModalDialog.fileExistsMessage': 'El archivo ya existe. ¿Quieres sobrescribirlo?',
		'positron.savePlotModalDialog.overwrite': 'Sobrescribir',
		'positron.savePlotModalDialog.cancel': 'Cancelar',
		// allow-any-unicode-next-line
		'positron.savePlotModalDialog.errorSavingPlot': 'Error al guardar el gráfico: {0}',
		'positron.savePlotModalDialog.width.intrinsicSize': '{0}{1}',
		'positron.savePlotModalDialog.height.intrinsicSize': '{0}{1}',
		'positron.savePlotModalDialog.save': 'Guardar',
		'positronCancel': 'Cancelar',
		'positron.savePlotModalDialog.directory': 'Directorio',
		'positron.savePlotModalDialog.name': 'Nombre',
		'positron.savePlotModalDialog.format': 'Formato',
		'positron.savePlotModalDialog.width': 'Ancho',
		'positron.savePlotModalDialog.height': 'Altura',
		'positron.savePlotModalDialog.dpi': 'PPP',
		// allow-any-unicode-next-line
		'positron.savePlotModalDialog.invalidPathError': 'Ruta no válida: {0}',
		'positron.savePlotModalDialog.dimensionError': 'El ancho y el alto deben ser mayores que 0.',
		'positron.savePlotModalDialog.dpiMinMaxError': 'Los DPI deben estar entre 1 y 300.',
		// allow-any-unicode-next-line
		'positron.savePlotModalDialog.invalidNameError': 'El nombre del gráfico no puede estar vacío.',
		// allow-any-unicode-next-line
		'positron.savePlotModalDialog.useIntrinsicSize': 'Usar tamaño intrínseco',
		'positron.savePlotModalDialog.updatePreview': 'Actualizar vista previa'
	},
	'vs/workbench/contrib/positronPlots/browser/modalDialogs/setPlotSizeModalDialog': {
		'positronOK': 'Aceptar',
		'positronCancel': 'Cancelar',
		// allow-any-unicode-next-line
		'positronSetPlotSizeModalDialogTitle': 'Tamaño de gráfico personalizado',
		'positronPlotWidth': 'Ancho',
		'positronPlotHeight': 'Altura',
		'positronDeletePlotSize': 'Eliminar'
	},
	'vs/workbench/contrib/positronPlots/browser/positronPlots.contribution': {
		// allow-any-unicode-next-line
		'positronPlotViewIcon': 'Icono de la vista Gráficos.',
		// allow-any-unicode-next-line
		'positron.plots': 'Gráficos',
		// allow-any-unicode-next-line
		'miTogglePlots': '&&Gráficos',
		// allow-any-unicode-next-line
		'positronPlots.zoomSubMenuTitle': 'Establecer el zoom del gráfico',
		'positron.plots.darkFilterOn': 'Aplicar siempre el filtro oscuro',
		'positron.plots.darkFilterOff': 'No aplicar nunca el filtro oscuro',
		// allow-any-unicode-next-line
		'positron.plots.darkFilterAuto': 'Aplicar el filtro oscuro cuando RHS-IA use un tema oscuro',
		// allow-any-unicode-next-line
		'positron.plots.darkFilterSetting': 'Utilice un filtro de color para hacer que los gráficos claros parezcan oscuros.',
		// allow-any-unicode-next-line
		'positron.plots.darkFilter.deprecated': 'Esta configuración está en desuso. Utilice \'plots.darkFilter\' en su lugar.',
		// allow-any-unicode-next-line
		'positron.plots.frozenSlowPlotsSetting': 'Inmoviliza los gráficos de generación lenta en un tamaño fijo para evitar que se vuelvan a representar cuando cambia la ventana y mejorar la capacidad de respuesta al trabajar con gráficos complejos.',
		// allow-any-unicode-next-line
		'positron.plots.freezeSlowPlots.deprecated': 'Esta configuración está en desuso. Utilice \'plots.freezeSlowPlots\' en su lugar.',
		// allow-any-unicode-next-line
		'plotsConfigurationTitle': 'Gráficos',
		'plots.darkFilterOn': 'Aplicar siempre el filtro oscuro',
		'plots.darkFilterOff': 'No aplicar nunca el filtro oscuro',
		// allow-any-unicode-next-line
		'plots.darkFilterAuto': 'Aplicar el filtro oscuro cuando RHS-IA use un tema oscuro',
		// allow-any-unicode-next-line
		'plots.darkFilterSetting': 'Utilice un filtro de color para hacer que los gráficos claros parezcan oscuros.',
		// allow-any-unicode-next-line
		'plots.defaultSizingPolicyAuto': 'Ajustar automáticamente el tamaño del gráfico',
		// allow-any-unicode-next-line
		'plots.defaultSizingPolicyFill': 'Ocupar todo el espacio disponible con el gráfico',
		// allow-any-unicode-next-line
		'plots.defaultSizingPolicyIntrinsic': 'Utilice el tamaño intrínseco del gráfico cuando esté disponible',
		// allow-any-unicode-next-line
		'plots.defaultSizingPolicyLandscape': 'Utilice una relación de aspecto horizontal de 4:3',
		// allow-any-unicode-next-line
		'plots.defaultSizingPolicyPortrait': 'Utilice una relación de aspecto vertical de 3:4',
		// allow-any-unicode-next-line
		'plots.defaultSizingPolicySquare': 'Utilice una relación de aspecto cuadrado 1:1',
		// allow-any-unicode-next-line
		'plots.defaultSizingPolicySetting': 'La política de tamaño predeterminada que se utilizará para los gráficos recién creados.',
		// allow-any-unicode-next-line
		'plots.frozenSlowPlotsSetting': 'Inmoviliza los gráficos de generación lenta en un tamaño fijo para evitar que se vuelvan a representar cuando cambia la ventana y mejorar la capacidad de respuesta al trabajar con gráficos complejos.',
		// allow-any-unicode-next-line
		'plots.historyPolicyAlways': 'Mostrar siempre la tira de miniaturas del historial de gráficos',
		// allow-any-unicode-next-line
		'plots.historyPolicyAuto': 'Mostrar automáticamente la tira de miniaturas del historial cuando haya varios gráficos y espacio suficiente',
		// allow-any-unicode-next-line
		'plots.historyPolicyNever': 'No mostrar nunca la tira de miniaturas del historial de gráficos',
		// allow-any-unicode-next-line
		'plots.historyPolicySetting': 'Cuándo se muestra la tira de miniaturas del historial de gráficos.'
	},
	'vs/workbench/contrib/positronPlots/browser/positronPlotsActions': {
		// allow-any-unicode-next-line
		'positronPlotsCategory': 'Gráficos',
		// allow-any-unicode-next-line
		'positronPlots.noPlotsFound': 'No hay gráficos disponibles.',
		// allow-any-unicode-next-line
		'positronPlots.action.selectPlot': 'Seleccionar un gráfico',
		// allow-any-unicode-next-line
		'positronPlots.noPlotSelected': 'No se seleccionó ningún gráfico.',
		// allow-any-unicode-next-line
		'positronPlots.copyPlotsView': 'Desde la vista de gráficos',
		'positronPlots.copyEditor': 'Editor: {0}',
		// allow-any-unicode-next-line
		'positronPlots.refreshPlots': 'Actualizar gráficos',
		// allow-any-unicode-next-line
		'positronPlots.savePlots': 'Guardar gráfico',
		// allow-any-unicode-next-line
		'positronPlotsServicePlotNotFound': 'No se encontró el gráfico {0}',
		// allow-any-unicode-next-line
		'positronPlotsServiceSavePlotError': 'No se pudo guardar el gráfico: {0}',
		// allow-any-unicode-next-line
		'positronPlots.copyPlot': 'Copiar gráfico',
		// allow-any-unicode-next-line
		'positronPlots.plotCopied': 'Gráfico copiado al portapapeles.',
		// allow-any-unicode-next-line
		'positronPlotsServiceCopyToClipboardError': 'No se pudo copiar el gráfico al portapapeles: {0}',
		// allow-any-unicode-next-line
		'positronPlots.nextPlot': 'Seleccionar siguiente gráfico',
		// allow-any-unicode-next-line
		'positronPlots.previousPlot': 'Seleccionar gráfico anterior',
		// allow-any-unicode-next-line
		'positronPlots.clearPlots': 'Limpiar gráficos',
		// allow-any-unicode-next-line
		'positronPlots.popoutPlot': 'Abrir gráfico en ventana nueva',
		// allow-any-unicode-next-line
		'positronPlots.openEditor': 'Abrir gráfico en la pestaña Editor',
		// allow-any-unicode-next-line
		'positronPlots.openGalleryInNewWindow': 'Abrir galería de gráficos en una ventana nueva',
		// allow-any-unicode-next-line
		'positronPlots.editorCopyPlot': 'Copiar gráfico del editor activo al portapapeles',
		// allow-any-unicode-next-line
		'positronPlots.editorSavePlot': 'Guardar gráfico desde el editor activo',
		// allow-any-unicode-next-line
		'positronPlots.sizingPolicy': 'Cambiar política de tamaño de gráfico',
		// allow-any-unicode-next-line
		'positronPlots.action.selectSizingPolicy': 'Seleccionar una política de tamaño',
		'positronPlots.zoomToFit': 'Adaptar',
		'positronPlots.zoomFifty': '50%',
		'positronPlots.zoomSeventyFive': '75%',
		'positronPlots.zoomOneHundred': '100%',
		'positronPlots.zoomTwoHundred': '200%'
	},
	'vs/workbench/contrib/positronPlots/browser/positronPlotsService': {
		// allow-any-unicode-next-line
		'positronPlots.sizing.invalidSizingPolicy': 'Política de tamaño no válida: {0}',
		// allow-any-unicode-next-line
		'positronPlots.sizing.invalidPlotType': 'No se puede establecer el tamaño para este tipo de gráfico',
		// allow-any-unicode-next-line
		'positronPlots.noPlotSelected': 'No se seleccionó ningún gráfico.',
		// allow-any-unicode-next-line
		'positronPlotsService.savePlotError.unknown': 'Error al guardar el gráfico: {0}',
		// allow-any-unicode-next-line
		'positron.savePlot': 'Guardar gráfico'
	},
	'vs/workbench/contrib/positronSession/browser/positronSessionContainer': {
		// allow-any-unicode-next-line
		'positronSessionViewIcon': 'Icono de vista de la vista de sesión de RHS-IA.',
		// allow-any-unicode-next-line
		'positron.session': 'Sesión'
	},
	'vs/workbench/contrib/positronVariables/browser/components/actionBars': {
		'positronRefreshObjects': 'Actualizar objetos',
		'positronDeleteAllObjects': 'Eliminar todos los objetos',
		'positronImportDataFromFile': 'Importar datos'
	},
	'vs/workbench/contrib/positronVariables/browser/components/groupingMenuButton': {
		// allow-any-unicode-next-line
		'positron.changeHowVariablesAreGrouped': 'Cambiar cómo se agrupan las variables'
	},
	'vs/workbench/contrib/positronVariables/browser/components/memoryUsageDropdown': {
		'positron.memoryUsage.sessions': 'Sesiones',
		'positron.memoryUsage.overhead': 'Sobrecarga',
		'positron.memoryUsage.summary': 'Resumen',
		// allow-any-unicode-next-line
		'positron.memoryUsage.positron': 'RHS-IA',
		'positron.memoryUsage.platform': 'Plataforma',
		'positron.memoryUsage.extensions': 'Extensiones',
		'positron.memoryUsage.other': 'Otro',
		'positron.memoryUsage.free': 'Libre',
		'positron.memoryUsage.summaryPct': '{0}% de {1}',
		'positron.memoryUsage.lowMemoryThresholdPercent': 'Queda menos del {0}% de memoria',
		'positron.memoryUsage.lowMemoryThresholdMb': 'Quedan menos de {0} MB de memoria',
		'positron.memoryUsage.configure': 'configurar',
		'positron.memoryUsage.breakdown': 'Desglose del uso de memoria'
	},
	'vs/workbench/contrib/positronVariables/browser/components/memoryUsageMeter': {
		'positron.memoryUsage.memLabel': 'memoria',
		// allow-any-unicode-next-line
		'positron.memoryUsage.computing': 'Calculando el uso de memoria...',
		// allow-any-unicode-next-line
		'positron.memoryUsage.tooltip': 'Kernels: {0} | RHS-IA: {1} | Otro: {2} | Libre: {3}',
		'positron.memoryUsage.ariaLabel': 'Uso de memoria: {0} utilizado por RHS-IA y kernels del total de {1}',
		'positron.memoryUsage.lowMemoryPercent': 'Memoria baja (queda un {0}%)',
		'positron.memoryUsage.lowMemoryMb': 'Memoria baja (quedan {0} MB)'
	},
	'vs/workbench/contrib/positronVariables/browser/components/sortingMenuButton': {
		// allow-any-unicode-next-line
		'positron.changeHowVariablesAreSorted': 'Cambiar cómo se ordenan las variables',
		'positronVariables.sortByName': 'Nombre',
		// allow-any-unicode-next-line
		'positronVariables.sortBySize': 'Tamaño',
		'positronVariables.sortByRecent': 'Reciente',
		'positronVariables.highlightRecent': 'Resaltar valores recientes'
	},
	'vs/workbench/contrib/positronVariables/browser/components/variableGroup': {
		'positron.variables.collapse': 'Colapsar',
		'positron.variables.expand': 'Expandir'
	},
	'vs/workbench/contrib/positronVariables/browser/components/variableItem': {
		'positron.sizeByte': '{0} Byte',
		'positron.sizeBytes': '{0} Bytes',
		'positron.sizeKB': '{0}KB',
		'positron.sizeMB': '{0}MB',
		'positron.sizeGB': '{0} GB',
		'positron.sizeTB': '{0}TB',
		'positron.variables.viewTableQueued': 'Tabla de datos en cola...',
		// allow-any-unicode-next-line
		'positron.variables.viewConnectionQueued': 'Conexión en cola...',
		'positron.variables.viewQueued': 'Ver en cola...',
		'positron.variables.viewTable': 'Ver tabla de datos',
		// allow-any-unicode-next-line
		'positron.variables.viewConnection': 'Ver conexión',
		'positron.variables.view': 'Vista',
		'positron.variables.collapse': 'Colapsar',
		'positron.variables.expand': 'Expandir'
	},
	'vs/workbench/contrib/positronVariables/browser/components/variableOverflow': {
		// allow-any-unicode-next-line
		'positron.moreValues': '{0} más valores'
	},
	'vs/workbench/contrib/positronVariables/browser/components/variablesEmpty': {
		'positron.noVariablesCreated': 'No se han creado variables.',
		'positron.noVariables.filter': 'Ninguna variable coincide con el filtro actual.'
	},
	'vs/workbench/contrib/positronVariables/browser/modalDialogs/deleteAllVariablesModalDialog': {
		'positron.deleteAllVariablesModalDialogTitle': 'Eliminar todas las variables',
		// allow-any-unicode-next-line
		'positron.deleteAllVariablesModalDialogText': '¿Está seguro de que desea eliminar todas las variables? Esta operación no se puede deshacer.'
	},
	'vs/workbench/contrib/positronVariables/browser/positronVariables.contribution': {
		'positron.variables': 'Variables',
		'miToggleVariables': '&&Variables'
	},
	'vs/workbench/contrib/positronVariables/browser/positronVariablesActions': {
		'positronVariablesCategory': 'Variables'
	},
	'vs/workbench/contrib/welcomeGettingStarted/browser/positronWelcomePage/components/environmentHealthSection': {
		// allow-any-unicode-next-line
		'positron.welcome.environmentSetupCheckingStatus': 'Comprobando la configuración del entorno',
		// allow-any-unicode-next-line
		'positron.welcome.environmentSetupTitle': 'Configuración del entorno',
		// allow-any-unicode-next-line
		'positron.welcome.environmentSetupCheckRerunTooltip': 'Volver a ejecutar las comprobaciones de configuración del entorno',
		// allow-any-unicode-next-line
		'positron.welcome.environmentSetupCheckRerunBusyTooltip': 'Esperando que termine la comprobación actual',
		// allow-any-unicode-next-line
		'positron.welcome.environmentSetupSettingsTooltip': 'Elegir qué lenguajes se comprueban',
		'positron.welcome.environmentSetupChecking': 'Comprobando...',
		// allow-any-unicode-next-line
		'positron.welcome.environmentSetupAllDisabled': 'Las comprobaciones de configuración del entorno están desactivadas para todos los lenguajes.',
		// allow-any-unicode-next-line
		'positron.welcome.environmentSetupTurnOnChecks': 'Puede volver a activarlas en Configuración'
	},
	'vs/workbench/contrib/welcomeGettingStarted/browser/positronWelcomePage/components/healthItemRow': {
		'positron.welcome.environmentSetupStatusPass': 'Superada',
		// allow-any-unicode-next-line
		'positron.welcome.environmentSetupStatusWarn': 'Requiere atención',
		'positron.welcome.environmentSetupStatusFail': 'Fallida',
		'positron.welcome.environmentSetupStatusSkipped': 'Sin comprobar',
		'positron.welcome.environmentSetupCopyPath': 'Copiar',
		// allow-any-unicode-next-line
		'positron.welcome.environmentSetupLearnMore': 'Más información'
	},
	'vs/workbench/contrib/welcomeGettingStarted/browser/positronWelcomePage/components/languageHealthGroup': {
		// allow-any-unicode-next-line
		'positron.welcome.environmentSetupUnavailable': 'La extensión {0} no está disponible.',
		// allow-any-unicode-next-line
		'positron.welcome.environmentSetupError': 'No se pudo completar la comprobación de {0}.',
		// allow-any-unicode-next-line
		'positron.welcome.environmentSetupAllPassed': '{0} se configuró correctamente',
		'positron.welcome.environmentSetupSomePassed': '{0} de {1} comprobaciones superadas'
	},
	'vs/workbench/contrib/welcomeGettingStarted/browser/positronWelcomePage/components/walkthroughBanner': {
		'positron.welcome.learn': 'Aprender',
		// allow-any-unicode-next-line
		'positron.welcome.walkthroughBannerDescription': 'Realice un recorrido guiado por {0} sin salir del IDE. Comience con lo básico y explore los flujos de trabajo de análisis de datos.',
		'positron.welcome.seeAllWalkthroughs': 'Ver todos los recorridos'
	},
	'vs/workbench/contrib/welcomeGettingStarted/browser/positronWelcomePage/components/welcomeHeader': {
		'positron.welcome.title': 'Bienvenido a {0}',
		'positron.welcome.help': 'Ayuda'
	},
	'vs/workbench/contrib/welcomeGettingStarted/browser/positronWelcomePage/environmentHealth': {
		'positron.welcome.environmentSetupPython': 'Python',
		'positron.welcome.environmentSetupR': 'R'
	},
	'vs/workbench/contrib/welcomeGettingStarted/common/gettingStartedPositronWelcomeContent': {
		// allow-any-unicode-next-line
		'getting-started-positron-welcome-icon': 'Icono usado para el recorrido de introducción a RHS-IA',
		'positron.gettingStarted.welcome.title': 'Comience con RHS-IA',
		'positron.gettingStarted.welcome.description': 'Encuentre su camino entre los paneles, atajos y herramientas integrados para la ciencia de datos',
		'positron.gettingStarted.welcome.walkthroughPageTitle': 'Comience con RHS-IA',
		'positron.gettingStarted.welcome.theme.title': 'Elija su tema',
		// allow-any-unicode-next-line
		'positron.gettingStarted.welcome.theme.description': 'El tema adecuado le ayuda a concentrarse en su código y resulta más cómodo para la vista\n{0}',
		'positron.gettingStarted.welcome.theme.button': 'Explorar temas de color',
		'positron.gettingStarted.welcome.panesAndUI.title': 'Conozca la interfaz de usuario de RHS-IA',
		// allow-any-unicode-next-line
		'positron.gettingStarted.welcome.panesAndUI.description': 'Explore la consola, las variables, los gráficos y los demás paneles diseñados para la ciencia de datos interactiva\n{0}',
		// allow-any-unicode-next-line
		'positron.gettingStarted.welcome.panesAndUI.button': 'Personalizar su diseño',
		'positron.gettingStarted.welcome.keybindings.title': 'Atajos de teclado',
		// allow-any-unicode-next-line
		'positron.gettingStarted.welcome.keybindings.description': 'Acceda a cualquier comando desde el teclado y cambie los atajos que más utiliza\n{0}',
		'positron.gettingStarted.welcome.keybindings.button': 'Abrir atajos de teclado',
		'positron.gettingStarted.welcome.extensions.title': 'Programe con extensiones',
		'positron.gettingStarted.welcome.extensions.description': 'Vea lo que RHS-IA ya incluye y agregue las extensiones que desee\n{0}',
		'positron.gettingStarted.welcome.extensions.button': 'Explorar extensiones',
		// allow-any-unicode-next-line
		'positron.gettingStarted.welcome.git.title': 'Realice un seguimiento de su código con Git',
		// allow-any-unicode-next-line
		'positron.gettingStarted.welcome.git.description': 'Clone un repositorio o ponga bajo control de versiones la carpeta en la que está trabajando\n{0}',
		'positron.gettingStarted.welcome.git.button': 'Nueva carpeta desde Git',
	},
	'vs/workbench/services/positronConsole/browser/classes/activityItemOutputHtml': {
		'positronHTMLOutput': '[Salida HTML]'
	},
	'vs/workbench/services/positronConsole/browser/positronConsoleService': {
		'consoleConfigurationTitle': 'Consola',
		'console.fontFamily': 'Controla la familia de fuentes.',
		'console.fontLigatures': 'Activa/desactiva las ligaduras de fuentes (funciones de fuentes \'calt\' y \'liga\'). Cambie esto a una cadena para un control detallado de la propiedad CSS \'font-feature-settings\'.',
		// allow-any-unicode-next-line
		'console.fontFeatureSettings': 'Propiedad CSS explícita \'font-feature-settings\'. En su lugar, se puede pasar un booleano si solo se necesita activar/desactivar las ligaduras.',
		// allow-any-unicode-next-line
		'console.fontLigaturesGeneral': 'Configura ligaduras de fuentes o características de fuentes. Puede ser un valor booleano para habilitar/deshabilitar ligaduras o una cadena para el valor de la propiedad CSS \'font-feature-settings\'.',
		// allow-any-unicode-next-line
		'console.fontSize': 'Controla el tamaño de fuente en píxeles.',
		// allow-any-unicode-next-line
		'console.fontVariations': 'Activa/desactiva la conversión de font-weight a font-variation-settings. Cambie este valor a una cadena para controlar con precisión la propiedad CSS \'font-variation-settings\'.',
		// allow-any-unicode-next-line
		'console.fontVariationSettings': 'Propiedad CSS \'font-variation-settings\' explícita. También se puede pasar un valor booleano si solo se necesita convertir font-weight a font-variation-settings.',
		// allow-any-unicode-next-line
		'console.fontVariationsGeneral': 'Configura las variaciones de fuente. Puede ser un valor booleano para activar/desactivar la conversión de font-weight a font-variation-settings o una cadena con el valor de la propiedad CSS \'font-variation-settings\'.',
		'console.fontWeight.normal': 'Peso de fuente normal.',
		'console.fontWeight.bold': 'Peso de fuente en negrita.',
		'console.fontWeight': 'Controla el peso de la fuente.',
		// allow-any-unicode-next-line
		'console.letterSpacing': 'Controla el espaciado entre letras en píxeles.',
		// allow-any-unicode-next-line
		'console.lineHeight': 'Controla la altura de la línea.',
		// allow-any-unicode-next-line
		'console.lineHeight2': 'Controla la altura de la línea. \n - Utilice 0 para calcular automáticamente la altura de la línea a partir del tamaño de fuente.\n - Los valores entre 0 y 8 se utilizarán como multiplicador con el tamaño de fuente.\n - Se utilizarán como valores efectivos valores mayores o iguales a 8.',
		// allow-any-unicode-next-line
		'console.scrollbackSize': 'El número de elementos de salida de la consola que se mostrarán.',
		// allow-any-unicode-next-line
		'console.showNotebookConsoles': 'Controla si las consolas se muestran automáticamente para los cuadernos abiertos.',
		// allow-any-unicode-next-line
		'console.notebookPlotPreviewHeight': 'Controla si los gráficos generados por un cuaderno se previsualizan en su consola y la altura (en píxeles) de esas previsualizaciones. Establézcalo en 0 para desactivar las previsualizaciones de gráficos del cuaderno.',
		// allow-any-unicode-next-line
		'console.showNotebookConsoleActions': 'Controla si las acciones de la consola del cuaderno aparecen en sus barras de herramientas. Cuando está habilitado, puede mostrar o enfocar manualmente la consola con el elemento de menú "Mostrar consola del cuaderno".',
		// allow-any-unicode-next-line
		'console.showResourceMonitor': 'Controla si el monitor de recursos (uso de CPU y memoria) se muestra en la lista de pestañas de la consola.',
		// allow-any-unicode-next-line
		'positron.console.promptWhenIncomplete': 'Cuando está activado, el código enviado en la Consola se comprueba primero para determinar si está completo; si está incompleto, la Consola solicita más entrada en lugar de ejecutarlo. Cuando está desactivado, el código enviado se ejecuta de inmediato sin esa comprobación.',
		'positron.console.assistantActions.enabled': 'Habilita las acciones de la consola con el Asistente, como Corregir y Explicar.',
		// allow-any-unicode-next-line
		'positron.noNotebookSession': 'No se está ejecutando ninguna sesión para el cuaderno {0}',
		// allow-any-unicode-next-line
		'positron.clearConsole.promptActive': 'No se puede limpiar la consola mientras haya un indicador activo.',
		// allow-any-unicode-next-line
		'positronConsole.started': 'Se inició {0}.',
		// allow-any-unicode-next-line
		'positronConsole.restarted': '{0} se reinició.',
		// allow-any-unicode-next-line
		'positronConsole.connected': '{0} se conectó.',
		'positronConsole.starting.restart': 'Reiniciando {0}.',
		'positronConsole.starting.start': 'Iniciando {0}.',
		'positronConsole.starting.reconnect': 'Reconectando {0}.',
		// allow-any-unicode-next-line
		'positronConsole.starting.reconnected': '{0} se reconectó.',
		// allow-any-unicode-next-line
		'positronConsole.exit.forcedQuit': '{0} se cerró de manera forzada.',
		// allow-any-unicode-next-line
		'positronConsole.exit.restart': '{0} salió (preparándose para reiniciar)',
		// allow-any-unicode-next-line
		'positronConsole.exit.shutdown': '{0} se cerró correctamente.',
		// allow-any-unicode-next-line
		'positronConsole.exit.transfer': '{0} se abrió en otra ventana.',
		// allow-any-unicode-next-line
		'positronConsole.exit.error': '{0} salió inesperadamente: {1}',
		// allow-any-unicode-next-line
		'positronConsole.exit.startupFailed': '{0} no pudo iniciarse (código de salida {1})',
		// allow-any-unicode-next-line
		'positronConsole.exit.extensionHost': '{0} se desconectó del host de extensión.',
		// allow-any-unicode-next-line
		'positronConsole.exit.unknown': '{0} salió (código de salida {1})',
		// allow-any-unicode-next-line
		'positronConsole.exitCode.error': 'código de salida 1 (error)',
		// allow-any-unicode-next-line
		'positronConsole.exitCode.cannotExit': 'código de salida 126 (no es ejecutable o no tiene permisos)',
		// allow-any-unicode-next-line
		'positronConsole.exitCode.notFound': 'código de salida 127 (comando no encontrado)',
		// allow-any-unicode-next-line
		'positronConsole.exitCode.interrupted': 'código de salida 130 (interrumpido)',
		// allow-any-unicode-next-line
		'positronConsole.exitCode.killed': 'terminó por la señal {0}{1}',
		// allow-any-unicode-next-line
		'positronConsole.exitCode.genericError': 'código de salida {0}'
	},
	'vs/workbench/services/positronPlots/common/sizingPolicyAuto': {
		'plotSizingPolicy.automatic': 'Auto'
	},
	'vs/workbench/services/positronPlots/common/sizingPolicyCustom': {
		// allow-any-unicode-next-line
		'plotSizingPolicy.CustomSlow': '{0}×{1} (congelado)',
		// allow-any-unicode-next-line
		'plotSizingPolicy.Custom': '{0}×{1} (personalizado)'
	},
	'vs/workbench/services/positronPlots/common/sizingPolicyFill': {
		'plotSizingPolicy.fillViewport': 'Llenar'
	},
	'vs/workbench/services/positronPlots/common/sizingPolicyIntrinsic': {
		// allow-any-unicode-next-line
		'plotSizingPolicy.intrinsic.defaultName': 'Intrínseco',
		// allow-any-unicode-next-line
		'plotSizingPolicy.intrinsic.name': '{0} ({1}{3}×{2}{3})',
		'plotSizingPolicy.intrinsic.unit.inches': 'pulg',
		// allow-any-unicode-next-line
		'plotSizingPolicy.intrinsic.unit.pixels': 'píxeles'
	},
	'vs/workbench/services/positronPlots/common/sizingPolicyLandscape': {
		'plotSizingPolicy.landscape': 'Horizontal'
	},
	'vs/workbench/services/positronPlots/common/sizingPolicyPortrait': {
		'plotSizingPolicy.portrait': 'Vertical'
	},
	'vs/workbench/services/positronPlots/common/sizingPolicySquare': {
		'plotSizingPolicy.square': 'Cuadrado'
	},
	'vs/workbench/services/positronVariables/common/positronVariablesInstance': {
		'positronVariables.group.data': 'Datos',
		'positronVariables.group.values': 'Valores',
		'positronVariables.group.functions': 'Funciones',
		'positronVariables.group.classes': 'Clases',
		// allow-any-unicode-next-line
		'positronVariables.group.small': 'Pequeño',
		'positronVariables.group.medium': 'Mediano',
		'positronVariables.group.large': 'Grande',
		'positronVariables.group.veryLarge': 'Muy grande',
		'positronVariables.requestRefreshError': 'Error al actualizar variables: {0}\n\n{1} ({2})',
		'positronVariables.requestClearError': 'Error al borrar variables: {0}\n\n{1} ({2})',
		'positronVariables.requestDeleteError': 'Error al eliminar variables: {0}\n\n{1} ({2})',
		'positronVariables.expandVariableItemError': 'Error al expandir el elemento variable: {0}\n\n{1} ({2})'
	}
};
