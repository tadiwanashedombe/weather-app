<?php
   require_once 'vendor/autoload.php';
   use Dombe\WeatherApp\WeatherService;

   header('Content-Type:application/json');


   $city = $_GET['city'] ?? 'Harare';
   
   try{
      $weatherService = new WeatherService();
      $weather = $weatherService->getWeather($city);
      echo (json_encode($weather));
   }catch(\Exception $e){
      http_response_code(500);
      echo json_encode([
         'error' => 'Unable to fetch data',
         'debug'  => $e->getMessage()
      ]);
   }
?>