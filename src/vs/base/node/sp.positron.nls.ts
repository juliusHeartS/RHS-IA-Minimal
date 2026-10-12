/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { positronSessionNlsData } from './sp.positron.session.nls.js';
import { positronAdditionalNlsData } from './sp.positron.additional.nls.js';

const positronCuratedNlsData: Record<string, Record<string, string>> = {
	...positronSessionNlsData,
	'vs/workbench/contrib/chat/browser/widget/chatWidget': {
		'positronAssistant.comingSoonTitle': 'Bienvenido al asistente de RHS-IA',
		'positronAssistant.enableAssistantMessage': 'Habilitar el asistente de RHS-IA',
		// allow-any-unicode-next-line
		'positronAssistant.comingSoonMessage': 'El asistente de RHS-IA se encuentra en desarrollo y actualmente está disponible como característica de vista previa de RHS-IA.\n',
		'positronAssistant.gettingStartedTitle': 'Configurar Asistente RHS-IA',
		// allow-any-unicode-next-line
		'positronAssistant.signInMessage': 'Iniciar sesión en un proveedor',
		// allow-any-unicode-next-line
		'positronAssistant.signInSetupMessage': 'Para empezar a utilizar el Asistente RHS-IA, inicie sesión en un proveedor.',
		'positronAssistant.enableProviderMessage': 'Habilitar un proveedor',
		// allow-any-unicode-next-line
		'positronAssistant.enableSetupMessage': 'Para empezar a utilizar el Asistente RHS-IA, habilite un proveedor en Configuración.',
		// allow-any-unicode-next-line
		'positronAssistant.guideLinkMessage': 'Guía de usuario del Asistente RHS-IA',
		'positronAssistant.welcomeMessageTitle': 'Bienvenido al Asistente RHS-IA',
		// allow-any-unicode-next-line
		'positronAssistant.welcomeMessageReady': 'El Asistente RHS-IA está diseñado para acelerar y mejorar tus proyectos de ciencia de datos.\n\nEl {guide-link} explica las posibilidades y capacidades del Asistente RHS-IA.\n\nVerifica siempre los resultados. Los asistentes de IA pueden producir código incorrecto a veces.',
		// allow-any-unicode-next-line
		'positronAssistant.welcomeMessageReadyTips': 'Haz clic en o escribe $(mention) para seleccionar un participante de chat.\n\nHaz clic en $(attach) o escribe `#` para agregar contexto, como archivos, a tu chat.\n\nEscribe `/` para utilizar comandos predefinidos como `/help`.'
	},
	'vs/workbench/contrib/welcomeGettingStarted/browser/gettingStarted': {
		// allow-any-unicode-next-line
		'checkboxTitle': 'Cuando está marcada, esta página se mostrará al inicio.',
		// allow-any-unicode-next-line
		'welcomePage.showOnStartup': 'Mostrar la página de bienvenida al inicio',
		'gettingStarted.topLevelRemoteOpen.title': 'Conectar a...',
		'welcomePage.openFolderWithPath': 'Abrir la carpeta {0} con la ruta {1}',
		// allow-any-unicode-next-line
		'welcomePage.removeRecent': 'Quitar de elementos abiertos recientemente',
		// allow-any-unicode-next-line
		'welcomePage.removeRecentAriaLabel': 'Quitar {0} de elementos abiertos recientemente',
		'recent': 'Reciente',
		'noRecents': 'No tiene carpetas recientes,',
		'openFolder': 'abra una carpeta',
		'toStart': '',
		// allow-any-unicode-next-line
		'show more recents': 'Mostrar todas las carpetas recientes {0}',
		// allow-any-unicode-next-line
		'showAll': 'Más...'
	},
	'vs/workbench/contrib/files/browser/fileActions.contribution': {
		'Save': 'Guardar',
		'Save All': 'Guardar todo'
	},
	'vs/workbench/contrib/files/browser/fileConstants': {
		'saveAs': 'Guardar como...'
	},
	'vs/workbench/browser/parts/positronTopActionBar/components/topActionBarCustomFolderMenu': {
		'positron.folderSelector': 'Selector de carpetas'
	},
	'vs/workbench/browser/parts/positronTopActionBar/customFolderModalPopup/customFolderMenuItems': {
		'positronOpenFolder': 'Abrir carpeta...',
		'positronCloseFolder': 'Cerrar carpeta'
	},
	'vs/workbench/browser/actions/positronActions': {
		'positronNewFolderFromTemplate': 'Nueva carpeta desde plantilla...',
		'positronNewFolderFromGit': 'Nueva carpeta desde Git...',
		'positronOpenFolderInNewWindow': 'Abrir carpeta en ventana nueva...'
	},
	'vs/workbench/browser/parts/positronTopActionBar/components/topActionBarNewMenu': {
		'positronNew': 'Nuevo',
		'positronNewFile': 'Nuevo archivo...',
		'positronNewFileFolder': 'Nuevo archivo/carpeta'
	},
	'vs/workbench/browser/parts/positronTopActionBar/components/topActionBarOpenMenu': {
		'positronOpen': 'Abrir',
		'positronOpenFile': 'Abrir archivo...',
		'positronOpenFolder': 'Abrir carpeta...',
		'positronOpenFileFolder': 'Abrir archivo/carpeta'
	},
	'vs/workbench/browser/parts/positronTopActionBar/components/topActionBarCommandCenter': {
		'positronSearch': 'Buscar',
		// allow-any-unicode-next-line
		'positronShowQuickAccess': 'Mostrar acceso rápido'
	},
	'vs/workbench/browser/parts/positronTopActionBar/components/topActionBarSessionPicker': {
		// allow-any-unicode-next-line
		'positron.console.startSession': 'Iniciar sesión'
	},
	'vs/workbench/browser/parts/positronTopActionBar/positronTopActionBarActions': {
		'positron.toggleTopActionBarVisibility': 'Mostrar u ocultar la barra superior',
		'miTopActionBar': 'Barra &&superior',
		'positron.focusTopActionBar': 'Enfocar la barra superior'
	},
	'vs/workbench/browser/parts/editor/workspaceActions': {
		'clearRecentWorkspaces': 'Borrar elementos abiertos recientemente',
		// allow-any-unicode-next-line
		'confirmClearWorkspacesMessage': '¿Desea borrar todos los espacios de trabajo abiertos recientemente?',
		// allow-any-unicode-next-line
		'confirmClearDetail': 'Esta acción es irreversible.',
		'clearButtonLabel': '&&Borrar'
	},
	'vs/workbench/contrib/positronConnections/browser/positronConnections.contribution': {
		'positron.connections': 'Conexiones',
		'positron.help': 'Conexiones'
	},
	'vs/workbench/contrib/positronHelp/browser/positronHelp.contribution': {
		'positron.help': 'Ayuda'
	},
	'vs/workbench/contrib/positronHistory/browser/positronHistory.contribution': {
		'positron.history': 'Historial',
		'miToggleHistory': '&&Historial'
	},
	'vs/workbench/contrib/positronPreview/browser/positronPreview.contribution': {
		'positron.viewer': 'Visor',
		'miTogglePreview': '&&Vista previa'
	},
	'vs/workbench/contrib/languageRuntime/browser/languageRuntimeActions': {
		'positron.languageRuntime.activeConsoleSessions': 'Sesiones de consola',
		'positron.languageRuntime.notebookSessions': 'Sesiones de cuaderno',
		'positron.languageRuntime.quartoSessions': 'Sesiones de Quarto',
		// allow-any-unicode-next-line
		'positron.languageRuntime.changeNotebookSession': 'Cambiar sesión de cuaderno...',
		// allow-any-unicode-next-line
		'positron.languageRuntime.changeForegroundSession.quickPickTitle': 'Sesiones de intérprete en ejecución',
		// allow-any-unicode-next-line
		'positron.languageRuntime.newConsoleSession': 'Nueva sesión de consola...',
		// allow-any-unicode-next-line
		'positron.languageRuntime.selectSession.quickPickTitle': 'Seleccionar sesión de intérprete',
		'positron.languageRuntime.currentlySelected': 'Seleccionada actualmente',
		'positron.languageRuntime.suggestedRuntimes': 'Sugerencias',
		// allow-any-unicode-next-line
		'positron.languageRuntime.discoveringInterpreters': 'Buscando intérpretes...',
		// allow-any-unicode-next-line
		'positron.languageRuntime.noInterpretersFound': 'No se encontraron intérpretes',
		// allow-any-unicode-next-line
		'positron.languageRuntime.startSession': 'Iniciar nueva sesión de intérprete',
		// allow-any-unicode-next-line
		'positron.languageRuntime.startConsoleSession': 'Iniciar nueva sesión de consola',
		// allow-any-unicode-next-line
		'positron.languageRuntime.selectSession.commandTitle': 'Seleccionar sesión',
		// allow-any-unicode-next-line
		'positron.languageRuntime.duplicateActiveConsoleSession.title': 'Duplicar sesión de consola activa',
		// allow-any-unicode-next-line
		'positron.languageRuntime.renameSession': 'Renombrar sesión de intérprete',
		// allow-any-unicode-next-line
		'positron.languageRuntime.selectSessionToRename': 'Seleccionar sesión para renombrar',
		// allow-any-unicode-next-line
		'positron.languageRuntime.renameActiveSession': 'Renombrar sesión de intérprete activa'
	},
	'vs/workbench/contrib/workspace/browser/workspaceTrustEditor': {
		'positron.trustedAssistant': 'El Asistente RHS-IA se puede habilitar',
		'positron.untrustedAssistant': 'El Asistente RHS-IA no se puede habilitar'
	},
	'vs/workbench/contrib/positronAssistant/browser/components/languageModelConfigComponent': {
		'positron.languageModelConfig.positEula': 'EULA de Posit',
		// allow-any-unicode-next-line
		'positron.languageModelConfig.termsOfService': 'Términos de servicio',
		// allow-any-unicode-next-line
		'positron.languageModelConfig.privacyPolicy': 'Política de privacidad',
		'positron.languageModelConfig.apiKeyInputLabel': 'Clave API',
		// allow-any-unicode-next-line
		'positron.languageModelConfig.signIn': 'Iniciar sesión',
		// allow-any-unicode-next-line
		'positron.languageModelConfig.signOut': 'Cerrar sesión',
		'positron.languageModelConfig.cancel': 'Cancelar',
		'positron.languageModelConfig.baseUrlOpenAICompatibleInputLabel': 'URL base (debe ser compatible con OpenAI)',
		'positron.languageModelConfig.baseUrlInputLabel': 'URL base',
		'positron.languageModelConfig.baseUrlSignedIn': 'URL base: {0}',
		// allow-any-unicode-next-line
		'positron.languageModelConfig.externalApiInUseWithBaseUrl': '✓ {0} autenticado automáticamente usando las variables de entorno {1} y {2}',
		// allow-any-unicode-next-line
		'positron.languageModelConfig.externalApiInUse': '✓ {0} autenticado automáticamente usando la variable de entorno {1}',
		// allow-any-unicode-next-line
		'positron.languageModelConfig.externalApiSetupWithBaseUrl': 'También puede asignar las variables de entorno {0} y {1} y reiniciar RHS-IA.',
		// allow-any-unicode-next-line
		'positron.languageModelConfig.externalApiSetup': 'También puede asignar la variable de entorno {0} y reiniciar RHS-IA.',
		// allow-any-unicode-next-line
		'positron.languageModelConfig.autoconfiguredModelInUse': '✓ {0} autenticado automáticamente usando {1}'
	},
	'vs/workbench/contrib/positronAssistant/browser/languageModelModalDialog': {
		// allow-any-unicode-next-line
		'positron.languageModelProviderModalDialog.oauthInProgressTitle': 'Autenticación de {0} en progreso',
		// allow-any-unicode-next-line
		'positron.languageModelProviderModalDialog.oauthInProgressMessage': 'El flujo de inicio de sesión está en progreso. Si cierra este diálogo, es posible que el inicio de sesión no se complete. ¿Está seguro de que desea cerrar y cancelar el inicio de sesión?',
		// allow-any-unicode-next-line
		'positron.languageModelProviderModalDialog.ok': 'Sí',
		'positron.languageModelProviderModalDialog.cancel': 'No',
		// allow-any-unicode-next-line
		'positron.languageModelProviderModalDialog.apiKeySignInIncompleteTitle': 'Autenticación de {0} incompleta',
		// allow-any-unicode-next-line
		'positron.languageModelProviderModalDialog.apiKeySignInIncompleteMessage': 'Ha introducido una clave API, pero no ha iniciado sesión. Si cierra este diálogo, su clave API no se guardará. ¿Está seguro de que desea cerrar y cancelar el inicio de sesión?',
		// allow-any-unicode-next-line
		'positron.languageModelProviderModalDialog.incompleteConfig': 'La configuración está incompleta.',
		// allow-any-unicode-next-line
		'positron.languageModelProviderModalDialog.unsupportedAuthMethod': 'Método de autenticación no soportado.',
		'positron.languageModelProviderModalDialog.oauth': 'OAuth',
		'positron.languageModelProviderModalDialog.apiKey': 'Clave API',
		'positron.languageModelModalDialog.close': 'Cerrar',
		'positron.languageModelModalDialog.title': 'Configurar proveedores de modelos de lenguaje',
		'positron.languageModelProviderModalDialog.provider': 'Proveedor',
		// allow-any-unicode-next-line
		'positron.languageModelProviderModalDialog.authentication': 'Autenticación'
	}
};

export const positronNlsData: Record<string, Record<string, string>> = { ...positronAdditionalNlsData };
for (const [moduleId, translations] of Object.entries(positronCuratedNlsData)) {
	positronNlsData[moduleId] = { ...positronNlsData[moduleId], ...translations };
}
