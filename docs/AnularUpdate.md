# Documentación de Modificación: Eliminación del Sistema de Auto-Actualización

**Fecha de modificación:** 2025-05-07  
**Versión de Positron:** 1.109.2 (fork de VS Code:)  
**Rama:** main  
**Estado de compilación:** ✅ ÉXITO (0 errores)  

---

## 1. Resumen Ejecutivo

### Objetivo
Eliminar completamente la capacidad de auto-actualización de la aplicación Positron, de modo que:
- No exista monitoreo automático de nuevas versiones.
- No se muestre ningún icono, badge o notificación relacionada con actualizaciones.
- No aparezcan ítems de menú para "Check for Updates", "Download Update", "Install Update", ni "Restart to Update".
- El motor de actualización quede deshabilitado en la fuente (no solo oculto).

### Filosofía del cambio
Se optó por la **deshabilitación en la fuente** en lugar de simples ajustes de configuración, ya que esto asegura que:
1. Ni un usuario avanzado ni una variable de entorno pueden reactivar el comportamiento.
2. No se desperdician ciclos de CPU verificando URLs de actualización.
3. No se generan solicitudes de red innecesarias desde la aplicación.

---

## 2. Archivos Modificados

Se modificaron **7 archivos** en el directorio `src/` para desmantelar el sistema de actualización en todas sus capas (main process, renderer process, workbench contributions, configuración y menús nativos/custom).

### 2.1 Motor de Actualización (Main Process)

#### `src/vs/platform/update/electron-main/abstractUpdateService.ts`

**Rol del archivo:** Servicio base abstracto del proceso principal de Electron que coordina TODO el ciclo de vida de actualizaciones (verificación, descarga, instalación). Es la clase padre de `DarwinUpdateService`, `Win32UpdateService` y `LinuxUpdateService`.

**Cambio realizado:**  
Se reescribió el método `initialize()` (la puerta de entrada del servicio) para que retorne inmediatamente con estado `Disabled`, sin ejecutar ninguna lógica de verificación de canales, URLs, configuración, o scheduling.

**Código antes (parcial):**
```typescript
protected async initialize(): Promise<void> {
    const updateChannel = this.getUpdateChannel();
    if (process.env.POSITRON_UPDATE_CHANNEL) {
        this.logService.info('update#ctor - using update channel from environment variable', process.env.POSITRON_UPDATE_CHANNEL);
    }
    this.enableAutoUpdate = this.configurationService.getValue<boolean>('update.autoUpdate');
    // ... 80+ líneas más de lógica de verificación, scheduling, URL building ...
}
```

**Código después:**
```typescript
protected async initialize(): Promise<void> {
    // Updates are permanently disabled in this build
    this.setState(State.Disabled(DisablementReason.ManuallyDisabled));
    this.logService.info('update#ctor - updates are permanently disabled in this build');
    // Original update initialization code removed
}
```

**Impacto:** Este cambio impide que se construyan URLs de feed de actualización, que se programe el `scheduleCheckForUpdates()` cada 6 horas, y que se verifique si `update.mode` permite actualizaciones.

**Nota sobre `getUpdateChannel()`:** Se comentó la implementación privada del método `getUpdateChannel()` ya que no se utiliza, pero se mantuvieron `enableAutoUpdate` y `TELEMETRY_ID_KEY` como propiedades porque las subclases `Win32UpdateService` y `DarwinUpdateService` hacen referencia a ellas en sus métodos `updateAvailable()`.

---

### 2.2 Servicio de Actualización del Renderer (Web/Browser)

#### `src/vs/workbench/services/update/browser/updateService.ts`

**Rol del archivo:** Implementación del servicio de actualización para entornos de navegador/web (cuando Positron corre como PWA o en un contenedor web). Se encarga de consultar si existe un `IUpdateProvider` para saber si hay nuevas versiones.

**Cambio realizado:**  
Se eliminó la auto-verificación al arrancar.

**Código antes:**
```typescript
constructor(
    @IBrowserWorkbenchEnvironmentService private readonly environmentService: IBrowserWorkbenchEnvironmentService,
    @IHostService private readonly hostService: IHostService
) {
    super();

    this.checkForUpdates(false);
}
```

