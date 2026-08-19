<?php
   require_once 'vendor/autoload.php';
   use Dombe\WeatherApp\WeatherService;

   $weatherService = new WeatherService();

   $city = $argv['1'];
   $weather = $weatherService->getWeather($city);

   echo "Weather in {$weather['city']}:\n";
   echo "Temperature: {$weather['temperature']}°C\n";
   echo "Description: {$weather['description']}\n";
   echo "Humidity: {$weather['humidity']}%\n";
   echo "Cloud Percentage: {$weather['cloud']}";
?>