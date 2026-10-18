<?php
namespace Dombe\WeatherApp;

use GuzzleHttp\Client;

class WeatherService
{
    private Client $client;
    private readonly ?string $apiKey;

    public function __construct(
        ?string $apiKey = null,
        private readonly string $apiUrl = 'https://api.weatherapi.com/v1/forecast.json'
    ) {
        $this->apiKey = $apiKey ?? ($_ENV['WEATHER_API_KEY'] ?? getenv('WEATHER_API_KEY') ?: null);
        $this->client = new Client();
    }

    public function getWeather(string $city): array
    {
        if (empty($this->apiKey)) {
            throw new \RuntimeException('WEATHER_API_KEY is missing. Add it to your .env file or server environment.');
        }

        $response = $this->client->get($this->apiUrl, [
            'query' => [
                'q' => $city,
                'key' => $this->apiKey,
                'days' => 7,
                'aqi' => 'no',
                'alerts' => 'no',
            ]
        ]);

        $weather = json_decode($response->getBody()->getContents(), true);

        return [
            'city' => $weather['location']['name'],
            'weather_icon' => $weather['current']['condition']['icon'],
            'description' => $weather['current']['condition']['text'],
            'temperature' => $weather['current']['temp_c'],
            'feels_like' => $weather['current']['feelslike_c'],
            'humidity' => $weather['current']['humidity'],
            'pressure' => $weather['current']['pressure_mb'],
            'uv' => $weather['current']['uv'],
            'windSpeed' => $weather['current']['wind_kph'],
            'forecast' => array_map(
                static fn (array $day): array => [
                    'date' => $day['date'],
                    'day_name' => date('D', strtotime($day['date'])),
                    'icon' => $day['day']['condition']['icon'],
                    'description' => $day['day']['condition']['text'],
                    'maxtemp_c' => $day['day']['maxtemp_c'],
                    'mintemp_c' => $day['day']['mintemp_c'],
                ],
                $weather['forecast']['forecastday'] ?? []
            )
        ];
    }
}