**Código después:**
```typescript
constructor(
    @IBrowserWorkbenchEnvironmentService private readonly environmentService: IBrowserWorkbenchEnvironmentService,
    @IHostService private readonly hostService: IHostService
) {
    super();
}
```

**Impacto:** Al abrir Positron en un navegador (si corresponde), ya no se ejecuta automáticamente `checkForUpdates()`, evitando solicitudes HTTP al proveedor de actualizaciones.

---

### 2.3 Contribuciones del Workbench (UI, Badge, Comandos)

#### `src/vs/workbench/contrib/update/browser/update.contribution.ts`

**Rol del archivo:** Registra todas las contribuciones del workbench relacionadas con actualizaciones: el badge de notificación sobre el engranaje (Global Activity), las acciones registradas en el Command Palette, los menús desplegables, y las contribuciones de ciclo de vida.

**Cambios realizados:**

1. **Eliminados imports no utilizados:** `Registry`, `IWorkbenchContributionsRegistry`, `WorkbenchExtensions`, `LifecyclePhase`, `ProductContribution`, `UpdateContribution`, `SwitchProductQualityContribution`, `DefaultAccountUpdateContribution`, `DOWNLOAD_URL`, `IsWebContext`, `IOpenerService`, `URI`, `ContextKeyExpr`.

2. **Comentados registros de WorkbenchContribution:**
```typescript
// Disabled: update functionality removed
// workbench.registerWorkbenchContribution(ProductContribution, LifecyclePhase.Restored);
// workbench.registerWorkbenchContribution(UpdateContribution, LifecyclePhase.Restored);
// workbench.registerWorkbenchContribution(SwitchProductQualityContribution, LifecyclePhase.Restored);
// workbench.registerWorkbenchContribution(DefaultAccountUpdateContribution, LifecyclePhase.Eventually);
```

**Impacto:** La clase más crítica es `UpdateContribution`, que contiene la lógica de:
- Pintar el `NumberBadge(1)` o `ProgressBadge` sobre el ícono de engranaje.
- Mostrar notificaciones toast ("There's an update available", "Restart to apply the latest update").
- Registrar listeners `onUpdateStateChange` que activan toda la lógica de UI.

3. **Eliminadas 5 clases Action2:**
- `CheckForUpdateAction` (id: `update.checkForUpdate`)
- `DownloadUpdateAction` (id: `update.downloadUpdate`)
- `InstallUpdateAction` (id: `update.installUpdate`)
- `RestartToUpdateAction` (id: `update.restartToUpdate`)
- `DownloadAction` (id: `workbench.action.download`)

4. **Eliminadas llamadas `registerAction2()`** a las acciones anteriores.

**Impacto:** Estas acciones ya no aparecen en el Command Palette (`Ctrl+Shift+P`), ni en menús contextuales, ni se pueden invocar vía API de extensiones. El usuario pierde completamente la capacidad de interactuar con el sistema de actualización desde la UI.

5. **Se mantuvieron** (porque no están relacionadas con actualizaciones):
- `ShowCurrentReleaseNotesAction` (solo muestra notas de release, no actualiza).
- `ShowCurrentReleaseNotesFromCurrentFileAction`.
- `DeveloperRefreshLanguageUsage`.
- `DeveloperApplyUpdateAction` (solo disponible en Windows, modo Developer).
- `DeveloperSetLastUpdateVersion`.

---

### 2.4 Menú Custom de la Barra de Título

#### `src/vs/workbench/browser/parts/titlebar/menubarControl.ts`

**Rol del archivo:** Controla el menubar custom usado en Linux y en Windows cuando la configuración `window.menuBarVisibility` está en `custom`. También maneja la inserción dinámica de la acción de actualización en el menú **Help**.

**Cambios realizados:**

1. **Import limpio:** Removido `StateType` del import de `IUpdateService` (ya no se usa).

