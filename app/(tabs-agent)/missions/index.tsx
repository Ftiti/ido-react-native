// app/(tabs-agent)/missions/index.tsx
import { usePlannings } from "@/app-services/plannings/usePlannings";
import { AnimatedDatePicker } from "@/components/datePicker/AnimatedDatePicker";
import { InterventionCard } from "@/components/interventionCard/InterventionCard";
import { useSafeArea } from "@/components/safeArea/TabSafeAreaProvider";
import { RefreshSpinner } from "@/components/spinner/RefreshSpinner";
import { useMemo, useRef, useState } from "react";
import { PanResponder, ScrollView, Text, View } from "react-native";

const formatDate = (date: Date) => date.toISOString().split("T")[0];
const SWIPE_THRESHOLD = 50;

const Index = () => {
  const [date, setDate] = useState(new Date());
  const { top, bottom } = useSafeArea();
  const isSwipingRef = useRef(false);

  const formattedDate = useMemo(() => formatDate(date), [date]);

  const {
    data: plannings = [],
    isLoading,
    isFetching,
    error,
  } = usePlannings(formattedDate);

  const addDays = (days: number) => {
    setDate((prev) => {
      const next = new Date(prev);
      next.setDate(prev.getDate() + days);
      return next;
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dx) > 10 &&
        Math.abs(gestureState.dx) > Math.abs(gestureState.dy) * 2,
      onPanResponderGrant: () => {
        isSwipingRef.current = false;
      },
      onPanResponderRelease: (_, gestureState) => {
        if (isSwipingRef.current) return;
        if (gestureState.dx > SWIPE_THRESHOLD) {
          isSwipingRef.current = true;
          addDays(-1);
        } else if (gestureState.dx < -SWIPE_THRESHOLD) {
          isSwipingRef.current = true;
          addDays(1);
        }
      },
    }),
  ).current;

  return (
    <ScrollView
      contentContainerStyle={{
        paddingTop: top + 12,
        paddingBottom: bottom + 12,
      }}
      {...panResponder.panHandlers}
    >
      <View style={{ padding: 16 }}>
        <AnimatedDatePicker date={date} onChange={setDate} />
      </View>

      <View style={{ padding: 16 }}>
        {isLoading && <Text>Loading plannings...</Text>}
        {!!error && <Text>Failed to load plannings.</Text>}

        <RefreshSpinner visible={isFetching && !isLoading} />

        {plannings.length === 0 && !isLoading ? (
          <Text>No plannings for this date.</Text>
        ) : (
          plannings.map((planning) => (
            <InterventionCard
              key={planning.id}
              intervention={planning}
              displayPointing={true}
            />
          ))
        )}
      </View>
    </ScrollView>
  );
};

export default Index;
