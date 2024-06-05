import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { StackProps } from '@navigator/stack';
import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import Button from '@components/Button';

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F0F2F5',
    },
    scrollView: {
        flexGrow: 1,
    },
    container: {
        flex: 1,
        padding: 16,
    },
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        backgroundColor: '#FFFFFF',
        padding: 10,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 2,
    },
    picker: {
        flex: 3,
        height: 50,
    },
    filterButton: {
        flex: 1,
        marginLeft: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    card: {
        flex: 1,
        margin: 8,
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    cardText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333333',
    },
    cardSubText: {
        fontSize: 14,
        color: '#666666',
    },
    invisibleCard: {
        backgroundColor: 'transparent',
        elevation: 0,
        shadowColor: 'transparent',
    },
});

export default function Absensi({ navigation, route }: StackProps) {
    const [selectedValue, setSelectedValue] = useState('option1');

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <View style={styles.container}>
                    {/* Combo box and Filter button */}
                    <View style={styles.filterContainer}>
                        <Picker
                            selectedValue={selectedValue}
                            style={styles.picker}
                            onValueChange={itemValue => setSelectedValue(itemValue)}>
                            <Picker.Item label="Option 1" value="option1" />
                            <Picker.Item label="Option 2" value="option2" />
                            <Picker.Item label="Option 3" value="option3" />
                        </Picker>
                        <View style={styles.filterButton}>
                            <Button
                                title="Filter"
                                onPress={() => {
                                    // Implement filter logic here
                                    console.log(`Selected value: ${selectedValue}`);
                                }}
                            />
                        </View>
                    </View>

                    {/* Cards */}
                    <View style={styles.row}>
                        <TouchableOpacity style={styles.card}>
                            <View>
                                <Text style={styles.cardText}>Bulan</Text>
                                <Text style={styles.cardSubText}>Persen</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.card}>
                            <View>
                                <Text style={styles.cardText}>bulan</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.row}>
                        <TouchableOpacity style={styles.card}>
                            <View>
                                <Text style={styles.cardText}>bulan</Text>
                            </View>
                        </TouchableOpacity>
                        <View style={[styles.card, styles.invisibleCard]} />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
