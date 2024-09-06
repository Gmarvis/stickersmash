import { MaterialIcons, } from "@expo/vector-icons";
import { IconProps, } from "@expo/vector-icons/build/createIconSet";
import { Pressable, Text, StyleSheet } from "react-native";

type Props = {
    onPress: ()=> void,
    icon: any
    label: string
}

export default function IconButton({onPress, icon, label}: Props){
    return (
        <Pressable style={styles.iconButton} onPress={onPress}>
        <MaterialIcons name={icon} size={24} color="#fff" />
        <Text style={styles.iconButtonLabel}>{label}</Text>
      </Pressable>
    )
}

const styles = StyleSheet.create({
    iconButton: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    iconButtonLabel: {
      color: '#fff',
      marginTop: 12,
    },
  });