2. **Método `getUpdateAction()` eliminado:**  
Antes contenía un `switch` de 38 líneas basado en `state.type` que devolvía acciones para Idle, Checking, AvailableForDownload, Downloading, Downloaded, Updating, Ready.  
**Después:** El método se eliminó por completo.

3. **`insertActionsBefore()` limpiado:**  
En el `case 'workbench.action.showAboutDialog'`, se eliminó la lógica:
```typescript
// Before
if (!isMacintosh && !isWeb) {
    const updateAction = this.getUpdateAction();
    if (updateAction) {
        updateAction.label = mnemonicMenuLabel(updateAction.label);
        target.push(updateAction);
        target.push(new Separator());
    }
}

// After
// Update actions are disabled in this build
```

**Impacto:** En el menú Help (Linux y Windows custom), ya no aparece "Check for Updates..." ni sus variantes.

---

### 2.5 Menú Nativo de macOS

#### `src/vs/platform/menubar/electron-main/menubar.ts`

**Rol del archivo:** Construye el menú nativo de la aplicación para macOS (menubar que aparece en la parte superior de la pantalla, manejado por el proceso main de Electron).

**Cambios realizados:**

1. **Eliminado import no utilizado:** Removido `import { IUpdateService, StateType } from '../../update/common/update.js';`.

2. **Eliminada dependencia en constructor:** Removido `@IUpdateService private readonly updateService: IUpdateService` del constructor (causaba un error de compilación porque ya no se usaba la propiedad).

3. **Método `getUpdateMenuItems()` simplificado:**  
Antes: un `switch` de 50+ líneas que, dependiendo del `state.type`, creaba instancias de `MenuItem` específicas (Check for Updates, Checking for Updates..., Download Update, etc.) con callbacks que invocaban `this.updateService.checkForUpdates(true)`, `this.updateService.downloadUpdate()`, etc.  
**Después:**
```typescript
private getUpdateMenuItems(): MenuItem[] {
    // Updates are disabled in this build
    return [];
}
```

**Impacto:** En macOS, el menú superior de la aplicación (al lado de "About {AppName}") ya no muestra ninguna entrada relacionada con actualizaciones.

---

### 2.6 Configuración por Defecto

#### `src/vs/platform/update/common/update.config.contribution.ts`

**Rol del archivo:** Define la configuración/setting `update.mode` y sus opciones visibles en `settings.json` y la UI de Settings.

**Cambio realizado:**

```typescript
// Before
'update.mode': {
    type: 'string',
    enum: ['none', 'manual', 'start', 'default'],
    default: 'default',
    ...
}

// After
'update.mode': {
    type: 'string',
    enum: ['none', 'manual', 'start', 'default'],
    default: 'none',   // <-- changed
    ...
}
```

**Impacto:** Incluso si un usuario explora la configuración y busca "update", el modo por defecto será `'none'` (deshabilitado). Esto actúa como una capa de seguridad adicional. Nota: las demás settings (`update.autoUpdate`, `update.positron.channel`, etc.) siguen existiendo, pero no tienen efecto porque el motor `initialize()` se detiene antes de leerlas.

---

