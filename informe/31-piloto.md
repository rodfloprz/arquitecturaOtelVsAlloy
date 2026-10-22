[← Anterior](30-puntuacion.md) · [Índice](../README.md) · [Siguiente →](32-riesgos.md)

# Plan de piloto por fases y criterios de aceptación

*Sección 18 · página 32 de 36*

> El piloto compara A y B con pipelines equivalentes y mide lo que este informe no pudo medir. Los umbrales de aceptación son propuestas para acordar con el cliente; ninguno proviene de un benchmark.

| Fase | Alcance | Pruebas y entregables | Criterio de aceptación (propuesta) |
| --- | --- | --- | --- |
| 1. Descubrimiento y diseño | Inventario de aplicaciones, exporters, fuentes de logs y necesidades de trazas; funciones de Grafana Cloud a habilitar; etiquetas, atributos y convenciones | Inventario de componentes requeridos y de pipelines de Logstash; diccionario de atributos; lista de componentes necesarios frente al catálogo de Alloy y de Contrib | 100 % de los componentes requeridos clasificados como disponibles, con alternativa o ausentes; diccionario aprobado |
| 2. Piloto funcional | Pipelines equivalentes en un entorno; discovery; Application Observability; Kubernetes, AWS y Azure; span metrics y service graphs | Un clúster, un grupo de VMs en cada nube, cinco servicios instrumentados con OTLP, uno con Prometheus | Cada vista de Application Observability y de Kubernetes Monitoring poblada con ambas alternativas; diferencias documentadas |
| 3. Carga y resiliencia | Throughput, latencia, CPU y memoria, cardinalidad, caídas de gateways, cortes de red, backpressure, persistencia, cambios de topología, duplicación y pérdida | Generador de carga con volúmenes derivados de las variables del cliente; pruebas de caos en gateways y en red | Pérdida de datos y fragmentación de trazas por debajo de un umbral acordado; recuperación sin intervención manual tras un corte de duración definida |
| 4. Gestión y seguridad | Terraform, GitOps, secretos, RBAC, versiones, rollback y auditoría | Pipeline de CI con validación; rollback ensayado; prueba de pérdida de Fleet Management; registro de accesos | Rollback de un cambio en un tiempo acordado; cero secretos en Git; operadores sin escritura en Fleet Management |
| 5. Evaluación de esfuerzo | Agentes, gateways, componentes externos, equipo, migración y mantenimiento de componentes propios | Modelo de esfuerzo en días-persona con las variables del cliente | Esfuerzo de A y B calculado con datos medidos y sensibilidad al tamaño del equipo |

### Pruebas que cierran los puntos abiertos

| Punto abierto | Prueba |
| --- | --- |
| Contrib registrado en Fleet Management dentro de Kubernetes | Desplegar Supervisor y collector en un pod y verificar alta, configuración remota y estado |
| Comportamiento del Supervisor sin conexión | Cortar la red del Supervisor y comprobar la configuración que ejecuta tras un reinicio |
| Disponibilidad de Fleet Management en el plan contratado | Consultar `GetLimits` del stack y la documentación del plan |
| Resolver y fragmentación | Escalar el nivel 2 de trazas con tráfico sintético y medir trazas partidas |
| Rendimiento de logs | Pruebas de la página de logs con carga representativa |
| Identidades administradas de Azure | Autenticar el collector con la identidad de la VM o del pod |

### Qué se mide en cada prueba de carga

CPU y memoria por réplica, latencia de extremo a extremo hasta que el dato es consultable, tasa de descarte de cada exportador, tamaño de colas, duración de la recuperación y duplicación. Ejecutar la prueba con la misma carga, la misma versión de Grafana Cloud y los mismos pipelines en ambas alternativas.

---
[← Anterior](30-puntuacion.md) · [Índice](../README.md) · [Siguiente →](32-riesgos.md)
