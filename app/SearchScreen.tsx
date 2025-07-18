import { appImageURL } from "@/constants/ImagesRoutes";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  Image,
  Keyboard,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from "react-native";
import { getPlaces } from "../constants/urls";
import { useFetch } from "../hooks/useFetch";

interface DataPlaces {
  ascii_display: string;
  city_ascii_name: string;
  city_name: string;
  city_slug: string;
  country: string;
  name: string;
  id: string;
  lat: string;
  lon: string;
  popularity: string;
  result_type: string;
  slug: string;
  sort_criteria: string;
  state: string;
  address: {
    region: string;
    country: string;
  };
}

export default function SearchScreen() {
  const router = useRouter();
  const { getData } = useFetch();
  const [placesData, setPlacesData] = useState<Array<DataPlaces>>([]);

  const handleSearch = async (value: string | null): Promise<void> => {
    try {
      const response = await getData(getPlaces(value));
      if (response.data) {
        setPlacesData(response.data);
      }
    } catch (error: any) {
      throw new Error(error);
    }
  };

  return (
    <SafeAreaView style={styleLayout.mainContainer}>
      <View>
        <Image
          style={styleLayout.banner}
          source={{
            uri: appImageURL,
          }}
        />
        <Text style={styleLayout.appTitle}>
          Weather App
        </Text>
      </View>

      <TextInput
        style={styleLayout.searchInput}
        placeholder="Search"
        clearButtonMode="always"
        onChangeText={(value) => handleSearch(value)}
      />
      {placesData && (
        <FlatList
          data={placesData}
          keyExtractor={(item, index) => item.id || index.toString()}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item: place }) => (
            <TouchableHighlight
              underlayColor="#ddd"
              onPress={() => {
                Keyboard.dismiss();
                router.push({
                  pathname: "/DetailsScreen",
                  params: {
                    name: place.name,
                    country: place.address.country,
                    lat: place.lat,
                    lon: place.lon,
                  },
                });
              }}
              style={styleLayout.searchText}
            >
              <View>
                <Text>
                  {[
                    place?.name,
                    place?.address?.country,
                    place?.address?.region,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </Text>
              </View>
            </TouchableHighlight>
          )}
        />
      )}
    </SafeAreaView>
  );
}
const styleLayout = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 20,
    margin: 10,
    backgroundColor: "white",
  },
  searchInput: {
    borderColor: "#CCC",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  banner: {
    width: 200,
    height: 200,
    marginTop: 80,
    alignSelf: "center",
  },
  searchText: {
    padding: 5,
  },
  appTitle:{
    fontWeight: "bold",
    fontSize: 30,
    color: "blue",
    textAlign: "center",
    marginBottom: 40,
    marginTop: -20
  },
});
