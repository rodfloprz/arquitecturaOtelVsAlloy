[← Anterior](23-hibridas.md) · [Índice](../README.md) · [Siguiente →](25-lockin.md)

# Seguridad, estabilidad y confiabilidad en producción

*Sección 13 · página 25 de 36*

<sub>Leyenda: ✅ verificado · 🟡 inferido · ⚠️ no confirmado · 🧪 preview o experimental</sub>

> Ninguna alternativa es más estable por pertenecer a un proveedor. Alloy ofrece garantías documentadas de compatibilidad para lo que es GA; Contrib mantiene un ritmo alto de cambios con componentes en distintos estados. La tabla separa lo documentado, lo observable y lo que debe validarse en piloto.

| Tema | Documentado | Hipótesis a validar en piloto |
| --- | --- | --- |
| Ciclo de releases | Alloy: minor cada tres semanas y parches cada una o dos ✅. Contrib: lanzamientos frecuentes; v0.163.0 el 14 de octubre de 2026 ✅ | Esfuerzo de upgrades continuos en cada alternativa |
| Compatibilidad hacia atrás | Alloy: garantías para GA; public preview y experimental no entran ✅. Contrib: cada release lista cambios incompatibles; v0.163.0 trae varios (supervisor, `prometheus_simple`, `sql_server`, redaction) ✅ | Frecuencia real de roturas en tu configuración |
| Deprecaciones | `loadbalancing` renombrado a `load_balancing` con alias; `reports_remote_config` del Supervisor se elimina en v0.165.0 ✅ | Plan de migración de nombres |
| Disponibilidad de componentes | Bundle OTel de Alloy es un subconjunto curado; componentes deprecados en upstream se retiran tras dos minors ✅ | Que el componente requerido siga en el bundle |
| Manejo de memoria | `memory_limiter` en ambas; límite por pod con margen ✅ | Perfil real bajo carga |
| Protección contra cardinalidad | Relabeling en origen; `filter` y `transform`; Adaptive Metrics en Cloud ✅ | Efectividad con los datos reales |
| Colas persistentes y pérdida de datos | Colas con `file_storage` en Contrib; WAL en `loki.write` de Alloy; el balanceador no soporta cola persistente en sub-exportadores ✅ | Recuperación tras corte con persistencia activa |
| Recuperación ante fallos | Alloy conserva la última configuración válida; el Supervisor no revierte solo ✅ | Prueba de corte de red y de configuración inválida |
| Interrupciones de red | Reintentos y colas por exportador; ventana de inconsistencia del resolver ✅ | Duración de los cortes tolerados |
| TLS y mTLS | Bloques `tls` en componentes de Alloy; configuración TLS en Collector ✅ | Rotación de certificados sin reinicio |
| Autenticación | Alloy: `otelcol.auth.basic`, `.bearer`, `.oauth2`, `.sigv4`, `.headers`, `.google`. Contrib: `basicauth`, `bearertokenauth`, `oauth2clientauth`, `sigv4auth`, `headerssetter` ✅ | Cobertura de identidades administradas de Azure ⚠️ |
| Rotación de credenciales | `basicauth` de Contrib acepta proveedores de secretos con rotación sin reinicio desde v0.163.0 ✅ | Equivalente en Alloy |
| Secretos | Alloy: `sys.env`, `remote.vault`, `remote.kubernetes.secret`. Contrib: providers `env`, `file`, `yaml`, `http`, `https` ✅ | Integración con el gestor corporativo |
| Autorización y aislamiento de tenants | Stacks y tokens de Grafana Cloud; `tenant_id` en `loki.write`; RBAC de Fleet Management por stack ✅ | Aislamiento por equipo con un solo stack ⚠️ |
| Vulnerabilidades y respuesta | Alloy publica política de seguridad y usa `govulncheck` en su repositorio ✅; parches y avisos de seguridad pueden publicarse en cualquier momento ✅ | Tiempo real de respuesta a un CVE |
| Observabilidad de los propios collectors | Alloy: UI, métricas, live debugging, support bundles; OTel Engine: métricas en 8888 y sin UI; Fleet Management con autodiagnóstico ✅ | Alertas propias sobre el pipeline |

### Garantías, comportamiento observado e hipótesis

| Categoría | Contenido |
| --- | --- |
| Garantía documentada | Compatibilidad hacia atrás de Alloy GA; estados de estabilidad por componente; cola, retry y timeout configurables |
| Comportamiento observado en documentación y changelogs | Cambios incompatibles frecuentes en Contrib; renombrados de componentes; promoción de componentes de alpha a beta entre releases |
| Hipótesis a validar | Rendimiento por núcleo, comportamiento ante corte largo, duplicados tras reinicio, esfuerzo real de upgrades |

*Fuentes: [repositorio de Alloy](https://github.com/grafana/alloy), [v0.163.0 de Contrib](https://newreleases.io/project/github/open-telemetry/opentelemetry-collector-contrib/release/v0.163.0), [loadbalancingexporter](https://pkg.go.dev/github.com/open-telemetry/opentelemetry-collector-contrib/exporter/loadbalancingexporter), [bundle OTel](https://grafana.com/docs/alloy/v1.20/reference/cli/otel.md), [OpenTelemetry en Alloy](https://grafana.com/docs/alloy/latest/introduction/otel_alloy/).*

---
[← Anterior](23-hibridas.md) · [Índice](../README.md) · [Siguiente →](25-lockin.md)
