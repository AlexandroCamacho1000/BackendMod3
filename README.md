# 📝 API DE NOTAS Alejandro Camacho

API RESTful para gestión de notas con autenticación JWT, roles (usuario/admin) y envío de correos.

## 🚀 Tecnologías

- Node.js
- Express
- MongoDB (Atlas)
- JWT (JSON Web Tokens)
- Nodemailer
- Multer (subida de imágenes)

---

## 📋 Principios RESTful aplicados

| Principio | Cómo se aplica |
|-----------|----------------|
| **Recursos** | `/notes` (notas), `/auth` (autenticación) |
| **Verbos HTTP** | GET, POST, PUT, DELETE |
| **Stateless** | JWT en header `Authorization: Bearer <token>` |
| **Códigos HTTP** | 200, 201, 204, 400, 401, 403, 404, 500 |
| **Formato JSON** | Todas las respuestas en JSON |

---

## 🔐 Autenticación

### Registrar usuario