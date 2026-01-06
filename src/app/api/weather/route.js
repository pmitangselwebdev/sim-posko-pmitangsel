export async function GET() {
  try {
    // Try to fetch from BMKG API first
    const response = await fetch('https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4=36.74.01.1001', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Dashboard/1.0)',
      },
      // Add timeout to prevent hanging
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    if (response.ok) {
      const data = await response.json();
      console.log('BMKG API response received successfully');

      // Extract weather data from the response
      let weatherData = {
        temperature: '25',
        humidity: '70',
        windSpeed: '10',
        weatherDesc: 'Cerah',
        forecast: []
      };

      // BMKG API structure: data[0].cuaca contains weather periods
      if (data && data.data && Array.isArray(data.data) && data.data.length > 0) {
        const cuaca = data.data[0].cuaca;
        if (cuaca && Array.isArray(cuaca) && cuaca.length > 0) {
          // Current weather (first period)
          const firstPeriod = cuaca[0];
          if (firstPeriod && Array.isArray(firstPeriod) && firstPeriod.length > 0) {
            const currentWeather = firstPeriod[0];
            weatherData = {
              temperature: currentWeather.t?.toString() || '25',
              humidity: currentWeather.hu?.toString() || '70',
              windSpeed: currentWeather.ws?.toString() || '10',
              weatherDesc: currentWeather.weather_desc || 'Cerah',
              forecast: []
            };
          }

          // Extract forecast for next day (typically periods 4-7 represent next day)
          const forecastData = [];
          for (let i = 4; i < Math.min(8, cuaca.length); i++) {
            const period = cuaca[i];
            if (period && Array.isArray(period) && period.length > 0) {
              const weatherEntry = period[0];
              if (weatherEntry) {
                forecastData.push({
                  time: weatherEntry.datetime || `${i * 6}:00`,
                  temperature: weatherEntry.t?.toString() || '25',
                  weatherDesc: weatherEntry.weather_desc || 'Cerah',
                  humidity: weatherEntry.hu?.toString() || '70'
                });
              }
            }
          }
          weatherData.forecast = forecastData;
        }
      }

      console.log('Extracted weather data from BMKG API:', weatherData);

      // Add caching headers for weather data (cache for 10 minutes)
      const response = Response.json(weatherData)
      response.headers.set('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=1200') // 10 min cache, 20 min stale
      response.headers.set('CDN-Cache-Control', 'max-age=600')
      response.headers.set('Vercel-CDN-Cache-Control', 'max-age=600')

      return response
    } else {
      console.warn('BMKG API returned status:', response.status, '- using fallback data');
      throw new Error(`BMKG API returned ${response.status}`);
    }
  } catch (error) {
    console.warn('Failed to fetch from BMKG API, using fallback weather data:', error.message);

    // Fallback weather data for Tangerang Selatan
    const fallbackWeatherData = {
      temperature: '31',
      humidity: '67',
      windSpeed: '12',
      weatherDesc: 'Cerah Berawan',
      forecast: [
        {
          time: '06:00',
          temperature: '28',
          weatherDesc: 'Cerah',
          humidity: '75'
        },
        {
          time: '12:00',
          temperature: '33',
          weatherDesc: 'Cerah Berawan',
          humidity: '60'
        },
        {
          time: '18:00',
          temperature: '30',
          weatherDesc: 'Berawan',
          humidity: '70'
        },
        {
          time: '00:00',
          temperature: '27',
          weatherDesc: 'Cerah',
          humidity: '80'
        }
      ]
    };

    console.log('Returning fallback weather data:', fallbackWeatherData);

    // Add caching headers for fallback data (cache for 5 minutes)
    const fallbackResponse = Response.json(fallbackWeatherData)
    fallbackResponse.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600') // 5 min cache, 10 min stale
    fallbackResponse.headers.set('CDN-Cache-Control', 'max-age=300')
    fallbackResponse.headers.set('Vercel-CDN-Cache-Control', 'max-age=300')

    return fallbackResponse
  }
}
