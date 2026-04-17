<?php
// chat/server.php - Simple PHP WebSocket Server (Educational)
$host = 'localhost';
$port = 8080;

$socket = socket_create(AF_INET, SOCK_STREAM, SOL_TCP);
socket_set_option($socket, SOL_SOCKET, SO_REUSEADDR, 1);
socket_bind($socket, 0, $port);
socket_listen($socket);

echo "Chat server running on ws://$host:$port\n";

$clients = [$socket];

while (true) {
    $read = $clients;
    $write = $except = null;
    socket_select($read, $write, $except, null);

    if (in_array($socket, $read)) {
        $newSocket = socket_accept($socket);
        $clients[] = $newSocket;
        $header = socket_read($newSocket, 1024);
        perform_handshaking($header, $newSocket, $host, $port);
        unset($read[array_search($socket, $read)]);
    }

    foreach ($read as $readSocket) {
        $data = socket_read($readSocket, 1024);
        if ($data === false) {
            unset($clients[array_search($readSocket, $clients)]);
            socket_close($readSocket);
            continue;
        }
        
        $message = unmask($data);
        if ($message) {
            $response = mask(json_encode(['message' => $message]));
            foreach ($clients as $clientSocket) {
                if ($clientSocket != $socket) {
                    @socket_write($clientSocket, $response, strlen($response));
                }
            }
        }
    }
}

// Helpers for WebSocket Protocol
function perform_handshaking($receved_header, $client_conn, $host, $port) {
    $headers = array();
    $lines = preg_split("/\r\n/", $receved_header);
    foreach($lines as $line) {
        $line = chop($line);
        if(preg_match('/\A(\S+): (.*)\z/', $line, $matches)) {
            $headers[$matches[1]] = $matches[2];
        }
    }

    $secKey = $headers['Sec-WebSocket-Key'];
    $secAccept = base64_encode(pack('H*', sha1($secKey . '258EAFA5-E914-47DA-95CA-C5AB0DC85B11')));
    $upgrade  = "HTTP/1.1 101 Switching Protocols\r\n" .
                "Upgrade: websocket\r\n" .
                "Connection: Upgrade\r\n" .
                "Sec-WebSocket-Accept:$secAccept\r\n\r\n";
    socket_write($client_conn, $upgrade, strlen($upgrade));
}

function mask($text) {
    $b1 = 0x80 | (0x1 & 0x0f);
    $length = strlen($text);
    if($length <= 125) $header = pack('CC', $b1, $length);
    else $header = pack('CCn', $b1, 126, $length);
    return $header.$text;
}

function unmask($text) {
    $length = ord($text[1]) & 127;
    if($length == 126) { $masks = substr($text, 4, 4); $data = substr($text, 8); }
    elseif($length == 127) { $masks = substr($text, 10, 4); $data = substr($text, 14); }
    else { $masks = substr($text, 2, 4); $data = substr($text, 6); }
    $text = "";
    for ($i = 0; $i < strlen($data); ++$i) {
        $text .= $data[$i] ^ $masks[$i%4];
    }
    return $text;
}
?>
