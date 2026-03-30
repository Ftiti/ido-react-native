// app/(tabs-agent)/missions/index.tsx
import { AnimatedDatePicker } from "@/components/datePicker/AnimatedDatePicker";
import { InterventionCard } from "@/components/interventionCard/InterventionCard";
import { useSafeArea } from "@/components/safeArea/TabSafeAreaProvider";
import { fakeIntervention } from "@/mock";
import React, { useState } from "react";
import { ScrollView, useColorScheme, View } from "react-native";

const Index = () => {
  // <- PascalCase
  const scheme = useColorScheme();
  const [date, setDate] = useState(new Date());

  const { top, bottom } = useSafeArea();

  return (
    <ScrollView
      contentContainerStyle={{
        paddingTop: top + 12, // avoid status bar
        paddingBottom: bottom + 12, // avoid tabs
      }}
    >
      <View style={{ padding: 16 }}>
        <AnimatedDatePicker date={date} onChange={setDate} />
      </View>
      <View style={{ padding: 16 }}>
        {/* Your content here */}
        <InterventionCard
          intervention={fakeIntervention}
          displayPointing={true} // optional, defaults to false
        />
        {/* <Fc intervention={fakeIntervention} />
        <Fc intervention={fakeIntervention} displayPointing={true} />
        <Fc intervention={fakeIntervention} displayPointing={true} /> */}
      </View>
    </ScrollView>
  );
};

export default Index;
