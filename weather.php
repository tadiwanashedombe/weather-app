<?php
require_once 'vendor/autoload.php';

if (file_exists(__DIR__ . '/.env')) {
    $dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
    $dotenv->load();
}

use Dombe\WeatherApp\WeatherService;

header('Content-Type: application/json');

$city = $_GET['city'] ?? 'Harare';

if (!is_string($city) || trim($city) === '') {
    http_response_code(400);
    echo json_encode(['error' => 'Enter a city name to search.']);
    exit;
}

try {
    $weatherService = new WeatherService();
    $weather = $weatherService->getWeather($city);
    echo json_encode($weather);
} catch (\GuzzleHttp\Exception\ClientException $e) {
    $apiError = json_decode((string) $e->getResponse()->getBody(), true);
    $status = $e->getResponse()->getStatusCode();

    if ($status === 400) {
        http_response_code(404);
        echo json_encode([
            'error' => $apiError['error']['message'] ?? 'That city could not be found. Check the spelling and try again.',
        ]);
    } elseif ($status === 401 || $status === 403) {
        http_response_code(502);
        echo json_encode(['error' => 'The weather service rejected the API credentials.']);
    } elseif ($status === 429) {
        http_response_code(503);
        echo json_encode(['error' => 'The weather service is temporarily unavailable. Please try again later.']);
    } else {
        http_response_code(502);
        echo json_encode(['error' => 'The weather service could not complete the request. Please try again.']);
    }
} catch (\GuzzleHttp\Exception\ConnectException $e) {
    http_response_code(502);
    echo json_encode(['error' => 'Could not connect to the weather service. Please try again later.']);
}
 catch (\GuzzleHttp\Exception\TransferException $e) {
    error_log($e->getMessage());
    http_response_code(502);
    echo json_encode(['error' => 'The weather service could not complete the request. Please try again.']);
} catch (\RuntimeException $e) {
    http_response_code(500);
    echo json_encode([
        'error' => $e->getMessage(),
    ]);
} catch (\Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Unable to fetch weather data. Please try again later.',
    ]);
}