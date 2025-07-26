import { StyleSheet } from "react-native";
import Button from "../Common/Button";
import Input from "../Common/Input";
import { Text, View } from "../Themed";
import { useState } from "react";
import { useAppDispatch } from "@/store/hook/hook";
import { setMember } from "@/store/slices/membersSlice";
import axios from "axios";
import { baseUrl } from "@/constants/api";
import * as SecureStore from "expo-secure-store";
import fetchUser from "@/store/hook/thunks/useThunk";
const AddMember: React.FC = () => {
  const dispatch = useAppDispatch();
  const [id, setID] = useState<string>("");
  const [status, setStatus] = useState<"stable" | "loading" | "error">(
    "stable"
  );

  const onAdd = async () => {
    setStatus("loading");
    dispatch(setMember({ id, status: "Present", location: undefined }));
    setStatus("stable");
  };

  return (
    <View style={styles.container}>
      <Input
        placeholder="Member ID"
        borderColor="gray"
        fontFamily={"Medium"}
        onChangeText={setID}
        value={id}
      />
      <Button variant="primary" disabled={status == "loading"} onPress={onAdd}>
        Add
      </Button>
      {status == "error" && (
        <Text style={{ color: "red" }}>Something went wrong!</Text>
      )}
    </View>
  );
};

export default AddMember;

const styles = StyleSheet.create({
  container: {
    gap: 10,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  label: {
    fontSize: 15,
    marginBottom: 4,
    fontFamily: "Medium",
    color: "gray",
  },
});
