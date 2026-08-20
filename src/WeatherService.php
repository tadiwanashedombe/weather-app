<?php
    namespace Dombe\WeatherApp;

    use GuzzleHttp\Client;

    class WeatherService
    {

        private Client $client;

        public function __construct(
            private readonly string $apiKey = 'e1f02cb6e4f5485ba9774754261808',
            private readonly string $apiUrl = 'https://api.weatherapi.com/v1/current.json'
        ) {
            $this->client = new Client();
        }

        public function getWeather(string $city): array
        {
            $response = $this->client->get($this->apiUrl, [
                'query' => [
                    'q' => $city,
                    'key' => $this->apiKey,
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
                'windSpeed' => $weather['current']['wind_kph']
            ];
        }
    }
