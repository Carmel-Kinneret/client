import { Link, Stack } from 'expo-router';

  import { Text, View } from 'react-native';


export default function NotFoundScreen() {

  return (
    
      <>
        <Stack.Screen options={{ title: 'שגיאה' }} />
        <View className={styles.container}>
          <Text className={styles.title}>{"העמוד לא קיים."}</Text>
          <Link href="/(tabs)" className={styles.link}>
            <Text className={styles.linkText}>חזור לעמוד הבית!</Text>
          </Link>
        </View>
      </>
    
  );
}


  const styles = {
		container: `items-center flex-1 justify-center p-5`,
    title: `text-xl font-bold`,
    link: `mt-4 pt-4`,
    linkText: `text-base text-[#2e78b7]`,
	};

