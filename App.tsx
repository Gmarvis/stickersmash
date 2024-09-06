import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Platform } from "react-native";
import ImageViewer from "./components/ImageViewer";
import Button from "./components/buttons/Button";
import * as imagePicker from "expo-image-picker";
import { useRef, useState } from "react";
import IconButton from "./components/buttons/IconButton";
import CircleButton from "./components/buttons/CircleButton";
import EmojiPicker from "./components/modals/EmojiPicker";
import EmojiList from "./components/EmojiList";
import EmojiSticker from "./components/EmojiSticker";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as MediaLibrary from "expo-media-library";
import { captureRef } from "react-native-view-shot";

import domtoimage from "dom-to-image";

export default function App() {
    const PlaceholderImage = require("./assets/images/background-image.png");

    const [selectedImage, setSelectedImage] = useState("");

    const [showAppOptions, setShowAppOptions] = useState(false);

    const [isModalVisible, setIsModalVisible] = useState(false);

    const [pickedEmoji, setPickedEmoji] = useState("");

    const [status, requestPermissions] = MediaLibrary.usePermissions();

    const imageRef = useRef();

    const pickImageAsync = async () => {
        let result = await imagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            quality: 1,
        });
        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri);
            setShowAppOptions(true);
        } else {
            alert("you did not select any image");
        }
    };

    const onReset = () => {
        setShowAppOptions(false);
        setSelectedImage("");
        setPickedEmoji("");
    };

    const onAddSticker = () => {
        setIsModalVisible(true);
    };

    const onSaveImageAsync = async () => {
        if (Platform.OS !== "web") {
            try {
                requestPermissions()
                const localUri = await captureRef(imageRef, {
                    height: 440,
                    quality: 1,
                });
                await MediaLibrary.saveToLibraryAsync(localUri);
                if (localUri) {
                    alert("Saved!");
                }
            } catch (e) {
                console.log(e);
            }
        } else {
            try {
                const dataUrl = await domtoimage.toJpeg(imageRef.current, {
                  quality: 0.95,
                  width: 320,
                  height: 440,
                });
          
                let link = document.createElement('a');
                link.download = 'sticker-smash.jpeg';
                link.href = dataUrl;
                link.click();
              } catch (e) {
                console.log(e);
              }
        }
    };

    const onModalClose = () => {
        setIsModalVisible(false);
    };

    return (
        <GestureHandlerRootView style={styles.container}>
            <View style={styles.ImageContainer}>
                <View ref={imageRef} collapsable={false}>
                    <ImageViewer
                        placeholderImageSource={PlaceholderImage}
                        selectedImage={selectedImage}
                    />
                    {pickedEmoji && (
                        <EmojiSticker
                            imageSize={40}
                            stickerSource={pickedEmoji}
                        />
                    )}

                    <EmojiPicker
                        onClose={onModalClose}
                        isVisible={isModalVisible}
                    >
                        <EmojiList
                            onSelect={setPickedEmoji}
                            onCloseModal={onModalClose}
                        />
                    </EmojiPicker>
                </View>
            </View>

            {showAppOptions ? (
                <View style={styles.optionsContainer}>
                    <View style={styles.optionsRow}>
                        <IconButton
                            label="Reset"
                            icon="refresh"
                            onPress={onReset}
                        />
                        <CircleButton onPress={onAddSticker} />
                        <IconButton
                            label="Save"
                            icon="save-alt"
                            onPress={onSaveImageAsync}
                        />
                    </View>
                </View>
            ) : (
                <View style={styles.footerContainer}>
                    <Button
                        onPress={pickImageAsync}
                        theme="primary"
                        label="Choose a photo"
                    />
                    <Button
                        onPress={() => setShowAppOptions(true)}
                        label="Use this photo"
                    />
                </View>
            )}

            <StatusBar style="light" />
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#25292e",
        alignItems: "center",
        justifyContent: "center",
    },
    ImageContainer: {
        flex: 1,
        paddingTop: 58,
    },
    footerContainer: {
        flex: 1 / 3,
        alignItems: "center",
    },
    optionsContainer: {
        position: "absolute",
        bottom: 80,
    },
    optionsRow: {
        alignItems: "center",
        flexDirection: "row",
    },
});
