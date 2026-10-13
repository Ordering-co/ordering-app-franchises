import * as React from "react";
import { Animated, Keyboard, Platform, StyleSheet, Text, View } from "react-native";
import { ToastType, useToast } from '@components';
import { useTheme } from 'styled-components/native';

const fadeDuration = 300;
const bottomPosition = 20;

export const Toast: React.FC = () => {
	const theme = useTheme();
	const [toastConfig, { hideToast }] = useToast();
	const opacity = React.useRef(new Animated.Value(0)).current;
	const [keyboardHeight, setKeyboardHeight] = React.useState(0);
	const styles = React.useMemo(() => StyleSheet.create({
		container: {
			alignSelf: "center",
			position: "absolute",
			maxWidth: 480,
			zIndex: 9999999999
		},
		toast: {
			borderRadius: 16,
			padding: 16,
			bottom: Platform.OS === 'ios' ? 55 + keyboardHeight : keyboardHeight > 0 ? 15 : 55
		},
		message: {
			fontSize: 14,
			textAlign: "center",
			color: '#fff',
		},
	}), [keyboardHeight]);

	const fadeIn = React.useCallback(() => {
		Animated.timing(opacity, {
			toValue: 1,
			duration: fadeDuration,
			useNativeDriver: true,
		}).start();
	}, [opacity]);

	const fadeOut = React.useCallback(() => {
		Animated.timing(opacity, {
			toValue: 0,
			duration: fadeDuration,
			useNativeDriver: true,
		}).start(() => {
			hideToast && hideToast();
		});
	}, [opacity, hideToast]);

	React.useEffect(() => {
		if (!toastConfig) {
			return;
		}

		fadeIn();
		const timer = setTimeout(fadeOut, toastConfig.duration);

		return () => clearTimeout(timer);
	}, [toastConfig, fadeIn, fadeOut]);

	React.useEffect(() => {
		const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (e) => {
			setKeyboardHeight(e.endCoordinates.height);
		});
		const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
			setKeyboardHeight(0);
		});
		return () => {
			keyboardDidShowListener.remove();
			keyboardDidHideListener.remove();
		};
	}, []);

	if (!toastConfig) {
		return null;
	}

	const { type, message } = toastConfig;

	let backgroundColor;
	switch (type) {
		case ToastType.Info:
			backgroundColor = '#6ba4ff';
			break;
		case ToastType.Error:
			backgroundColor = theme.colors.primary;
			break;
		case ToastType.Success:
			backgroundColor = '#73bd24';
			break;
	}

	return (
		<Animated.View
			style={[
				styles.container,
				{ bottom: bottomPosition, opacity },
			]}
		>
			<View style={[styles.toast, { backgroundColor }]}>
				<Text style={styles.message}>{message}</Text>
			</View>
		</Animated.View>
	);
};
