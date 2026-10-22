[← Anterior](21-gitops.md) · [Índice](../README.md) · [Siguiente →](23-hibridas.md)

# Gobierno por etiquetas y grupos: tres planos que no se mezclan

*Sección 12 · página 23 de 36*

<sub>Leyenda: ✅ verificado · 🟡 inferido · ⚠️ no confirmado · 🧪 preview o experimental</sub>

> Fleet Management ofrece solo atributos y matchers; los grupos, el control de acceso por entorno y la aprobación de cambios deben venir de Git, CI y Terraform. Una etiqueta nunca concede ni niega permisos.

| Plano | Qué es | Dónde vive | Regla |
| --- | --- | --- | --- |
| A. Administración | Atributos que clasifican agentes y deciden qué pipelines reciben | `remotecfg.attributes`, `non_identifying_attributes` del Supervisor, atributos remotos | Máximo 25 locales por solicitud y 100 remotos; clave hasta 100 y valor hasta 150 caracteres ✅ |
| B. Telemetría | Atributos de recurso y etiquetas que llegan a Grafana Cloud | Pipelines de recolección | Cada etiqueta nueva multiplica series; se promueven solo las que se consultan |
| C. Identidad y autorización | Quién cambia agentes, aprueba y administra | RBAC de Grafana Cloud, access policies, protección de ramas, permisos de Terraform | Independiente de las etiquetas |

### Taxonomía propuesta

Es una propuesta del cliente, no una capacidad nativa: el servicio solo compara texto.

| Etiqueta | Plano A | Plano B | Nota |
| --- | --- | --- | --- |
| `environment` | Sí | Sí | Clave de configuración por entorno |
| `cloud_provider` | Sí | Opcional | En OTel, el Supervisor reporta `cloud.*` solo |
| `region` | Sí | Sí | Elegir endpoint regional |
| `account` | Sí | Sí, alias lógico | Nunca credenciales |
| `cluster` | Sí | Sí | Único: forma parte del `collector_id` |
| `team` | Sí | Sí | Propietario operativo |
| `application` | Solo en agentes dedicados | Vía `service.name` | Un agente de infraestructura no tiene una aplicación |
| `role` | Sí | No | `infrastructure`, `kubernetes`, `logs`, `traces`, `gateway` |
| `signal` | Sí | No | Se compara con regex; no hay listas |
| `criticality` | Sí | No | Ventanas de cambio |
| `configuration_profile` | Sí | No | Perfil funcional |
| `cost_center` | Sí | Solo si se necesita en reportes de consumo | Validar el alcance de la atribución antes de promover |

### Clasificación de cuatro agentes (valores de ejemplo)

| Atributo | EKS producción (Alloy, DaemonSet) | Host EC2 Linux | VM de Azure | Gateway de trazas |
| --- | --- | --- | --- | --- |
| `environment` | prod | prod | prod | prod |
| `cloud_provider` | aws | aws | azure | aws |
| `region` | us-east-1 | us-east-1 | brazilsouth | us-east-1 |
| `account` | acct-payments-prod | acct-payments-prod | sub-payments-prod | acct-platform-prod |
| `cluster` | eks-pay-prod-01 | — | — | eks-plat-prod-01 |
| `team` | payments | payments | core-banking | platform |
| `role` | kubernetes | infrastructure | infrastructure | gateway |
| `criticality` | tier1 | tier2 | tier2 | tier1 |
| `configuration_profile` | k8s-standard | linux-standard | linux-standard | trace-gateway |
| Pipelines recibidos | base, env-prod, k8s-standard, team-payments | base, env-prod, linux-standard | base, env-prod, linux-standard | base, env-prod, trace-gateway |

### Requisitos de gobierno y su mecanismo

| Requisito | Mecanismo | Quién |
| --- | --- | --- |
| Configuración por entorno | Pipelines con matcher `environment` | Fleet Management |
| Perfiles base reutilizables | Pipeline base con `collector.os=~".+"` e inyección de exports entre pipelines | Fleet Management |
| Diferencias por equipo | Pipelines de capa con matchers `team` | Fleet Management |
| Secretos separados | `sys.env` y `remote.*`; nunca en Git | Gestor de secretos |
| Limitar quién modifica producción | Humanos de solo lectura; escritura solo del token de CI; aprobación en Git | Git, CI y RBAC |
| Validación previa | `alloy validate`, `alloy fmt`, `alloy otel validate` | CI |
| Historial y rollback | Git; historial de pipelines de Fleet como registro secundario | Git |
| Detectar agentes fuera de estándar | Inventory, `GetSummary` y comparación de `ListPipelines` con Git | Automatización propia |
| Alta con mínimo trabajo manual | Plantillas con `remotecfg` precargado; Terraform preregistra | Terraform y Helm |

Los matchers solo combinan con AND; para «prod o stage» se usa regex. El stack admite un número limitado de pipelines (200 en la documentación): las capas deben ser pocas y reutilizables.

---
[← Anterior](21-gitops.md) · [Índice](../README.md) · [Siguiente →](23-hibridas.md)
