import { View, Image, StyleSheet, ImageSourcePropType } from "react-native";

type PropType = {
    placeholderImageSource: string;
    selectedImage: any;
};

export default function ImageViewer({
    placeholderImageSource,
    selectedImage,
}: PropType) {
    const imageSource: any = selectedImage
        ? { uri: selectedImage }
        : placeholderImageSource;
    return <Image source={imageSource} style={styles.image} />;
}

const styles = StyleSheet.create({
    image: {
        width: 320,
        height: 440,
        borderRadius: 18,
    },
});
