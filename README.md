# Evaluación de observabilidad: Grafana Alloy frente a OpenTelemetry Collector Contrib

Informe de arquitectura para decidir cómo recolectar métricas, logs y trazas hacia Grafana Cloud en una plataforma híbrida (Kubernetes y VMs, AWS y Azure), con GitOps, Terraform y preferencia por reducir el vendor lock-in.

Fecha de investigación: **21 de octubre de 2026** · Versiones evaluadas: OpenTelemetry Collector Contrib v0.163.0 (14 de octubre de 2026) y documentación de Grafana Alloy v1.21.

> **Conclusión.** Alloy con su motor por defecto como agente estándar, gobernado con Fleet Management, GitOps y Terraform; trazas con tail sampling en dos niveles o Adaptive Traces; Contrib solo como gateway acotado ante un componente que Alloy no tenga.

## Cómo navegar

Todo se lee directamente en GitHub: abre una página del índice y usa los enlaces **Anterior · Índice · Siguiente** de cada página. Las tablas y los diagramas se muestran sin instalar nada.

## Índice del informe

<!-- INDICE:INICIO -->

**Resumen y método**

- [Portada y cómo leer](informe/00-portada.md)
- [1. Resumen ejecutivo](informe/01-resumen.md)
- [2. Conclusiones y recomendación preliminar](informe/02-conclusiones.md)
- [3. Supuestos, versiones y metodología](informe/03-supuestos.md)

**Arquitectura y discovery**

- [4a. Arquitectura de la opción A (Contrib)](informe/04-arq-a.md)
- [4b. Arquitectura de la opción B (Alloy)](informe/05-arq-b.md)
- [4c. Arquitectura lógica recomendada](informe/06-arq-logica.md)
- [5a. Discovery: qué significa y matriz](informe/07-discovery.md)
- [5b. Arquitectura OTel sin Alloy y esfuerzo](informe/08-discovery-sin-alloy.md)

**Métricas y aplicaciones**

- [6a. Métricas de infraestructura: patrones](informe/09-metricas-patrones.md)
- [6b. Configuraciones de métricas](informe/10-metricas-config.md)
- [7a. Instrumentación: OTel y Prometheus](informe/11-instrumentacion.md)
- [7b. Ejemplos en Java, .NET y Go](informe/12-instrumentacion-ejemplos.md)
- [8a. Logs: comparación de agentes](informe/13-logs.md)
- [8b. Logs: decisión, portabilidad y pruebas](informe/14-logs-decision.md)

**Trazas y span metrics**

- [9a. Trazas: pipeline 100% OpenTelemetry](informe/15-trazas.md)
- [9b. Load-balancing exporter en detalle](informe/16-loadbalancing.md)
- [10. Span metrics y Application Observability](informe/17-spanmetrics.md)

**Plataforma y operación**

- [11a. Kubernetes](informe/18-kubernetes.md)
- [11b. AWS y Azure](informe/19-nubes.md)
- [12a. Fleet Management: lo verificado](informe/20-fleet.md)
- [12b. GitOps, Terraform y repositorios](informe/21-gitops.md)
- [12c. Gobierno por etiquetas](informe/22-gobierno.md)
- [12d. Variantes híbridas C1 a C5](informe/23-hibridas.md)
- [13. Seguridad, estabilidad y operación](informe/24-seguridad.md)
- [14. Vendor lock-in y portabilidad](informe/25-lockin.md)

**Configuraciones y matrices**

- [15a. Configuraciones: logs y trazas](informe/26-cfg-logs-trazas.md)
- [15b. Configuraciones: Grafana Cloud, Kubernetes y GitOps](informe/27-cfg-gitops-k8s.md)
- [16a. Inventario funcional de Grafana Cloud](informe/28-inventario.md)
- [16b. Matriz de funcionalidades y esfuerzo](informe/29-matriz.md)

**Decisión**

- [17. Matriz de puntuación ponderada](informe/30-puntuacion.md)
- [18. Plan de piloto y criterios de aceptación](informe/31-piloto.md)
- [19. Riesgos, limitaciones y preguntas abiertas](informe/32-riesgos.md)
- [20. Recomendación arquitectónica final](informe/33-recomendacion.md)

**Anexos**

- [A. Esfuerzo operativo a tres años](informe/34-esfuerzo.md)
- [B. Fuentes y afirmaciones no verificadas](informe/35-fuentes.md)

<!-- INDICE:FIN -->

## Otros materiales

| Qué | Dónde |
| --- | --- |
| Presentación de 26 diapositivas con notas del orador | [`presentacion/`](presentacion/) (se descarga y se abre en PowerPoint) |
| Configuraciones de ejemplo de Alloy y del Collector | [`ejemplos/`](ejemplos/) |
| Versión HTML paginada con calculadora de sensibilidad | `docs/index.html` (solo se ve renderizada con GitHub Pages; ver abajo) |
| Fuente editable del informe | [`fuente/src/`](fuente/src/) |

## Etiquetas de evidencia

| Marca | Significado |
| --- | --- |
| ✅ | Verificado: leído en documentación oficial, código o notas de versión, con enlace |
| 🟡 | Inferido: deducción razonable a partir de lo verificado |
| ⚠️ | No confirmado: sin evidencia oficial; no sustenta recomendaciones |
| 🧪 | Componente en preview o experimental |

## Publicar la versión HTML con GitHub Pages (opcional)

GitHub muestra los archivos `.html` como código, no renderizados; por eso el informe se ofrece también en Markdown. Si además quieres la versión HTML:

1. En el repositorio, abre **Settings → Pages**.
2. En **Source** elige **Deploy from a branch**, rama `main` y carpeta `/docs`, y guarda.
3. Espera uno o dos minutos; GitHub mostrará la dirección de la página.

La disponibilidad de Pages para repositorios privados depende del plan de tu cuenta u organización; confírmalo en la documentación de GitHub. El informe en Markdown funciona sin Pages en repositorios privados.

## Regenerar el informe

```bash
npm install
npm run build        # genera informe/*.md, el índice de este README y docs/index.html
```

Edita siempre `fuente/src/*.md`, no los archivos generados. Cada archivo empieza con metadatos (`id`, `group`, `nav`, `section`, `title`). Los diagramas HTML se leen de `fuente/diagrams/`; en las páginas Markdown se usan los bloques Mermaid, que GitHub renderiza.

## Advertencias

- No hay benchmarks propios de CPU, memoria, throughput ni latencia; las pruebas necesarias están en la sección 18.
- Las cifras de esfuerzo en días-persona son estimaciones del analista, no mediciones.
- Las configuraciones de `ejemplos/` son plantillas: valida cada una con `alloy validate` o `otelcol validate` antes de usarla. Ninguna se ejecutó en esta investigación.
- Los ejemplos usan variables de entorno para las credenciales; no incluyas secretos reales en el repositorio.
- Quedan puntos sin confirmar (por ejemplo, Contrib registrado en Fleet Management dentro de Kubernetes); están en el Anexo B.

## Visibilidad y licencia

Se recomienda crear el repositorio como **privado**. No se incluye archivo de licencia: añade la que corresponda antes de compartirlo.
