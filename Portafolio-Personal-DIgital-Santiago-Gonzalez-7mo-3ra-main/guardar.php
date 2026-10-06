<?php
header('Content-Type: application/json; charset=utf-8');
mysqli_report(MYSQLI_REPORT_OFF);

$datos = json_decode(file_get_contents('php://input'), true);

if (!$datos || empty($datos['Nombre']) || empty($datos['Correo']) || empty($datos['mensaje'])) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Faltan datos (probá desde el formulario, no abriendo este archivo directo)']);
    exit;
}

$conn = @new mysqli('localhost', 'root', '', 'FormularioProgramacion');
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'No conecta a MySQL: ' . $conn->connect_error]);
    exit;
}
$conn->set_charset('utf8mb4');

$stmt = $conn->prepare("INSERT INTO mensajes (Nombre, Correo, mensaje) VALUES (?, ?, ?)");
if (!$stmt) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Error en la tabla: ' . $conn->error]);
    exit;
}

$stmt->bind_param('sss', $datos['Nombre'], $datos['Correo'], $datos['mensaje']);

if ($stmt->execute()) {
    echo json_encode(['ok' => true]);
} else {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'No se pudo guardar: ' . $stmt->error]);
}
?>
