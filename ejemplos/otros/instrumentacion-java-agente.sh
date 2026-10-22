# Modelo A. El agente instrumenta HTTP, JDBC y mensajería sin tocar el código.
export OTEL_SERVICE_NAME=checkout
export OTEL_RESOURCE_ATTRIBUTES=service.namespace=payments,deployment.environment=prod
export OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318   # agente local (Alloy o Contrib)
export OTEL_EXPORTER_OTLP_PROTOCOL=http/protobuf
java -javaagent:/opt/otel/opentelemetry-javaagent.jar -jar checkout.jar
