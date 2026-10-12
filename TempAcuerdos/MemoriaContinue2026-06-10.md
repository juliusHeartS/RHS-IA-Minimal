# Memoria: Experiencia Continue en Positron

**Fecha:** 2026-06-10
**Proyecto:** RHS-IA / Positron + Continue.dev v1.3.39
**Autor:** juliusHeartS

---

## Lecciones Aprendidas

### 1. Directorio de Extensiones de Positron

Positron usa `~/.positron-dev/extensions/`, NO `~/.vscode-oss-dev/extensions/` ni `~/.vscode/extensions/`.

```bash
# Correcto:
~/.positron-dev/extensions/continue.continue-1.3.39/

# Incorrecto (VS Code vanilla):
~/.vscode/extensions/continue.continue-1.3.39/
```

### 2. Registro Manual en extensions.json

Cuando copias una extensión manualmente, DEBES registrarla en:
`~/.positron-dev/extensions/extensions.json`

```json
{
  "identifier": { "id": "continue.continue", "uuid": "..." },
  "location": { "$mid": 1, "path": "/Users/.../.positron-dev/extensions/continue.continue-1.3.39", "scheme": "file" },
  "version": "1.3.39",
  "metadata": { "installedTimestamp": ..., "source": "gallery" }
}
```

### 3. Problemas de Binarios Nativos

Continue depende de `sqlite3` (node-sqlite3). Si falta:
```
Error: Cannot find module '../build/Release/node_sqlite3.node'
```

**Solución:** Copiar el binario compilado:
```bash
cp continue/binary/build/Release/node_sqlite3.node \
   ~/.positron-dev/extensions/continue.continue-1.3.39/out/build/Release/
```

### 4. xhr-sync-worker.js Faltante

Continue necesita `xhr-sync-worker.js` para requests HTTP. Si falta:
```
Error: ENOENT: no such file or directory, open '.../xhr-sync-worker.js'
```

**Solución:** Copiar desde el build:
```bash
cp continue/extensions/vscode/out/xhr-sync-worker.js \
   ~/.positron-dev/extensions/continue.continue-1.3.39/out/
```

### 5. XMLHttpRequest en Extension Host

Continue usa `XMLHttpRequest` que no existe en Node.js del extension host.

**Workaround:** Usar `node-xmlhttprequest` polyfill o modificar el código para usar `fetch`.

### 6. Context Bridge Funciona (Unidireccional)

El context bridge `getPositronContextSnapshot()` funciona bien para **lectura**:
- Workspace dirs
- Archivos abiertos
- Sesiones activas (R/Python)
- Variables básicas
- Estado de terminales

Pero NO permite **escritura** (ejecutar código, crear plots).

### 7. Continue Bundlea Providers Internamente

Los providers de contexto (como `PositronContextProvider`) están en el bundle de Continue, no se cargan dinámicamente desde archivos externos.

### 8. Puerto de Debug del Extension Host

Para debuggear el extension host de Positron:
```bash
./scripts/code.sh --remote-debugging-port=9224
# Extension Host está en puerto 5870 (no 9224)
```

Conectar Chrome DevTools a `ws://localhost:5870` para inspeccionar el extension host.

### 9. Comando de Prueba del Bridge

```javascript
// En DevTools del Extension Host:
vscode.commands.executeCommand('positron-assistant.getContext')
  .then(ctx => console.log(JSON.stringify(ctx, null, 2)))
```

### 10. Pre-commit Hook (Hygiene)

Positron tiene hook de pre-commit estricto:
- LF line endings (no CRLF)
- Tabs para indentación (no spaces)
- Copyright headers obligatorios
- No unicode no-ASCII

Si falla el commit, revisar estos puntos.

---

## Comandos Útiles

```bash
# Verificar estado de Continue
ls ~/.positron-dev/extensions/ | grep continue

# Ver logs de Positron
cat /tmp/positron-*.log | grep -i "continue\|error"

# Reinstalar Continue después de cambios
cd continue/extensions/vscode && npm run compile
rsync -av --delete continue/extensions/vscode/out/ ~/.positron-dev/extensions/continue.continue-1.3.39/out/

# Debuggear extension host
node -e "const ws=require('ws'); const c=new ws('ws://localhost:5870'); c.on('open',()=>console.log('Connected'));"
```

---

## Errores Conocidos (No Críticos)

1. **sqlite3 warnings**: Funciona igual, solo warnings en startup
2. **yaml.schemas**: Configuración de schemas YAML no afecta funcionalidad
3. **Icono de loop infinito**: UI de Continue muestra spinner, pero funciona

---

## Próximos Pasos (Integración Profunda)

Ver `Acuerdo2026-06-10.md` para el plan detallado.

**Prioridad:** Modificar `continue/extensions/vscode/src/VsCodeIde.ts` para detectar Positron y usar `positron.runtime.executeCode()`.

---

**Nota:** Esta memoria existe para que futuros agentes (o yo mismo) no repitan los mismos errores y debugging innecesario.
