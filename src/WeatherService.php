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
                'temperature' => $weather['current']['temp_c'],
                'description' => $weather['current']['condition']['text'],
                'humidity' => $weather['current']['humidity'],
                'cloud' => $weather['current']['uv']
            ];
        }
    }
