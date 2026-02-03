import React, { useState, useRef } from "react";
import {
  View,
  Image,
  Dimensions,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../AppText";
import { BlurView } from "expo-blur";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface ImageCarouselProps {
  images: string[];
  height?: number;
  showPrice?: boolean;
  price?: number;
  currency?: string;
}

export function ImageCarousel({
  images,
  height = 300,
  showPrice = false,
  price,
  currency = "TRY",
}: ImageCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / SCREEN_WIDTH);
    setActiveIndex(index);
  };

  if (images.length === 0) {
    return (
      <View
        style={{ height }}
        className="bg-quaternary items-center justify-center"
      >
        <Ionicons name="image-outline" size={64} color="#12121E4D" />
        <AppText className="text-tertiary mt-2">Fotoğraf yok</AppText>
      </View>
    );
  }

  return (
    <View style={{ height }} className="relative">
      {/* Image Slider */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {images.map((imageUrl, index) => (
          <Image
            key={index}
            source={{ uri: imageUrl }}
            style={{ width: SCREEN_WIDTH, height }}
            resizeMode="cover"
          />
        ))}
      </ScrollView>

      {/* Price Badge */}
      {showPrice && price && (
        <BlurView
          intensity={50}
          style={{
            position: "absolute",
            bottom: 16,
            left: 16,
            paddingHorizontal: 16,
            paddingVertical: 10,
            borderRadius: 12,
            overflow: "hidden",
            marginBottom: 10,
          }}
        >
          <AppText className="text-white font-bold text-lg">
            {price.toLocaleString()}₺ /ay
          </AppText>
        </BlurView>
      )}

      {/* Pagination Dots */}
      {images.length > 1 && (
        <View className="absolute bottom-4 right-4 flex-row">
          {images.map((_, index) => (
            <View
              key={index}
              className={`w-2 h-2 rounded-full mx-1 ${
                index === activeIndex ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </View>
      )}
    </View>
  );
}
