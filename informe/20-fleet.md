[← Anterior](19-nubes.md) · [Índice](../README.md) · [Siguiente →](21-gitops.md)

# Fleet Management: qué cubre realmente

*Sección 12 · página 21 de 36*

<sub>Leyenda: ✅ verificado · 🟡 inferido · ⚠️ no confirmado · 🧪 preview o experimental</sub>

> Fleet Management administra hoy Alloy y OpenTelemetry Collector, pero solo cubre configuración remota, atributos, salud y estado de rollout. No documenta actualización de binarios ni aprovisionamiento de infraestructura. Gestionar la configuración con GitOps no es lo mismo que disponer de un servicio central de administración de agentes.

### Dos protocolos ✅

- **Alloy Remote Config.** Bloque `remotecfg` en la configuración raíz de Alloy (no en módulos); sin componentes extra.
- **OpAMP.** Para cualquier distribución de Collector con la extensión OpAMP y para el motor OTel de Alloy. La configuración remota solo funciona con el OpAMP Supervisor en el mismo host; con la extensión sola solo se obtiene salud.

### Las 14 verificaciones

| # | Verificación | Hallazgo | Evidencia |
| --- | --- | --- | --- |
| 1 | Agentes administrables | Alloy (v1.7.2 o posterior), Collector por OpAMP y motor OTel de Alloy | ✅ |
| 2 | ¿Solo Alloy? | No; Contrib con Supervisor en el mismo host; `otel-supervisor` integrado en Alloy es experimental | ✅ |
| 3 | Versiones y requisitos | Configuración efectiva reportada desde Alloy v1.12.0; token `set:alloy-data-write` o `set:otel-data-write`; ejemplo oficial: 200 pipelines y 2000 colectores por stack | ✅ |
| 4 | Alta de agentes | `remotecfg` (url, auth, id); chart de Kubernetes Monitoring desde v2.0; OTel: `supervisor.yaml` a `/v1/opamp`; Terraform preregistra | ✅ |
| 5 | Grupos | No hay grupos; pipelines con matchers `=`, `!=`, `=~`, `!~` con lógica AND | ✅ |
| 6 | Etiquetas | Locales (máximo 25) y remotas (hasta 100, prevalecen); clave hasta 100 y valor hasta 150 caracteres; reservados `collector.*` | ✅ |
| 7 | Segmentación por entorno, región, cuenta, clúster, equipo, aplicación, señal, criticidad | Atributos libres; ninguna dimensión es nativa | 🟡 |
| 8 | Desplegar, validar, versionar, revertir | UI, API, Terraform y GitHub Action; validador de sintaxis Alloy; historial con restauración; sin oleadas ni canary | ✅ / ⚠️ oleadas |
| 9 | Errores y salud | Pipelines `self_monitoring_*`; sin alertas predefinidas | ✅ |
| 10 | Pérdida de conectividad | Alloy sigue con la última configuración válida cacheada; el Supervisor no revierte solo | ✅ Alloy / 🟡 OTel |
| 11 | Drift Git frente a efectivo | UI bloquea ediciones externas; `SyncPipelines` borra lo que no está en la fuente | ✅ |
| 12 | Kubernetes frente a VMs | Alloy en Kubernetes: chart oficial; OTel: guía oficial solo para hosts y VMs | ✅ / ⚠️ OTel en Kubernetes |
| 13 | Seguridad y conectividad | Token con scopes, basic auth, gateway de Grafana Cloud, PrivateLink, Private Link y Private Service Connect | ✅ |
| 14 | Escala y multi-equipo | Dos roles de plugin por stack (lector y administrador), sin alcance por entorno | ✅ |

### Las siete funciones, separadas

| Función | ¿Fleet Management? | Quién la cubre en su lugar |
| --- | --- | --- |
| Administración centralizada de agentes | Sí | — |
| Distribución de configuraciones | Sí (Alloy sondea con `poll_frequency`; OTel cada 30 s) | — |
| Aprovisionamiento de infraestructura | No | Terraform, Helm, Argo CD o Flux |
| Gobierno GitOps | Parcial: GitHub Action, `SyncPipelines`, Terraform | Git con revisión obligatoria |
| Gestión de versiones de software | No documentada | Helm, paquetes o automatización de hosts |
| Descubrimiento y asignación de targets | No | `discovery.*` y clustering (Alloy), Target Allocator (Contrib) |
| Observabilidad del agente | Sí | — |

### Qué pasa con Contrib

Se obtiene un nivel de administración equivalente por OpAMP, con dos reservas: no hay guía oficial en Kubernetes y OpAMP está en beta. Sin Fleet Management, la alternativa es GitOps puro (Argo CD o Flux con Helm y los CRDs del Operator) sin inventario ni estado centralizados, o un servidor OpAMP de terceros 🟡.

*Fuentes: [introducción](https://grafana.com/docs/grafana-cloud/send-data/fleet-management/introduction/?pg=asserts), [arquitectura](https://grafana.com/docs/grafana-cloud/observe-and-act/send-data/fleet-management/introduction/architecture.md), [glosario](https://grafana.com/docs/grafana-cloud/send-data/fleet-management/introduction/glossary.md), [onboarding de Alloy](https://grafana.com/docs/grafana-cloud/send-data/fleet-management/set-up/onboard-collectors/standalone-installations.md), [de OTel](https://grafana.com/docs/grafana-cloud/observe-and-act/send-data/fleet-management/set-up/onboard-collectors/standalone-otel.md), [Tenant API](https://grafana.com/docs/grafana-cloud/observe-and-act/send-data/fleet-management/api-reference/tenant-api.md), [RBAC](https://grafana.com/docs/grafana-cloud/observe-and-act/send-data/fleet-management/set-up/role-based-access-control.md).*

---
[← Anterior](19-nubes.md) · [Índice](../README.md) · [Siguiente →](21-gitops.md)
