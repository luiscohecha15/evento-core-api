# **Enunciado del Proyecto Final: Sistema de Gestión de Eventos “Eventia Core API”**

## **1. Descripción General**

El objetivo del proyecto es desarrollar **Eventia Core API**, un backend que gestione eventos, participantes y registros de asistencia. Esta API será el núcleo de futuras aplicaciones web y móviles, por lo que debe construirse siguiendo principios de calidad profesional, pruebas automatizadas e integración continua.

Los estudiantes pueden elegir libremente:

* Lenguaje backend
* Framework
* ORM o cliente de base de datos
* Motor de base de datos
* Sistema de caché
* Estilo arquitectónico (Clean Architecture, MVC u otro bien estructurado)

No se debe construir interfaz gráfica.

---

## **2. Contexto del Sistema**

Eventia permite administrar:

1. **Eventos:** creación, actualización, eliminación, consulta.
2. **Participantes:** registro, actualización, eliminación, consulta.
3. **Asistencia:** permitir que participantes se registren a eventos, verificar capacidad, generar estadísticas.
4. **Caché:** acelerar consultas recurrentes (por ejemplo, estadísticas o validación rápida de disponibilidad).

---

## **3. Requerimientos Técnicos Obligatorios**

### **3.1 API REST**

* Endpoints para eventos, participantes y asistencia.
* JSON como formato de entrada y salida.
* Manejo adecuado de errores y códigos HTTP.

### **3.2 Lógica de Negocio**

Debe estar desacoplada de la capa HTTP.
Debe existir un servicio o módulo que implemente las reglas, como:

* Validación de cupos
* Evitar doble registro
* Generar estadísticas de ocupación

### **3.3 Base de Datos (libre elección)**

Relacional o no relacional.
Debe incluir como mínimo:

* Eventos
* Participantes
* Relación asistencia (tabla intermedia o colección)

### **3.4 Sistema de Caché (libre elección)**

Usar un servicio como Redis o equivalente.
Debe aplicarse en uno de estos casos:

* Estadísticas
* Consultas frecuentes
* Verificación de cupos
* Almacenamiento temporal

### **3.5 Pruebas Automatizadas**

Obligatorias:

* Pruebas unitarias
* Pruebas de integración
* Pruebas de sistema o end-to-end

### **3.6 Análisis Estático de Seguridad**

Herramienta según el lenguaje (Bandit, ESList Security, Gosec, etc.).

### **3.7 Código Limpio**

* Nombres descriptivos
* Modularidad
* Respeto por responsabilidad única
* Manejo de errores
* Evitar duplicación

### **3.8 Integración Continua (GitHub Actions)**

Workflow obligatorio con pasos:

1. Instalar dependencias
2. Ejecutar pruebas unitarias
3. Ejecutar pruebas de integración
4. Ejecutar análisis estático
5. Ejecutar pruebas de sistema (si aplica)

Si todo pasa: imprimir en consola **OK**
Si algo falla: pipeline en estado Failed

### **3.9 Ejecución Local**

Debe ejecutarse con instrucciones claras en el README.
Puede usarse entorno virtual o herramienta del framework.

### **3.10 Documentación (README obligatorio)**

Debe incluir:

* Introducción al proyecto
* Arquitectura utilizada y explicación
* Requisitos
* Instalación
* Ejecución en local
* Ejecución de pruebas
* Explicación del pipeline
* Justificación de tecnologías elegidas

---

## **4. Requisito Deseable (0.5 puntos adicionales)**

**Contenerización con Docker y Docker Compose:**

* Contenedor para el backend
* Contenedor para la base de datos
* Contenedor para el sistema de caché
* Levantar todo con un solo comando usando docker-compose

---

# **5. Ejemplos de Estructuras de Carpetas**

Los estudiantes pueden elegir cualquiera. Deben mantener orden, modularidad y coherencia.

---

## **A. Ejemplo de Arquitectura Limpia (Clean Architecture)**

```
project/
  src/
    domain/
      entities/
        event.py
        participant.py
      interfaces/
        event_repository.py
        participant_repository.py
        attendance_repository.py
      services/
        event_service.py
        participant_service.py
        attendance_service.py

    infrastructure/
      database/
        models/
          event_model.py
          participant_model.py
          attendance_model.py
        repositories/
          event_repository_impl.py
          participant_repository_impl.py
          attendance_repository_impl.py
      cache/
        cache_client.py
      config/
        settings.py
        env_loader.py

    application/
      dtos/
        event_dto.py
        participant_dto.py
      controllers/
        event_controller.py
        participant_controller.py
        attendance_controller.py
      routes/
        event_routes.py
        participant_routes.py
        attendance_routes.py

    api/
      main.py

  tests/
    unit/
    integration/
    system/

  .env.example
  docker-compose.yml (opcional)
  Dockerfile (opcional)
  requirements.txt o package.json
  README.md
```

---

## **B. Ejemplo de Arquitectura MVC**

```
project/
  src/
    models/
      event_model.py
      participant_model.py
      attendance_model.py

    controllers/
      event_controller.py
      participant_controller.py
      attendance_controller.py

    services/
      event_service.py
      participant_service.py
      attendance_service.py

    routes/
      event_routes.py
      participant_routes.py
      attendance_routes.py

    cache/
      cache_client.py

    config/
      config.py
      env.py

    app.py

  tests/
    unit/
    integration/
    system/

  migrations/
  docker-compose.yml (opcional)
  Dockerfile (opcional)
  README.md
  .env.example
```

---

## **C. Estructura más simple tipo servicios + módulos**

```
project/
  src/
    modules/
      events/
        controller.py
        service.py
        repository.py
        model.py
        routes.py

      participants/
        controller.py
        service.py
        repository.py
        model.py
        routes.py

      attendance/
        controller.py
        service.py
        repository.py
        model.py
        routes.py

    shared/
      cache/
      database/
      config/

    api.py

  tests/
    unit/
    integration/
    system/

  README.md
  .env.example
```

---

# **6. Entregables Finales**

* Repositorio en GitHub con:

  * Código completo
  * Pruebas
  * Pipeline de GitHub Actions
  * README bien estructurado
  * Arquitectura organizada
* API funcionando en local
* Docker Compose opcional para 0.5 puntos extra