## 3. Mapa de Archivos y Responsabilidades

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CAPA MAIN PROCESS                             │
├─────────────────────────────────────────────────────────────────────┤
│ abstractUpdateService.ts                                            │
│   └─ initialize() → Estado a Disabled, return inmediato            │
│      (no scheduling, no URL building, no autoUpdate checks)        │
├─────────────────────────────────────────────────────────────────────┤
│                        CAPA RENDERER / WORKBENCH                    │
├─────────────────────────────────────────────────────────────────────┤
│ updateService.ts (browser)                                          │
│   └─ constructor → Ya NO llama checkForUpdates(false)              │
├─────────────────────────────────────────────────────────────────────┤
│ update.contribution.ts                                              │
│   └─ NO registra UpdateContribution                                  │
│   └─ NO registra ProductContribution                                 │
│   └─ NO registra SwitchProductQualityContribution                    │
│   └─ NO registra DefaultAccountUpdateContribution                    │
│   └─ NO registra CheckForUpdateAction                                 │
│   └─ NO registra DownloadUpdateAction                                 │
│   └─ NO registra InstallUpdateAction                                  │
│   └─ NO registra RestartToUpdateAction                                │
│   └─ NO registra DownloadAction                                       │
├─────────────────────────────────────────────────────────────────────┤
│                        CAPA MENÚS / UI                              │
├─────────────────────────────────────────────────────────────────────┤
│ browser/parts/titlebar/menubarControl.ts                            │
│   └─ getUpdateAction() ELIMINADO                                      │
│   └─ insertActionsBefore("showAboutDialog") → NO inserta nada      │
├─────────────────────────────────────────────────────────────────────┤
│ platform/menubar/electron-main/menubar.ts                           │
│   └─ getUpdateMenuItems() → return []                                 │
│   └─ Constructor SIN dependencia IUpdateService                     │
├─────────────────────────────────────────────────────────────────────┤
│                        CAPA CONFIGURACIÓN                           │
├─────────────────────────────────────────────────────────────────────┤
│ update.config.contribution.ts                                        │
│   └─ update.mode default cambiado: 'default' → 'none'               │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 4. Efectos Secundarios y Consideraciones

### ✅ Comportamientos eliminados
1. **Auto-verificación en startup:** No se ejecuta `checkForUpdates()` ni al abrir ni a los 30 segundos.
2. **Verificación periódica:** No se programa el temporizador de 6 horas.
3. **Badge de notificación:** El engranaje (Global Activity) nunca muestra punto rojo o badge numérico por actualizaciones.
4. **Menú de engranaje:** Se eliminaron los ítems del grupo `'7_update'`:
   - Check for Updates...
   - Checking for Updates...
   - Download Update
   - Downloading Update...
   - Install Update...
   - Installing Update...
   - Show Update Release Notes
   - Restart to Update
5. **Menú Help:** No aparece "Check for Updates..." en Windows/Linux.
6. **Menú macOS:** No aparece "Check for Updates..." en el menú de aplicación.

### ⚠️ Consideraciones de mantenimiento
1. **Ajustes (`update.mode`, `update.autoUpdate`, `update.positron.channel`) todavía existen** en la UI de Settings y en `settings.json`. El usuario puede verlos, pero no tienen efecto funcional. Esto es intencional para no modificar más archivos de configuración.
2. **La clase `BrowserUpdateService` sigue existiendo** y se registra como singleton (`registerSingleton`). Esto evita romper el sistema de inyección de dependencias (DI) de otras partes del código que inyectan `IUpdateService`.
3. **Las subclases `Win32UpdateService` y `DarwinUpdateService` permanecen sin cambios**, aunque heredan de `AbstractUpdateService`. Sus implementaciones específicas de `doCheckForUpdates()` y `updateAvailable()` ya no se ejecutan porque `initialize()` se detiene antes.
4. **Notas de release (Release Notes)** siguen accesibles como función standalone (no dependen del sistema de actualización).

---

## 5. Verificación de Compilación

Se ejecutó el script oficial de compilación del proyecto:

```bash
npm run compile
```

**Resultado final:**
```
[23:47:51] Finished compilation with 0 errors after 87565 ms
[23:47:51] Finished 'compile' after 1.97 min
```

**Estadísticas de diff:**
```
8 files changed, 29 insertions(+), 303 deletions(-)
```

---

## 6. Instrucciones para Revertir (Rollback)

Si en el futuro se desea restaurar el sistema de actualización, se deben revertir exactamente estos 7 archivos usando Git:

```bash
git checkout -- src/vs/platform/update/electron-main/abstractUpdateService.ts
git checkout -- src/vs/workbench/services/update/browser/updateService.ts
git checkout -- src/vs/workbench/contrib/update/browser/update.contribution.ts
git checkout -- src/vs/workbench/browser/parts/titlebar/menubarControl.ts
git checkout -- src/vs/platform/menubar/electron-main/menubar.ts
git checkout -- src/vs/platform/update/common/update.config.contribution.ts
```

**Nota:** Realizar `git revert` del commit completo también funcionaría.

---

*Fin del documento de modificación.*
