import React, { useEffect, useRef } from "react"
import { View, Animated } from "react-native"
import { makeStyles, Text } from "@rneui/themed"
import { useI18nContext } from "@app/i18n/i18n-react"

interface KYCProgressBarProps {
  currentStep: number
  totalSteps: number
  stepNames?: string[]
}

const KYCProgressBar: React.FC<KYCProgressBarProps> = ({ 
  currentStep, 
  totalSteps, 
  stepNames = ["Document Type", "Document Verification", "User Details", "Place of Birth", "Confirm Disclosures"] 
}) => {
  const { LL } = useI18nContext()
  const styles = useStyles()
  const progressAnimation = useRef(new Animated.Value(((currentStep + 1) / totalSteps) * 100)).current

  const currentStepName = stepNames[currentStep] || `Step ${currentStep + 1}`

  useEffect(() => {
    Animated.timing(progressAnimation, {
      toValue: ((currentStep + 1) / totalSteps) * 100,
      duration: 300,
      useNativeDriver: false,
    }).start()
  }, [currentStep, totalSteps, progressAnimation])

  return (
    <View style={styles.container} accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: totalSteps, now: currentStep + 1 }}>
      <View style={styles.progressContainer}>
        <View style={styles.progressTrack}>
          <Animated.View 
            style={[
              styles.progressFill, 
              { 
                width: progressAnimation.interpolate({
                  inputRange: [0, 100],
                  outputRange: ["0%", "100%"],
                })
              }
            ]} 
          />
        </View>
        <View style={styles.stepIndicators}>
          {Array.from({ length: totalSteps }, (_, index) => (
            <View
              key={index}
              style={[
                styles.stepDot,
                index < currentStep && styles.stepDotCompleted,
                index === currentStep && styles.stepDotActive,
              ]}
              accessibilityRole="none"
            />
          ))}
        </View>
      </View>
      <Text 
        type="p3" 
        style={styles.stepText}
        accessibilityLabel={`Step ${currentStep + 1} of ${totalSteps}: ${currentStepName}`}
      >
        Step {currentStep + 1} of {totalSteps}: {currentStepName}
      </Text>
    </View>
  )
}

const useStyles = makeStyles(({ colors }) => ({
  container: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey4,
  },
  progressContainer: {
    position: "relative",
    marginBottom: 12,
  },
  progressTrack: {
    height: 4,
    backgroundColor: colors.grey4,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  stepIndicators: {
    position: "absolute",
    top: -4,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 2,
  },
  stepDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.grey4,
    borderWidth: 2,
    borderColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  stepDotCompleted: {
    backgroundColor: colors.primary,
  },
  stepDotActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary5,
    borderWidth: 3,
    transform: [{ scale: 1.1 }],
  },
  stepText: {
    textAlign: "center",
    color: colors.grey2,
    fontWeight: "500",
  },
}))

export default KYCProgressBar
