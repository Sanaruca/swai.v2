---
layout: page
title: 📘 Documentación Técnica de Instalación
---

Esta sección describe, de forma directa y narrativa, los pasos necesarios para instalar SWAI en un entorno controlado y reproducible. Está pensada para ser seguida de principio a fin por un administrador o desarrollador que prepara el servidor o la máquina de desarrollo. Los comandos se presentan tal como deben ejecutarse en una terminal; las rutas son relativas al directorio raíz del repositorio y las variables marcadas requieren adaptación según el entorno local.

### Requisitos previos

El sistema requiere `Node.js` en su versión 22, `PostgreSQL` en versión 16 o superior y `Bun` en la versión 1. Antes de comenzar instale opcionalmente de forma global las utilidades sugeridas para la gestión de variables y procesos: `dotenvx` y `pm2`. Para comprobar su disponibilidad ejecute en la terminal:

```bash
dotenvx --version
pm2 --version
```

Si uno de los comandos no responde, instale las herramientas globalmente con npm o el gestor que prefiera. Estas utilidades facilitan la ejecución en tiempo real y la administración del proceso de servidor en segundo plano.

### Preparación del entorno

Abra una shell y colóquese en la raíz del repositorio del proyecto. Antes de instalar dependencias edite el archivo `.env` y configure la variable `DATABASE_URL` con la cadena de conexión a la base de datos PostgreSQL que va a utilizar. Un ejemplo de valor sería:

```env
DATABASE_URL="postgresql://usuario:password@localhost:5432/swai"
```

Asegúrese de reemplazar `usuario`, `password` y `nombre de la base de datos` por los valores reales de su entorno. Verifique que PostgreSQL esté operativo y accesible desde la máquina donde ejecutará la instalación.

### Instalación de dependencias

Con el `.env` configurado y la base de datos accesible, instale las dependencias del monorepo usando Bun:

```bash
bun install
```

Este comando resolverá los paquetes para todos los workspaces necesarios en el monorepo.

### Construcción de los módulos

La compilación de los componentes esenciales del sistema se realiza con el comando de Nx. Desde la raíz del proyecto ejecute:

```bash
bun nx run-many --target build --projects 'swai,server'
```

Este paso genera los artefactos de distribución en el directorio `dist/` correspondiente a cada proyecto. Confirme que la ruta `dist/swai/server/server.mjs` exista tras la compilación.

### Carga de datos iniciales

La base de datos requiere una carga inicial de datos definida en `prisma/seed.sql`. Si la carga automática no se ejecuta o requiere aplicarse manualmente, use psql para importar el archivo SQL. El comando general es:

```bash
psql -U <usuario> -d <nombre_base_datos> -f prisma/seed.sql
```

Sustituya `<usuario>` y `<nombre_base_datos>` por los valores correctos. Compruebe que el usuario tenga permisos para ejecutar los scripts de creación e inserción definidos en el archivo.

### Puesta en marcha del servicio

Con los artefactos compilados y la base de datos poblada, inicie la aplicación bajo pm2 pasando las variables de entorno con dotenvx. El comando recomendado es el siguiente:

```bash
dotenvx run -- pm2 start --name swai-server node -- dist/swai/server/server.mjs
```

Este comando arranca el proceso con pm2, permitiendo supervisarlo y administrarlo como servicio de usuario. Verifique el estado del proceso y los registros con:

```bash
pm2 status
pm2 logs swai-server
```

Para detener el servicio utilice `pm2 stop swai-server`.

### Verificación final

Si la puesta en marcha fue exitosa, el servidor escuchará en el puerto configurado y la interfaz principal estará disponible en http://localhost:4000. Para comprobar el acceso a la sección administrativa utilice las credenciales por defecto: usuario `admin` y contraseña `Swai%4dm1n157r4d0r`. Tras el primer inicio se recomienda cambiar la contraseña administrativa y comprobar las políticas de acceso según las normas institucionales.

### Contingencias y recomendaciones mínimas

Si encuentra errores durante la compilación o el arranque, revise primero los logs de pm2 y la salida de la compilación para identificar dependencias faltantes o errores de permisos. Confirme la conectividad con PostgreSQL y la validez de `DATABASE_URL`. En instalaciones productivas considere ejecutar pm2 como servicio del sistema, aplicar medidas de hardening sobre PostgreSQL y asegurar los archivos de configuración con permisos restringidos. Mantenga un registro de cambios y una copia impresa de este procedimiento en el libro de despliegues para trazabilidad institucional.

Si necesita la versión más reciente de esta documentación consulte la página de documentación pública y póngase en contacto con los desarrolladores si surge algún problema.
