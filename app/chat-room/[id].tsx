import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useFontSize, adjustFontSize } from "@/app-contexts/FontSizeContext";
import React, { useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type MessageType = "text" | "voice" | "image" | "document" | "images";

type Message = {
  id: string;
  type: MessageType;
  content: string;
  time: string;
  isSent: boolean;
  duration?: string;
  imageUrl?: string;
  images?: string[];
  fileName?: string;
  fileSize?: string;
};

const mockMessages: Message[] = [
  { id: "1", type: "text", content: "Bonjour, comment ça va ?", time: "10:00", isSent: false },
  { id: "2", type: "text", content: "Ça va bien merci ! Et toi ?", time: "10:01", isSent: true },
  { id: "3", type: "voice", content: "", time: "10:02", isSent: false, duration: "0:15" },
  { id: "4", type: "text", content: "Super ! Voici les photos du site", time: "10:05", isSent: true },
  { 
    id: "5", 
    type: "images", 
    content: "", 
    time: "10:06", 
    isSent: true, 
    images: [
      "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400",
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400",
      "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400"
    ]
  },
  { id: "6", type: "voice", content: "", time: "10:09", isSent: true, duration: "0:23" },
  { id: "7", type: "document", content: "Rapport_Mission.pdf", time: "10:10", isSent: false, fileName: "Rapport_Mission.pdf", fileSize: "2.5 MB" },
  { id: "8", type: "text", content: "Parfait ! Merci beaucoup", time: "10:12", isSent: false },
];

export default function ChatRoom() {
  const { id, name } = useLocalSearchParams<{ id: string; name: string }>();
  const router = useRouter();
  const scheme = useColorScheme();
  const colors = Colors[scheme ?? "light"];
  const [message, setMessage] = useState("");
  const flatListRef = React.useRef<FlatList>(null);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const imageGalleryRef = React.useRef<FlatList>(null);
  const { fontSizeAdjustment } = useFontSize();

  React.useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, []);

  const renderMessage = ({ item }: { item: Message }) => {
    const isSent = item.isSent;
    const bubbleBg = isSent 
      ? colors.tint 
      : scheme === "dark" ? "#2a2a2a" : "#e5e5ea";
    const textColor = isSent ? "#fff" : colors.text;

    return (
      <View style={[styles.messageRow, isSent && styles.messageRowSent]}>
        <View style={[styles.messageBubble, { backgroundColor: bubbleBg }]}>
          {item.type === "text" && (
            <View style={styles.textContent}>
              <Text style={[styles.messageText, { color: textColor, fontSize: adjustFontSize(16, fontSizeAdjustment) }]}>
                {item.content}
              </Text>
              <Text style={[styles.messageTime, { color: textColor + "cc", fontSize: adjustFontSize(11, fontSizeAdjustment) }]}>
                {item.time}
              </Text>
            </View>
          )}

          {item.type === "voice" && (
            <View style={styles.voiceContent}>
              <View style={styles.voiceMessage}>
                <Ionicons name="play" size={24} color={textColor} />
                <View style={[styles.waveform, { backgroundColor: textColor + "30" }]} />
                <Text style={[styles.duration, { color: textColor, fontSize: adjustFontSize(12, fontSizeAdjustment) }]}>{item.duration}</Text>
              </View>
              <Text style={[styles.messageTime, { color: textColor + "cc", fontSize: adjustFontSize(11, fontSizeAdjustment) }]}>
                {item.time}
              </Text>
            </View>
          )}

          {item.type === "images" && item.images && (
            <View>
              <View style={styles.imagesContainer}>
                {item.images.map((img, index) => (
                  <Pressable 
                    key={index} 
                    onPress={() => {
                      setSelectedImages(item.images!);
                      setSelectedImageIndex(index);
                    }} 
                    style={[
                      styles.imageWrapper,
                      index < item.images!.length - 1 && styles.imageWrapperWithMargin
                    ]}
                  >
                    <Image source={{ uri: img }} style={styles.gridImage} resizeMode="cover" />
                  </Pressable>
                ))}
              </View>
              <View style={styles.imageTimeContainer}>
                <Text style={[styles.messageTime, { color: "#fff", fontSize: adjustFontSize(11, fontSizeAdjustment) }]}>
                  {item.time}
                </Text>
              </View>
            </View>
          )}

          {item.type === "image" && (
            <View>
              <Pressable onPress={() => {
                setSelectedImages([item.imageUrl!]);
                setSelectedImageIndex(0);
              }}>
                <Image source={{ uri: item.imageUrl }} style={styles.messageImage} />
              </Pressable>
              {item.content && (
                <Text style={[styles.messageText, { color: textColor, marginTop: 8 }]}>
                  {item.content}
                </Text>
              )}
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.tint }]} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: colors.background }]}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.tint }]}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </Pressable>
        <View style={styles.headerInfo}>
          <Text style={[styles.headerName, { fontSize: adjustFontSize(18, fontSizeAdjustment) }]}>{name || "Chat"}</Text>
          <Text style={[styles.headerStatus, { fontSize: adjustFontSize(12, fontSizeAdjustment) }]}>En ligne</Text>
        </View>
        <Pressable style={styles.headerAction}>
          <Ionicons name="call" size={24} color="#fff" />
        </Pressable>
        <Pressable style={styles.headerAction}>
          <Ionicons name="videocam" size={24} color="#fff" />
        </Pressable>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={mockMessages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.messagesList, { paddingBottom: 70 }]}
        inverted={false}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      {/* Input */}
      <View style={[styles.inputContainer, { 
        backgroundColor: scheme === "dark" ? "#1a1a1a" : "#f0f0f0", 
        borderTopColor: colors.icon + "30",
      }]}>
        <Pressable style={styles.inputAction}>
          <Ionicons name="attach" size={24} color={colors.icon} />
        </Pressable>
        <TextInput
          style={[styles.input, { backgroundColor: scheme === "dark" ? "#2a2a2a" : "#fff", color: colors.text, fontSize: adjustFontSize(16, fontSizeAdjustment) }]}
          placeholder="Message..."
          placeholderTextColor={colors.icon}
          value={message}
          onChangeText={setMessage}
          multiline
        />
        {message ? (
          <Pressable style={[styles.sendButton, { backgroundColor: colors.tint }]}>
            <Ionicons name="send" size={20} color="#fff" />
          </Pressable>
        ) : (
          <>
            <Pressable style={styles.inputAction}>
              <Ionicons name="camera" size={24} color={colors.icon} />
            </Pressable>
            <Pressable style={styles.inputAction}>
              <Ionicons name="mic" size={24} color={colors.icon} />
            </Pressable>
          </>
        )}
      </View>

      {/* Image Viewer Modal */}
      <Modal visible={selectedImages.length > 0} transparent onRequestClose={() => setSelectedImages([])}>
        <View style={styles.modalContainer}>
          <Pressable style={styles.modalClose} onPress={() => setSelectedImages([])}>
            <Ionicons name="close" size={32} color="#fff" />
          </Pressable>
          {selectedImages.length > 1 && (
            <View style={styles.imageCounter}>
              <Text style={[styles.imageCounterText, { fontSize: adjustFontSize(14, fontSizeAdjustment) }]}>
                {selectedImageIndex + 1} / {selectedImages.length}
              </Text>
            </View>
          )}
          <FlatList
            ref={imageGalleryRef}
            data={selectedImages}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            initialScrollIndex={selectedImageIndex}
            getItemLayout={(_, index) => ({
              length: Dimensions.get('window').width,
              offset: Dimensions.get('window').width * index,
              index,
            })}
            onMomentumScrollEnd={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / Dimensions.get('window').width);
              setSelectedImageIndex(index);
            }}
            renderItem={({ item }) => (
              <View style={styles.imageSlide}>
                <Image source={{ uri: item }} style={styles.fullScreenImage} resizeMode="contain" />
              </View>
            )}
            keyExtractor={(item, index) => `${item}-${index}`}
          />
        </View>
      </Modal>
          </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  headerStatus: {
    color: "#fff",
    fontSize: 12,
    opacity: 0.8,
  },
  headerAction: {
    marginLeft: 16,
  },
  messagesList: {
    padding: 16,
  },
  messageRow: {
    flexDirection: "row",
    marginBottom: 12,
    justifyContent: "flex-start",
  },
  messageRowSent: {
    justifyContent: "flex-end",
  },
  messageBubble: {
    maxWidth: "75%",
    borderRadius: 8,
    overflow: "hidden",
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
    marginBottom: 2,
  },
  messageTime: {
    fontSize: 11,
    alignSelf: "flex-end",
  },
  voiceMessage: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    minWidth: 200,
    marginBottom: 2,
  },
  waveform: {
    flex: 1,
    height: 30,
    borderRadius: 4,
  },
  duration: {
    fontSize: 12,
  },
  messageImage: {
    width: 250,
    height: 250,
    borderRadius: 12,
  },
  documentMessage: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    minWidth: 250,
    marginBottom: 2,
  },
  documentIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  documentInfo: {
    flex: 1,
  },
  documentName: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  documentSize: {
    fontSize: 12,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
    borderTopWidth: 1,
  },
  inputAction: {
    padding: 4,
  },
  input: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  textContent: {
    padding: 8,
    paddingBottom: 4,
  },
  voiceContent: {
    padding: 8,
    paddingBottom: 4,
  },
  documentContent: {
    padding: 8,
    paddingBottom: 4,
  },
  imagesContainer: {
    flexDirection: "row",
    width: 250,
    height: 250,
  },
  imageWrapper: {
    flex: 1,
  },
  imageWrapperWithMargin: {
    marginRight: 2,
  },
  gridImage: {
    width: "100%",
    height: "100%",
  },
  imageTimeContainer: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  modalClose: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 8,
  },
  imageCounter: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  imageCounterText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  imageSlide: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    justifyContent: "center",
    alignItems: "center",
  },
  fullScreenImage: {
    width: "100%",
    height: "100%",
  },
});
