import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Platform, ScrollView, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter, useLocalSearchParams } from "expo-router";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { Camera, X, Check, ImagePlus, Loader, Mic, Search, Plus } from "lucide-react-native";
import Colors from "@/constants/colors";
import { globalStyles } from "@/constants/theme";
import { useIngredientsStore } from "@/store/ingredientsStore";
import { mockIngredients } from "@/mocks/ingredients";

// Define the ingredient type with the scanned property
interface Ingredient {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  scanned?: boolean;
}

export default function ScanScreen() {
  const router = useRouter();
  const { source } = useLocalSearchParams();
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>("back");
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [detectedIngredients, setDetectedIngredients] = useState<Ingredient[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredIngredients, setFilteredIngredients] = useState<typeof mockIngredients>([]);
  const [showManualAdd, setShowManualAdd] = useState(false);
  const cameraRef = useRef(null);

  const { addMultipleIngredients } = useIngredientsStore();

  useEffect(() => {
    if (source === "gallery") {
      pickImage();
    }
  }, [source]);
  
  useEffect(() => {
    if (searchQuery.length > 0) {
      const filtered = mockIngredients.filter(ingredient => 
        ingredient.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredIngredients(filtered.slice(0, 10));
    } else {
      setFilteredIngredients([]);
    }
  }, [searchQuery]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      analyzeImage(result.assets[0].uri);
    } else {
      // If user cancels, go back
      router.back();
    }
  };

  const takePicture = async () => {
    if (Platform.OS === "web") {
      // On web, we can't take pictures, so we'll simulate it
      setScanning(true);
      setTimeout(() => {
        simulateIngredientDetection();
      }, 2000);
    } else {
      setScanning(true);
      // Simulate image analysis
      setTimeout(() => {
        simulateIngredientDetection();
      }, 2000);
    }
  };

  const analyzeImage = (imageUri: string) => {
    setScanning(true);
    // Simulate image analysis
    setTimeout(() => {
      simulateIngredientDetection();
    }, 2000);
  };

  const simulateIngredientDetection = () => {
    // Randomly select 3-7 ingredients from the mock data
    const count = Math.floor(Math.random() * 5) + 3;
    const shuffled = [...mockIngredients].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, count).map(ingredient => ({
      ...ingredient,
      scanned: true
    }));
    
    setDetectedIngredients(selected);
    setScanning(false);
    setScanned(true);
  };

  const handleConfirm = () => {
    // Add detected ingredients to the store
    addMultipleIngredients(detectedIngredients);
    router.replace("/ingredients");
  };

  const handleCancel = () => {
    setScanned(false);
    setImage(null);
    setDetectedIngredients([]);
  };
  
  const handleManualAdd = () => {
    setShowManualAdd(true);
  };
  
  const handleAddIngredient = (ingredient: any) => {
    setDetectedIngredients(prev => [...prev, {...ingredient, scanned: false}]);
    setSearchQuery("");
  };
  
  const handleVoiceInput = () => {
    alert("Voice input coming soon!");
  };

  if (!permission) {
    // Camera permissions are still loading
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <StatusBar style="light" />
        <Text style={styles.permissionText}>We need your permission to use the camera</Text>
        <TouchableOpacity
          style={globalStyles.button}
          onPress={requestPermission}
        >
          <Text style={globalStyles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar style="light" />
      
      {!scanned ? (
        <>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => router.back()}
            >
              <X size={24} color={Colors.white} />
            </TouchableOpacity>
            
            {!image && (
              <TouchableOpacity
                style={styles.flipButton}
                onPress={() => setFacing(current => (current === "back" ? "front" : "back"))}
              >
                <Camera size={24} color={Colors.white} />
              </TouchableOpacity>
            )}
          </View>
          
          {image ? (
            <Image source={{ uri: image }} style={styles.previewImage} />
          ) : (
            <CameraView
              style={styles.camera}
              facing={facing}
              ref={cameraRef}
            >
              <View style={styles.overlay}>
                <View style={styles.scanFrame} />
                <Text style={styles.scanInstructions}>
                  Position your ingredients in the frame
                </Text>
              </View>
            </CameraView>
          )}
          
          <View style={styles.footer}>
            {scanning ? (
              <View style={styles.scanningContainer}>
                <ActivityIndicator size="large" color={Colors.primary} />
                <Text style={styles.scanningText}>Analyzing ingredients...</Text>
              </View>
            ) : (
              <>
                {!image ? (
                  <View style={styles.captureContainer}>
                    <TouchableOpacity
                      style={styles.galleryButton}
                      onPress={pickImage}
                    >
                      <ImagePlus size={24} color={Colors.white} />
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={styles.captureButton}
                      onPress={takePicture}
                    >
                      <View style={styles.captureButtonInner} />
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={styles.galleryButton}
                      onPress={handleManualAdd}
                    >
                      <Plus size={24} color={Colors.white} />
                    </TouchableOpacity>
                  </View>
                ) : null}
              </>
            )}
          </View>
        </>
      ) : (
        <View style={styles.resultsContainer}>
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsTitle}>Detected Ingredients</Text>
            <Text style={styles.resultsSubtitle}>
              We found {detectedIngredients.length} ingredients in your image
            </Text>
          </View>
          
          {showManualAdd && (
            <View style={styles.searchContainer}>
              <View style={styles.searchInputContainer}>
                <Search size={20} color={Colors.textLight} style={styles.searchIcon} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search for ingredients..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  autoFocus
                />
                <TouchableOpacity onPress={handleVoiceInput}>
                  <Mic size={20} color={Colors.primary} />
                </TouchableOpacity>
              </View>
              
              {filteredIngredients.length > 0 && (
                <View style={styles.searchResults}>
                  {filteredIngredients.map((ingredient) => (
                    <TouchableOpacity
                      key={ingredient.id}
                      style={styles.searchResultItem}
                      onPress={() => handleAddIngredient(ingredient)}
                    >
                      {ingredient.imageUrl ? (
                        <Image source={{ uri: ingredient.imageUrl }} style={styles.searchResultImage} />
                      ) : (
                        <View style={[styles.searchResultImage, { backgroundColor: Colors.primaryLight }]} />
                      )}
                      <Text style={styles.searchResultText}>{ingredient.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          )}
          
          <ScrollView style={styles.ingredientsList}>
            {detectedIngredients.map((ingredient) => (
              <View key={ingredient.id} style={styles.ingredientItem}>
                {ingredient.imageUrl ? (
                  <Image source={{ uri: ingredient.imageUrl }} style={styles.ingredientImage} />
                ) : (
                  <View style={[styles.ingredientImage, { backgroundColor: Colors.primaryLight }]} />
                )}
                <View style={styles.ingredientInfo}>
                  <Text style={styles.ingredientName}>{ingredient.name}</Text>
                  <Text style={styles.ingredientCategory}>{ingredient.category}</Text>
                </View>
                {ingredient.scanned && (
                  <View style={styles.scannedBadge}>
                    <Text style={styles.scannedText}>Scanned</Text>
                  </View>
                )}
              </View>
            ))}
          </ScrollView>
          
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setShowManualAdd(!showManualAdd)}
            >
              <Plus size={20} color={Colors.primary} />
              <Text style={styles.actionButtonText}>
                {showManualAdd ? "Hide Search" : "Add More"}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[globalStyles.button, globalStyles.buttonOutline, styles.footerButton]}
              onPress={handleCancel}
            >
              <Text style={globalStyles.buttonOutlineText}>Rescan</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[globalStyles.button, styles.footerButton]}
              onPress={handleConfirm}
            >
              <Text style={globalStyles.buttonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  permissionText: {
    fontSize: 18,
    color: Colors.white,
    textAlign: "center",
    marginBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  flipButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  scanFrame: {
    width: 280,
    height: 280,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: 16,
    backgroundColor: "transparent",
  },
  scanInstructions: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "500",
    marginTop: 20,
    textAlign: "center",
    width: "80%",
  },
  previewImage: {
    flex: 1,
    resizeMode: "cover",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  captureContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 20,
  },
  galleryButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(255,255,255,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  captureButtonInner: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: Colors.white,
  },
  scanningContainer: {
    alignItems: "center",
    paddingBottom: 40,
  },
  scanningText: {
    fontSize: 16,
    color: Colors.white,
    marginTop: 12,
  },
  resultsContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  resultsHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  resultsTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 8,
  },
  resultsSubtitle: {
    fontSize: 16,
    color: Colors.textLight,
  },
  searchContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.backgroundLight,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    paddingVertical: 8,
  },
  searchResults: {
    marginTop: 12,
    maxHeight: 200,
  },
  searchResultItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  searchResultImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  searchResultText: {
    fontSize: 16,
    color: Colors.text,
  },
  ingredientsList: {
    flex: 1,
    padding: 16,
  },
  ingredientItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  ingredientImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  ingredientInfo: {
    flex: 1,
  },
  ingredientName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 4,
  },
  ingredientCategory: {
    fontSize: 14,
    color: Colors.textLight,
  },
  scannedBadge: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  scannedText: {
    fontSize: 12,
    color: Colors.primaryDark,
    fontWeight: "500",
  },
  actionsContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    marginBottom: 16,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.primary,
    marginLeft: 8,
  },
  footerButton: {
    flex: 1,
    marginHorizontal: 8,
    marginTop: 8,
  },
});