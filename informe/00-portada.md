[← Índice](../README.md) · [Índice](../README.md) · [Siguiente →](01-resumen.md)

# Alloy frente a OpenTelemetry Collector Contrib, con Grafana Cloud como backend

*Informe de arquitectura · página 1 de 36*

<sub>Leyenda: ✅ verificado · 🟡 inferido · ⚠️ no confirmado · 🧪 preview o experimental</sub>

> Evaluación para decidir cómo recolectar métricas, logs y trazas de una plataforma híbrida (Kubernetes y VMs, AWS y Azure) hacia Grafana Cloud, con GitOps y Terraform, y con preferencia por reducir el vendor lock-in.

Fecha de investigación: **21 de octubre de 2026**. Este informe responde al prompt maestro de evaluación y absorbe la extensión sobre arquitectura híbrida, Fleet Management y gobierno centralizado. Cada página es una sección; se navega con el índice, con los botones inferiores o con las flechas del teclado.

### Cómo leer las etiquetas

| Etiqueta | Significado |
| --- | --- |
| ✅ Verificado | Leído en documentación oficial, código o notas de versión durante esta investigación, con enlace |
| 🟡 Inferido | Deducción razonable a partir de lo verificado; se declara como supuesto |
| ⚠️ No confirmado | No se encontró evidencia oficial o la fuente es de terceros; no sustenta una recomendación |
| GA beta alpha 🧪 preview 🧪 experimental | Estado de madurez del componente según la documentación del proyecto |
| Confianza alta Confianza media Confianza baja | Confianza de una conclusión: alta si hay documentación oficial concordante, media si hay una sola fuente o inferencia, baja si depende de una hipótesis a validar en piloto |

### Resultado de compatibilidad en las matrices

| Resultado | Se usa cuando |
| --- | --- |
| Equivalente | Ambas alternativas habilitan la funcionalidad con el mismo trabajo de fondo |
| Equivalente con componentes adicionales | La alternativa lo logra, pero necesita componentes que no vienen en el collector |
| Parcial | Se obtiene una parte de la funcionalidad |
| No equivalente | No existe un camino equivalente en esa alternativa |

> **Nota.** Las cifras de esfuerzo en días-persona son estimaciones del analista con supuestos declarados; no son benchmarks. Ninguna conclusión de rendimiento (throughput, CPU, memoria) se sustenta en pruebas propias: la página de piloto define las pruebas que faltan.

---
[← Índice](../README.md) · [Índice](../README.md) · [Siguiente →](01-resumen.md)
