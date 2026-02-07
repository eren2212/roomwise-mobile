import React, { useState } from "react";
import {
  View,
  Modal,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../AppText";
import { Button } from "../Button";
import COLORS from "@/theme/color";
import { Input } from "../Input";

interface RequestModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (message: string) => Promise<void>;
  ownerName?: string;
  ownerAvatar?: string | null;
  matchPercentage?: number;
  isLoading?: boolean;
}

const MAX_MESSAGE_LENGTH = 140;

export function RequestModal({
  visible,
  onClose,
  onSubmit,
  ownerName = "Ev Sahibi",
  ownerAvatar,
  matchPercentage = 90,
  isLoading = false,
}: RequestModalProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    await onSubmit(message);
    setMessage("");
  };

  const handleClose = () => {
    setMessage("");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={handleClose}
          className="flex-1 bg-black/50 justify-end"
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
            className="bg-background rounded-t-3xl px-6 pt-4 pb-8"
          >
            {/* Handle bar */}
            <View className="w-12 h-1 bg-quaternary rounded-full self-center mb-6" />

            {/* Ev Sahibi Bilgisi */}
            <View className="flex-row items-center mb-6">
              <View className="w-16 h-16 rounded-full bg-card border-2 border-quaternary items-center justify-center overflow-hidden">
                {ownerAvatar ? (
                  <Image
                    source={{ uri: ownerAvatar }}
                    className="w-full h-full"
                  />
                ) : (
                  <Ionicons name="person" size={28} color={COLORS.tint} />
                )}
              </View>
              <View className="ml-4 flex-1">
                <View className="flex-row items-center">
                  <AppText className="text-xl font-bold text-primary">
                    {ownerName}
                  </AppText>
                  <View className="ml-2 bg-success/20 px-3 py-1 rounded-full flex-row items-center">
                    <Ionicons
                      name="checkmark-circle"
                      size={14}
                      color="#00C853"
                    />
                    <AppText className="text-success font-bold text-sm ml-1">
                      %{matchPercentage} Uyum
                    </AppText>
                  </View>
                </View>
                <AppText className="text-secondary text-sm mt-1">
                  Yaşam tarzına göre uyum puanı
                </AppText>
              </View>
            </View>

            {/* Mesaj Başlığı */}
            <View className="flex-row justify-between items-center mb-2">
              <AppText className="text-tint font-bold text-sm tracking-wider">
                KENDİNİZİ KISACA TANITIN
              </AppText>
              <AppText className="text-secondary text-sm">
                {message.length}/{MAX_MESSAGE_LENGTH}
              </AppText>
            </View>

            {/* Mesaj Input */}
            <View className="  mb-6">
              <Input
                value={message}
                onChangeText={(text) =>
                  text.length <= MAX_MESSAGE_LENGTH && setMessage(text)
                }
                placeholder="Merhaba! İlanınızı gördüm ve..."
                placeholderTextColor="#6F7684"
                multiline
                numberOfLines={4}
                className="text-primary text-base min-h-[100px] border-none"
              />
            </View>

            {/* Gönder Butonu */}
            <Button
              title="İstek Gönder"
              onPress={handleSubmit}
              loading={isLoading}
              disabled={isLoading}
              icon="send"
            />

            {/* İptal Linki */}
            <TouchableOpacity
              onPress={handleClose}
              className="mt-4 py-2"
              disabled={isLoading}
            >
              <AppText className="text-secondary text-center font-medium">
                Belki daha sonra
              </AppText>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Modal>
  );
}
