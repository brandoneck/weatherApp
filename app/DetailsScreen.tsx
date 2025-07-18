import { useLocalSearchParams } from "expo-router";
import * as React from "react";
import { useEffect, useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { getWeatherList } from "../constants/urls";
import { useFetch } from "../hooks/useFetch";

interface ForecastDay {
  date: string;
  day: {
    maxtemp_c: number;
    mintemp_c: number;
    condition: {
      text: string;
      icon: string;
    };
  };
}

interface WeatherData {
  forecast: {
    forecastday: ForecastDay[];
  };
}

type Params = {
  name: string;
  country: string;
  lat: string; // O number, dependiendo de cómo los pasas
  lon: string;
};

const DetailsScreen = () => {
  const { getData } = useFetch();
  const moment = require("moment");
  const params = useLocalSearchParams<Params>();
  const { name, country, lat, lon } = params;
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [errorMessage, setErrorMessage] = useState(false);
  const today = new Date();

  const getDateName = (day: number): string => {
    var newDate = moment(today, "DD-MM-YYYY").add("days", day);
    return newDate.format("dddd-DD-MM-YYYY");
  };

  const getURL = (value: string): string => {
    var newURL = value.startsWith("http") ? value : `https:${value}`;
    return newURL;
  };

  useEffect(() => {
    getWeather();
  }, []);

  const getWeather = async (): Promise<void> => {
    setErrorMessage(false);
    try {
      const response = await getData(getWeatherList(lat, lon));

      if (response.data) {
        setWeatherData(response.data);
      }
    } catch (error: any) {
      setErrorMessage(true);
      throw new Error(error);
    }
  };

  return (
    <SafeAreaView style={styleDetails.mainContainer}>
      <ScrollView style={styleDetails.container}>
        <Image
          style={styleDetails.banner}
          source={{
            uri: "https://cdn-icons-png.flaticon.com/512/10127/10127236.png",
          }}
        />
        <View style={styleDetails.detailsView}>
          <Text style={styleDetails.titlePlace}>{`${name}, ${country}`}</Text>

          {weatherData?.forecast.forecastday?.map(
            (day: ForecastDay, index: number) => (
              <View style={styleDetails.daysView} key={index}>
                <Text style={styleDetails.titleDay}>{getDateName(index)}</Text>
                <Text style={styleDetails.title}>
                  {`Description: `}
                  <Text style={styleDetails.text}>
                    {`${day.day.condition.text}`}
                  </Text>
                  <Image
                    style={styleDetails.icon}
                    source={{
                      uri: getURL(day.day.condition.icon),
                    }}
                  />
                </Text>

                <Text style={styleDetails.title}>
                  {`Min: `}
                  <Text
                    style={styleDetails.text}
                  >{`${day.day.maxtemp_c}`}</Text>
                  {`, Max: `}
                  <Text
                    style={styleDetails.text}
                  >{`${day.day.mintemp_c}`}</Text>
                </Text>
              </View>
            )
          )}
        </View>
        {errorMessage && (
          <Text style={styleDetails.errorText}>No results found!</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default DetailsScreen;

const styleDetails = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 20,
    margin: 10,
    backgroundColor: "white",
  },
  container: {
    padding: 20,
    flex: 1,
  },
  detailsView: {
    alignItems: "center",
    gap: 12,
  },
  daysView: {
    marginTop: 20,
    alignItems: "center",
  },
  banner: {
    width: 120,
    height: 120,
    marginTop: 20,
    marginBottom: 20,
    alignSelf: "center",
  },
  icon: {
    width: 20,
    height: 20,
    alignSelf: "center",
  },
  titlePlace: {
    fontWeight: "bold",
    fontSize: 20,
    color: "blue",
    textAlign: "center",
  },
  titleDay: {
    fontWeight: "bold",
    fontSize: 16,
    color: "red",
  },
  title: {
    fontWeight: "bold",
  },
  text: {
    fontWeight: "normal",
  },
  errorText: {
    fontWeight: "bold",
    fontSize: 18,
    color: "red",
    textAlignVertical: "center",
    paddingTop: 40,
    textAlign: "center",
  },
});
