---
layout: page
title: 📘 Documentación Instalación con Installer
---

La instalación mediante el instalador semiautomático reproduce el mismo flujo de la guía técnica pero lo automatiza para reducir intervención manual. Antes de iniciar, verifique que el entorno cumple los requisitos mínimos: Node.js v22.x.x, PostgreSQL 16 o superior y Bun v1.x.x. Asegúrese también de tener instalado globalmente dotenvx y pm2; si no los tiene, instálelos y confirme que los comandos están disponibles ejecutando `dotenvx --version` y `pm2 --version`.

Colóquese en una shell en el directorio raíz del repositorio y adapte el archivo `.env` para que `DATABASE_URL` contenga la cadena de conexión adecuada a su instancia PostgreSQL. Por ejemplo:

```env
DATABASE_URL="postgresql://usuario:password@localhost:5432/swai"
```

Una vez ajustadas las variables de entorno, instale las dependencias del monorepo con Bun:

```bash
bun install
```

Con las dependencias resueltas y el `.env` configurado, ejecute el instalador semiautomático con el comando siguiente. El instalador seguirá internamente los pasos descritos en la sección técnica: compilación de los proyectos relevantes, ejecución del seed de la base de datos y puesta en marcha del servicio bajo pm2.

```bash
bun nx serve installer
```

Al completar, el instalador intentará dejar el servicio operativo. Verifique el resultado abriendo en un navegador la dirección [http://localhost:4000](http://localhost:4000). Para confirmar la funcionalidad administrativa, use las credenciales por defecto: usuario `admin` y contraseña `Swai%4dm1n157r4d0r`.

Si el instalador reporta errores, revise primero los logs que el propio instalador o pm2 puedan haber generado. Para inspeccionar el estado del proceso y sus registros utilice:

```bash
pm2 status
pm2 logs swai-server
```

Para detener el servicio iniciado por pm2:

```bash
pm2 stop swai-server
```

Si la semilla de la base de datos no se aplicó correctamente, puede ejecutarla manualmente con psql:

```bash
psql -U <usuario> -d <nombre_base_datos> -f prisma/seed.sql
```

Reemplace `<usuario>` y `<nombre_base_datos>` por sus valores reales. En caso de problemas de conexión a la base de datos, confirme que PostgreSQL está escuchando en el host y puerto configurados y que las credenciales de `DATABASE_URL` son correctas.

El instalador está pensado para simplificar la puesta en marcha manteniendo los puntos de validación esenciales. Si tras estas comprobaciones el sistema no queda operativo, consulte la sección técnica del manual para pasos de diagnóstico más detallados o diríjase a la documentación en línea para la versión más reciente.
