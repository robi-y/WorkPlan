import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Modal, Alert, Image } from 'react-native';
import { AuthContext } from '../AuthProvider';
import { doc, setDoc } from 'firebase/firestore';

const AttendancePage = ({ navigation }) => {
  const [selectedClass, setSelectedClass] = useState('צוות 1');
  const [attendance, setAttendance] = useState({});
  const [showClassPicker, setShowClassPicker] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isAfter8PM, setIsAfter8PM] = useState(false);
  const { userData, db } = useContext(AuthContext);

  const hebrewDays = ['יום ראשון', 'יום שני', 'יום שלישי', 'יום רביעי', 'יום חמישי', 'יום שישי', 'שבת'];
  const currentDay = new Date().getDay();

  useEffect(() => {
    const checkTime = () => {
      const now = new Date();
      const currentHour = now.getHours();
      setIsAfter8PM(currentHour >= 20);
    };

    checkTime();
    const intervalId = setInterval(checkTime, 60000); // Check every minute

    return () => clearInterval(intervalId);
  }, []);

  const students = [
    'תלמיד 1',
    'תלמיד 2',
    'תלמיד 3',
    'תלמיד 4',
    'תלמיד 5',
    'תלמיד 6',
    'תלמיד 7',
    'תלמיד 8',
  ];

  const classes = ['צוות 1', 'צוות 2', 'צוות 3', 'צוות 4'];

  const handleAttendanceChange = (student, status) => {
    setAttendance((prev) => ({
      ...prev,
      [student]: status,
    }));
  };

  const getStatusStyle = (student, status) => {
    if (attendance[student] === status) {
      return status === 'נוכח' ? styles.present : styles.absent;
    }
    return styles.neutral;
  };

  const saveAttendance = async () => {
    if (isAfter8PM) return;

    try {
      const date = new Date().toLocaleDateString("he-IL");
      const attendanceRef = doc(
        db,
        `attendance/${selectedClass}/records/${date}`
      );
      await setDoc(attendanceRef, {
        class: selectedClass,
        date: date,
        attendance,
        savedBy: userData.name,
      });
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    } catch (error) {
      console.error("Error saving attendance: ", error);
      Alert.alert("שגיאה", "לא נשמר הנוכחות");
    }
  };

  const renderStudentRow = ({ item }) => (
    <View style={styles.studentRowWrapper}>
      <View style={styles.studentRow}>
        <Text style={styles.studentName}>{item}</Text>
        <TouchableOpacity style={getStatusStyle(item, 'נוכח')} onPress={() => handleAttendanceChange(item, 'נוכח')}>
          <Text style={styles.buttonText}>נוכח</Text>
        </TouchableOpacity>
        <TouchableOpacity style={getStatusStyle(item, 'לא נוכח')} onPress={() => handleAttendanceChange(item, 'לא נוכח')}>
          <Text style={styles.buttonText}>לא נוכח</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Image
            style={{ height: 20, width: 30 }}
            source={require("../Images/back button.png")}
          />
        </TouchableOpacity>
        <Text style={styles.currentDay}>{hebrewDays[currentDay]}</Text>
      </View>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setShowClassPicker(true)}>
          <View style={styles.classContainer}>
            <Text style={styles.title}>קבוצה</Text>
            <View style={styles.classBackground}>
              <Text style={styles.selectedClass}>{selectedClass}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
      <Text style={styles.subTitle}>התלמידים:</Text>
      <FlatList data={students} keyExtractor={(item) => item} renderItem={renderStudentRow} />
      <TouchableOpacity
        style={[styles.saveButton, isAfter8PM && styles.disabledButton]}
        onPress={saveAttendance}
        disabled={isAfter8PM}
      >
        <Text style={styles.saveButtonText}>שמור</Text>
      </TouchableOpacity>
      {showSuccessMessage && (
        <View style={styles.successMessage}>
          <Text style={styles.successMessageText}>נשמר בהצלחה</Text>
        </View>
      )}
      <Modal
        visible={showClassPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowClassPicker(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>בחר כיתה</Text>
            {classes.map((className) => (
              <TouchableOpacity
                key={className}
                style={styles.modalOption}
                onPress={() => {
                  setSelectedClass(className);
                  setShowClassPicker(false);
                }}
              >
                <Text style={styles.modalOptionText}>{className}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#85E1D7',
    padding: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    height: 45,
    width: 45,
    borderRadius: 30,
    alignSelf: "flex-end",
    justifyContent: "center",
  },
  currentDay: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  title: {
    fontSize: 25,
    fontWeight: '600',
    textAlign: 'center',
  },
  classContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  classBackground: {
    backgroundColor: 'white',
    paddingHorizontal: 5,
    borderRadius: 5,
    marginTop: 10,
  },
  selectedClass: {
    fontSize: 30, // Increase font size
    color: 'darkblue',
  },
  subTitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'right',
    marginBottom: 20,
  },
  studentRowWrapper: {
    backgroundColor: '#E8E8E8',
    borderRadius: 10,
    marginVertical: 5,
    padding: 10,
  },
  studentRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  studentName: {
    flex: 2,
    fontSize: 16,
    color: '#000',
    textAlign: 'right',
  },
  neutral: {
    flex: 1,
    margin: 5,
    padding: 10,
    backgroundColor: '#D3D3D3',
    alignItems: 'center',
    borderRadius: 10,
  },
  present: {
    flex: 1,
    margin: 5,
    padding: 10,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    borderRadius: 10,
  },
  absent: {
    flex: 1,
    margin: 5,
    padding: 10,
    backgroundColor: '#F44336',
    alignItems: 'center',
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 20,
  },
  disabledButton: {
    backgroundColor: '#A5D6A7',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  successMessage: {
    position: 'absolute',
    bottom: 20,
    left: '50%',
    transform: [{ translateX: -50 }],
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
  },
  successMessageText: {
    color: '#fff',
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
  },
  modalOption: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#E8E8E8',
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  modalOptionText: {
    fontSize: 18,
  },
});

export default AttendancePage;
