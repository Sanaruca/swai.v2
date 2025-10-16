---
layout: page
title: 📘 Documentación Técnica de Instalación
---

**SWAI — Sistema Web de Administración Institucional**

Esta guía describe los pasos técnicos necesarios para instalar y ejecutar **SWAI** en un entorno local o de servidor.

## ✅ Requisitos previos

Antes de comenzar, asegúrate de tener instaladas las siguientes dependencias:

- **Node.js** `v22.x.x`
- **PostgreSQL** `16` o superior
- **Bun** `v1.x.x`

Además, se recomienda instalar de forma global:

```bash
bun install -g dotenvx pm2
```

Verifica que los comandos estén disponibles:

```bash
dotenvx --version
pm2 --version
```

---

## ⚙️ Pasos de instalación

### 1. Ubicarse en el directorio raíz del proyecto

Abre una terminal y navega hasta la carpeta principal del repositorio:

```bash
cd /ruta/al/proyecto
```

---

### 2. Configurar la base de datos

Edita el archivo `.env` y modifica la variable `DATABASE_URL` con las credenciales de tu base de datos PostgreSQL:

```env
DATABASE_URL="postgresql://<USER>:<PASSWORD>@localhost:5432/sanz"
```

---

### 3. Instalar dependencias

Ejecute el siguiente comando para instalar las dependencias del proyecto:

```bash
bun install
```

### 4. Construir la aplicación

Compila los proyectos principales:

```bash
bun nx run-many --target build --projects 'swai,server'
```

### 5. Ejecutar el seed de la base de datos

Carga los datos iniciales ejecutando el script `prisma/seed.sql`:

```bash
psql -U <usuario> -d <nombre_base_datos> -f prisma/seed.sql
```

_(Reemplaza `<usuario>` y `<nombre_base_datos>` con tus valores reales.)_

### 6. Iniciar la aplicación

Ejecuta el servidor con **dotenvx** y **pm2**:

```bash
dotenvx run -- pm2 start --name swai-server node -- dist/swai/server/server.mjs
```

## 🌐 Acceso a la aplicación

Si todo fue correcto, abre en tu navegador:

👉 [http://localhost:4000](http://localhost:4000)

### 🔑 Credenciales de administración por defecto

- **Usuario:** `admin`
- **Contraseña:** `Swai%4dm1n157r4d0r`

## 📌 Notas finales

- Se recomienda mantener **pm2** corriendo como servicio para asegurar la persistencia del proceso.
- Para detener el servidor:
  ```bash
  pm2 stop swai-server
  ```
- Para ver logs:
  ```bash
  pm2 logs swai-server
  ```
