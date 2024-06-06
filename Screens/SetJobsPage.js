import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";

const getDaysInMonth = (month, year) => {
  return new Date(year, month + 1, 0).getDate();
};

const getDayName = (date) => {
  const options = { weekday: "long" };
  return new Intl.DateTimeFormat("he-IL", options).format(date);
};

const SetJobsPage = ({ navigation }) => {
  const [date, setDate] = useState("");
  const [eventName, setEventName] = useState("");
  const [location, setLocation] = useState("");
  const [meetingPlace, setMeetingPlace] = useState("");
  const [time, setTime] = useState("");
  const [attendant, setAttendant] = useState("");
  const [students, setStudents] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [isFocus, setIsFocus] = useState(false);

  const currentDate = new Date();
  const currentDay = new Date().getDate();
  const currentMonth = new Date().getMonth();
  const monthName = currentDate.toLocaleString("he-IL", {
    month: "long",
    timeZone: "UTC",
  });
  // const dayName = currentDate.toLocaleString("he-IL", {
  //   weekday: "long",
  //   timeZone: "UTC",
  // });
  const currentYear = new Date().getFullYear();
  const preDaysInMonth = getDaysInMonth(currentMonth, currentYear);
  const daysInMonth = Array.from(
    { length: preDaysInMonth - currentDay + 1 },
    (_, i) => currentDay + i
  );
  const daysStartingFromCurrent = [
    ...daysInMonth.slice(0, currentDay - 1),
    ...daysInMonth.slice(currentDay - 1),
  ].map((day) => {
    const date = new Date(currentYear, currentMonth, day);
    const dayName = getDayName(date);
    return {
      label: day + "/" + (currentMonth + 1) + " , " + dayName,
      value: day,
    };
  });

  const handleSubmit = () => {
    // Handle form submission here
    console.log("Form submitted with the following data:");
    console.log("Date:", date);
    console.log("Event Name:", eventName);
    console.log("Location:", location);
    console.log("Time:", time);
    console.log("Attendant:", attendant);
    console.log("Students:", students);
    console.log("Vehicle:", vehicle);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>לקבוע עבודה</Text>
      <Dropdown
        style={styles.input}
        placeholderStyle={styles.Drop}
        itemTextStyle={styles.DropList}
        inputSearchStyle={styles.Drop}
        data={daysStartingFromCurrent}
        labelField={"label"}
        valueField={"value"}
        placeholder={!isFocus ? "לבחור יום" : "..."}
        search
        searchPlaceholder="לחפש..."
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        value={date}
        onChange={(item) => {
          setDate(item.value);
          setIsFocus(false);
        }}
      />
      <TextInput
        style={styles.input}
        placeholder="שם אירוע:"
        value={eventName}
        onChangeText={setEventName}
      />
      <TextInput
        style={styles.input}
        placeholder="מקום:"
        value={location}
        onChangeText={setLocation}
      />
      <TextInput
        style={styles.input}
        placeholder="מקום התכנסות:"
        value={location}
        onChangeText={setMeetingPlace}
      />
      <TextInput
        style={styles.input}
        placeholder="זמן תנועה:"
        value={time}
        onChangeText={setTime}
      />
      <TextInput
        style={styles.input}
        placeholder="מורה:"
        value={attendant}
        onChangeText={setAttendant}
      />
      <TextInput
        style={styles.input}
        placeholder="סטודנטים:"
        value={students}
        onChangeText={setStudents}
      />
      <TextInput
        style={styles.input}
        placeholder="רכב:"
        value={vehicle}
        onChangeText={setVehicle}
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>בוצע</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#85E1D7",
  },
  input: {
    height: 50,
    width: "100%",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: "#ffffff",
    textAlign: "right",
  },
  Drop: {
    textAlign: "right",
    justifyContent: "flex-end",
  },
  DropList: {
    textAlign: "right",
  },
  headerText: {
    fontSize: 25,
    fontWeight: "700",
    padding: 30,
  },
  button: {
    backgroundColor: "#5DBF72",
    padding: 10,
    marginTop: 10,
    borderRadius: 15,
    width: "40%",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 20,
  },
});

export default SetJobsPage;
