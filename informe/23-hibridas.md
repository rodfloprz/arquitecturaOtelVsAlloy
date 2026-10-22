[← Anterior](22-gobierno.md) · [Índice](../README.md) · [Siguiente →](24-seguridad.md)

# Variantes híbridas: cuándo Contrib suma y cuándo solo duplica

*Sección 12 · página 24 de 36*

<sub>Leyenda: ✅ verificado · 🟡 inferido · ⚠️ no confirmado · 🧪 preview o experimental</sub>

> La híbrida no se recomienda como arquitectura general: añade distribuciones, sintaxis y diagnóstico sin una capacidad nueva que Alloy no cubra. C1 y C5 son válidas ante un requisito concreto.

| Variante | Qué es | Distribuciones | Veredicto |
| --- | --- | --- | --- |
| C1 | Agentes Alloy y gateway Contrib | 2 | Viable; se justifica solo ante un componente de trazas ausente en Alloy (por ejemplo `groupbytrace`) |
| C2 | Alloy para métricas y logs; Contrib para trazas | 2 | No necesaria: Alloy resuelve el pipeline de trazas |
| C3 | Contrib solo para capacidades no cubiertas | 1 o 2 | Regla de limitación, no arquitectura; hoy no hay una capacidad pedida que Alloy no cubra |
| C4 | Alloy en todas partes | 1 | **Recomendada como base** |
| C5 | Alloy con motor OTel como gateway | 1 binario, 2 motores | Alternativa a C1 sin segunda distribución; 🧪 preview, `otel-supervisor` 🧪 experimental |

C5 surge de verificar que el mismo binario de Alloy ejecuta YAML de Collector con `alloy otel`. Aporta sintaxis upstream sin segundo ciclo de upgrades, a cambio del riesgo de preview.

### Los ocho criterios de la extensión para recomendar la híbrida

| Criterio | ¿Se cumple? | Fundamento |
| --- | --- | --- |
| Ventaja real de administración centralizada de Alloy | Parcial | Onboarding oficial en Kubernetes y retorno a la última configuración válida; Contrib también se administra por OpAMP |
| Fleet Management cubre los agentes a gobernar | Parcial | Cubre ambos; Contrib en Kubernetes sin guía oficial |
| Contrib aporta capacidades que justifiquen su presencia | No | Tail sampling, balanceo, spanmetrics y servicegraph están en Alloy |
| Gobierno coherente de configuraciones | Parcial | Taxonomía única, dos sintaxis |
| No duplicar la recolección | Sí en C1; no en C2 | C1 limita Contrib al gateway |
| Pipelines fáciles de diagnosticar | No | Un salto más y dos herramientas |
| Esfuerzo razonable | No | Complejidad 3,3 frente a 1,6 |
| Portabilidad suficiente | Sí | OTLP y convenciones semánticas bastan; el motor OTel es salida |

### Complejidad operativa (1 muy sencillo, 5 muy complejo; estimación del analista)

| Criterio | A | B y C4 | C1 | C2 | C5 |
| --- | --- | --- | --- | --- | --- |
| Distribuciones de collectors | 1 | 1 | 3 | 3 | 2 |
| Configuraciones distintas | 2 | 2 | 4 | 4 | 3 |
| Sistemas de administración | 3 | 1 | 3 | 3 | 2 |
| Componentes externos | 4 | 1 | 3 | 3 | 2 |
| Complejidad de upgrades | 3 | 2 | 4 | 4 | 3 |
| Troubleshooting | 3 | 2 | 4 | 4 | 3 |
| Duplicación de recolección | 1 | 1 | 2 | 3 | 2 |
| Duplicación de pipelines | 1 | 1 | 3 | 3 | 3 |
| Código o controladores propios | 3 | 1 | 3 | 3 | 2 |
| Tiempo para un entorno nuevo | 3 | 2 | 3 | 3 | 3 |
| Tiempo para actualizar un agente | 3 | 2 | 3 | 3 | 3 |
| Tiempo para modificar una política | 2 | 2 | 3 | 3 | 3 |
| Esfuerzo ante pérdida de telemetría | 3 | 2 | 4 | 4 | 3 |
| Riesgo de divergencia entre agentes | 3 | 2 | 4 | 4 | 3 |
| Conocimiento especializado | 3 | 2 | 4 | 4 | 3 |
| **Promedio** | **2,5** | **1,6** | **3,3** | **3,4** | **2,7** |

Supuestos: flota mixta de Kubernetes y VMs en AWS y Azure, tres equipos operadores, Fleet Management en todas las variantes, GitOps con revisión obligatoria y un ingeniero con experiencia en Alloy y OpenTelemetry.

### Crecimiento: del piloto a miles de agentes

| Fase | Escala orientativa | Prácticas obligatorias | Límite a vigilar |
| --- | --- | --- | --- |
| Piloto | Decenas de colectores | Pipelines creados en la UI; atributos manuales; un stack | Ninguno relevante |
| Despliegue por equipos | Cientos | Git y `SyncPipelines`; Terraform para tokens y atributos; lectores; job de deriva; anillos canario | Tope de pipelines por stack (200 en la documentación) |
| Escala | Miles | Stacks por entorno o región; revisar `poll_frequency`; pedir aumento de límites | Tope de colectores por stack (ejemplo 2000) y de solicitudes por segundo |

Con los valores de ejemplo de la documentación (20 solicitudes por segundo para colectores), 2000 colectores Alloy con sondeo de 5 minutos generan unas 7 solicitudes por segundo y 2000 Supervisores OTel con sondeo de 30 segundos unas 67. Es aritmética sobre un ejemplo, no el límite real: se consulta con `GetLimits` 🟡.

---
[← Anterior](22-gobierno.md) · [Índice](../README.md) · [Siguiente →](24-seguridad.md)
